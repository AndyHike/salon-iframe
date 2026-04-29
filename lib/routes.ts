export const SUPPORTED_LOCALES = ['uk', 'cs', 'en'] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

type LocaleInput = string | { code?: string | null } | null | undefined;

const EXTERNAL_URL_PATTERN = /^[a-z][a-z\d+\-.]*:/i;

function normalizeLocaleValue(value: string | null | undefined): string {
  return value?.trim().toLowerCase() || '';
}

function splitHref(href: string): { pathname: string; suffix: string } {
  const queryIndex = href.indexOf('?');
  const hashIndex = href.indexOf('#');
  const suffixIndex = [queryIndex, hashIndex]
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];

  if (suffixIndex === undefined) {
    return { pathname: href, suffix: '' };
  }

  return {
    pathname: href.slice(0, suffixIndex),
    suffix: href.slice(suffixIndex),
  };
}

export function isSupportedLocale(locale: string | null | undefined): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(normalizeLocaleValue(locale) as SupportedLocale);
}

export function getAvailableLocaleCodes(locales: readonly LocaleInput[] | null | undefined): string[] {
  const localeCodes = (locales || [])
    .map((locale) => normalizeLocaleValue(typeof locale === 'string' ? locale : locale?.code))
    .filter(isSupportedLocale);

  return Array.from(new Set(localeCodes.length > 0 ? localeCodes : ['uk']));
}

export function getDefaultLocaleCode(
  defaultLocale: string | null | undefined,
  availableLocales: readonly LocaleInput[] | null | undefined,
): string {
  const localeCodes = getAvailableLocaleCodes(availableLocales);
  const normalizedDefault = normalizeLocaleValue(defaultLocale);

  if (localeCodes.includes(normalizedDefault)) {
    return normalizedDefault;
  }

  return localeCodes[0] || 'uk';
}

export function stripLocaleFromPath(pathname: string): string {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const segments = normalizedPath.split('/');
  const firstSegment = normalizeLocaleValue(segments[1]);

  if (!isSupportedLocale(firstSegment)) {
    return normalizedPath || '/';
  }

  const stripped = `/${segments.slice(2).join('/')}`.replace(/\/{2,}/g, '/');
  return stripped === '/' ? '/' : stripped.replace(/\/$/, '');
}

export function localizedPath(locale: string, href: string = '/'): string {
  const normalizedLocale = isSupportedLocale(locale) ? locale : 'uk';

  if (!href || href === '/') {
    return `/${normalizedLocale}`;
  }

  if (EXTERNAL_URL_PATTERN.test(href) || href.startsWith('//')) {
    return href;
  }

  if (href.startsWith('#')) {
    return `/${normalizedLocale}${href}`;
  }

  const hrefWithSlash = href.startsWith('/') ? href : `/${href}`;
  const { pathname, suffix } = splitHref(hrefWithSlash);
  const pathWithoutLocale = stripLocaleFromPath(pathname);

  return `/${normalizedLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}${suffix}`;
}

export function replaceLocaleInPathname(pathname: string, locale: string): string {
  return localizedPath(locale, pathname || '/');
}

export function serviceDetailHref(slug: string, locale?: string): string {
  const href = `/services/${encodeURIComponent(slug)}`;
  return locale ? localizedPath(locale, href) : href;
}

export function serviceBookingHref(serviceId: string, locale?: string): string {
  const href = `/?serviceId=${encodeURIComponent(serviceId)}#contacts`;
  return locale ? localizedPath(locale, href) : href;
}

export function servicesHref(locale?: string): string {
  return locale ? localizedPath(locale, '/services') : '/services';
}

export function galleryHref(locale?: string): string {
  return locale ? localizedPath(locale, '/gallery') : '/gallery';
}

export function siteOrigin(domain: string): string {
  const host = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const protocol =
    host.startsWith('localhost') ||
    host.startsWith('127.') ||
    host.startsWith('[::1]') ||
    host.endsWith('.localhost')
      ? 'http'
      : 'https';

  return `${protocol}://${host}`;
}

export function absoluteSiteUrl(domain: string, href: string): string {
  return `${siteOrigin(domain)}${href.startsWith('/') ? href : `/${href}`}`;
}

export function localizedLanguageAlternates(
  domain: string,
  availableLocales: readonly LocaleInput[] | null | undefined,
  path: string,
): Record<string, string> {
  return Object.fromEntries(
    getAvailableLocaleCodes(availableLocales).map((locale) => [
      locale,
      absoluteSiteUrl(domain, localizedPath(locale, path)),
    ]),
  );
}
