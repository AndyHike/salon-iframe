const HOST_LABEL_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
const DISALLOWED_HOST_CHARS = /[\s/:\\?#@%]/;

export function stripHostPort(host: string): string {
  if (host.startsWith('[')) {
    return host.slice(1).split(']')[0] || host;
  }

  return host.split(':')[0] || host;
}

function isValidIpv4Address(host: string): boolean {
  const parts = host.split('.');
  if (parts.length !== 4) return false;

  return parts.every((part) => {
    if (!/^(0|[1-9]\d{0,2})$/.test(part)) return false;
    return Number(part) <= 255;
  });
}

export function normalizeRequestDomain(domain: string | null | undefined): string | null {
  const normalized = domain?.trim().toLowerCase();
  if (!normalized || normalized.length > 253) return null;
  if (DISALLOWED_HOST_CHARS.test(normalized)) return null;
  if (normalized.startsWith('.') || normalized.endsWith('.') || normalized.includes('..')) return null;

  if (normalized === 'localhost') return normalized;
  if (isValidIpv4Address(normalized)) return normalized;

  const labels = normalized.split('.');
  if (labels.length < 2) return null;
  if (!labels.every((label) => HOST_LABEL_PATTERN.test(label))) return null;
  if (/^\d+$/.test(labels[labels.length - 1])) return null;

  return normalized;
}

export function requestDomainMatchesHost(domain: string, host: string | null | undefined): boolean {
  const normalizedDomain = normalizeRequestDomain(domain);
  const normalizedHost = normalizeRequestDomain(host ? stripHostPort(host) : null);

  return Boolean(normalizedDomain && normalizedHost && normalizedDomain === normalizedHost);
}
