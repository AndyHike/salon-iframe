import { headers } from 'next/headers';
import { parseSiteAvailability } from './availability';
import type { SiteAvailability } from './types';

const DEFAULT_CMS_REVALIDATE_SECONDS = Number.parseInt(
  process.env.CMS_CACHE_REVALIDATE_SECONDS || '86400',
  10,
);

function resolveDefaultRevalidateSeconds(): number {
  return Number.isFinite(DEFAULT_CMS_REVALIDATE_SECONDS) && DEFAULT_CMS_REVALIDATE_SECONDS >= 0
    ? DEFAULT_CMS_REVALIDATE_SECONDS
    : 86400;
}

function readFirstHeaderValue(value: string | null): string | null {
  return value?.split(',')[0]?.trim() || null;
}

function stripHostPort(host: string): string {
  if (host.startsWith('[')) {
    return host.slice(1).split(']')[0] || host;
  }

  return host.split(':')[0] || host;
}

export async function resolveHostFromHeaders(): Promise<string> {
  const headersList = await headers();
  const forwardedHost = readFirstHeaderValue(headersList.get('x-forwarded-host'));
  if (forwardedHost) return forwardedHost;
  
  const host = readFirstHeaderValue(headersList.get('host'));
  if (host) return host;
  
  return 'localhost';
}

export async function resolveDomainFromHeaders(): Promise<string> {
  return stripHostPort(await resolveHostFromHeaders());
}

export async function cmsFetch<T>(
  path: string,
  options: {
    domain: string;
    method?: string;
    body?: any;
    tags?: string[];
    revalidate?: number;
    cache?: RequestCache;
  }
): Promise<T | null> {
  const result = await cmsFetchResult<T>(path, options);
  return result.ok ? result.data : null;
}

export type CmsFetchResult<T> =
  | {
      ok: true;
      status: number;
      data: T;
    }
  | {
      ok: false;
      status: number;
      statusText: string;
      body: unknown;
      availability: SiteAvailability | null;
      error?: unknown;
    };

async function readResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function resolveAcceptLanguageHeader(): Promise<string | null> {
  try {
    const headersList = await headers();
    return headersList.get('accept-language');
  } catch {
    return null;
  }
}

export async function cmsFetchResult<T>(
  path: string,
  options: {
    domain: string;
    method?: string;
    body?: any;
    tags?: string[];
    revalidate?: number;
    cache?: RequestCache;
  }
): Promise<CmsFetchResult<T>> {
  const { domain, method = 'GET', body, tags, revalidate, cache } = options;
  const baseUrl = process.env.ADMIN_API_URL || 'http://localhost:3000';
  const masterKey = process.env.SYSTEM_MASTER_KEY;

  if (!masterKey) {
    console.error('SYSTEM_MASTER_KEY is not set');
    return {
      ok: false,
      status: 0,
      statusText: 'Missing SYSTEM_MASTER_KEY',
      body: null,
      availability: null,
    };
  }

  const url = new URL(path, baseUrl);
  url.searchParams.set('domain', domain);
  const acceptLanguage = await resolveAcceptLanguageHeader();

  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Authorization': `Bearer ${masterKey}`,
      'Content-Type': 'application/json',
      ...(acceptLanguage ? { 'Accept-Language': acceptLanguage } : {}),
    },
  };

  if (cache) {
    fetchOptions.cache = cache;
  }

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  const isGetRequest = method.toUpperCase() === 'GET';
  const effectiveRevalidate = revalidate !== undefined
    ? revalidate
    : isGetRequest && tags?.length && cache !== 'no-store'
      ? resolveDefaultRevalidateSeconds()
      : undefined;

  if (tags || effectiveRevalidate !== undefined) {
    fetchOptions.next = {};
    if (tags) fetchOptions.next.tags = tags;
    if (effectiveRevalidate !== undefined) fetchOptions.next.revalidate = effectiveRevalidate;
  }

  try {
    const response = await fetch(url.toString(), fetchOptions);
    const responseBody = await readResponseBody(response);

    if (!response.ok) {
      console.error(`CMS fetch failed: ${response.status} ${response.statusText} for ${url.toString()}`);
      return {
        ok: false,
        status: response.status,
        statusText: response.statusText,
        body: responseBody,
        availability: parseSiteAvailability(response.status, responseBody),
      };
    }

    return {
      ok: true,
      status: response.status,
      data: responseBody as T,
    };
  } catch (error) {
    console.error(`CMS fetch error for ${url.toString()}:`, error);
    return {
      ok: false,
      status: 0,
      statusText: 'Fetch failed',
      body: null,
      availability: null,
      error,
    };
  }
}
