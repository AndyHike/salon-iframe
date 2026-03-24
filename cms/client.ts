import { headers } from 'next/headers';

export async function resolveDomainFromHeaders(): Promise<string> {
  const headersList = await headers();
  const forwardedHost = headersList.get('x-forwarded-host');
  if (forwardedHost) return forwardedHost;
  
  const host = headersList.get('host');
  if (host) return host;
  
  return 'localhost';
}

export async function cmsFetch<T>(
  path: string,
  options: {
    domain: string;
    method?: string;
    body?: any;
    tags?: string[];
    revalidate?: number;
  }
): Promise<T | null> {
  const { domain, method = 'GET', body, tags, revalidate } = options;
  const baseUrl = process.env.CMS_BASE_URL || 'http://localhost:3000';
  const masterKey = process.env.SYSTEM_MASTER_KEY;

  if (!masterKey) {
    console.error('SYSTEM_MASTER_KEY is not set');
    return null;
  }

  const url = new URL(path, baseUrl);
  url.searchParams.set('domain', domain);

  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Authorization': `Bearer ${masterKey}`,
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  if (tags || revalidate !== undefined) {
    fetchOptions.next = {};
    if (tags) fetchOptions.next.tags = tags;
    if (revalidate !== undefined) fetchOptions.next.revalidate = revalidate;
  }

  try {
    const response = await fetch(url.toString(), fetchOptions);
    if (!response.ok) {
      console.error(`CMS fetch failed: ${response.status} ${response.statusText} for ${url.toString()}`);
      return null;
    }
    return await response.json() as T;
  } catch (error) {
    console.error(`CMS fetch error for ${url.toString()}:`, error);
    return null;
  }
}
