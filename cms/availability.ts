import type { SiteAvailability, SiteAvailabilityCode, SiteAvailabilityMode } from './types';

const AVAILABILITY_CODES: SiteAvailabilityCode[] = [
  'STORE_SUSPENDED',
  'SITE_MAINTENANCE',
  'SITE_TEMPORARILY_CLOSED',
];

export const SITE_AVAILABILITY_FALLBACKS: Record<
  SiteAvailabilityCode,
  { eyebrow: string; title: string; message: string }
> = {
  STORE_SUSPENDED: {
    eyebrow: 'Unavailable',
    title: 'This site is currently unavailable',
    message: 'The site is temporarily unavailable. Please check back later.',
  },
  SITE_MAINTENANCE: {
    eyebrow: 'Maintenance',
    title: 'We are doing a little maintenance',
    message: 'The site is temporarily in maintenance mode. Please come back soon.',
  },
  SITE_TEMPORARILY_CLOSED: {
    eyebrow: 'Temporarily closed',
    title: 'We are temporarily closed',
    message: 'The site is temporarily closed. Please check back later.',
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

function resolveAvailabilityCode(code: unknown, mode: unknown): SiteAvailabilityCode | null {
  if (typeof code === 'string' && AVAILABILITY_CODES.includes(code as SiteAvailabilityCode)) {
    return code as SiteAvailabilityCode;
  }

  if (mode === 'SUSPENDED') return 'STORE_SUSPENDED';
  if (mode === 'MAINTENANCE') return 'SITE_MAINTENANCE';
  if (mode === 'TEMPORARILY_CLOSED') return 'SITE_TEMPORARILY_CLOSED';

  return null;
}

export function parseSiteAvailability(status: number, body: unknown): SiteAvailability | null {
  if (status !== 403 || !isRecord(body)) {
    return null;
  }

  const code = resolveAvailabilityCode(body.code, body.mode);
  if (!code) {
    return null;
  }

  return {
    status: 403,
    success: false,
    code,
    mode: readString(body.mode) as SiteAvailabilityMode | null,
    source: readString(body.source),
    message: readString(body.message),
    until: readString(body.until),
    error: readString(body.error),
  };
}

export function getSiteAvailabilityFallback(code: SiteAvailabilityCode) {
  return SITE_AVAILABILITY_FALLBACKS[code];
}
