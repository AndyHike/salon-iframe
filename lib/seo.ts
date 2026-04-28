import type { Metadata } from 'next';
import { resolveLocalizedText } from '@/cms/normalize/localized';
import type { CmsItem, CmsSeoOverrides, CmsSettingsResponse, LocalizedString } from '@/cms/types';
import { getServiceDurationMinutes, getServiceImageList } from './service-data';

type Settings = CmsSettingsResponse['data'];

function compact(parts: Array<string | null | undefined>): string[] {
  return parts
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part));
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}...`;
}

function resolveMaybeLocalized(value: LocalizedString | null | undefined, locale: string, defaultLocale: string): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return resolveLocalizedText(value, locale, defaultLocale);
}

function readSeoText(
  seo: CmsSeoOverrides | null | undefined,
  keys: Array<keyof CmsSeoOverrides>,
  locale: string,
  defaultLocale: string,
): string {
  if (!seo) return '';

  for (const key of keys) {
    const value = seo[key];
    if (typeof value === 'string' || value && typeof value === 'object' && !Array.isArray(value)) {
      const resolved = resolveMaybeLocalized(value as LocalizedString, locale, defaultLocale);
      if (resolved) return resolved;
    }
  }

  return '';
}

export function getBusinessName(settings: Settings, fallback = 'Salon'): string {
  return settings.companyName || fallback;
}

export function getBusinessType(settings: Settings): string {
  return settings.businessType || settings.businessCategory || 'Beauty salon';
}

export function getLocationLabel(settings: Settings): string {
  const cityAndDistrict = compact([settings.city, settings.district]).join(', ');
  if (cityAndDistrict) return cityAndDistrict;

  const addressParts = compact([
    settings.streetAddress || settings.street,
    settings.city,
    settings.postalCode,
  ]).join(', ');

  return addressParts || settings.address || '';
}

export function withLocation(subject: string, location: string, locale: string): string {
  if (!location) return subject;

  const preposition = locale === 'cs' ? 'v' : locale === 'en' ? 'in' : 'у';
  return `${subject} ${preposition} ${location}`;
}

export function buildServiceH1(serviceTitle: string, settings: Settings, locale: string): string {
  return withLocation(serviceTitle, getLocationLabel(settings), locale);
}

export function buildServiceMetadata(
  service: CmsItem,
  settings: Settings,
  domain: string,
): Metadata {
  const defaultLocale = settings.defaultLocale || 'uk';
  const locale = defaultLocale;
  const serviceTitle = resolveLocalizedText(service.title, locale, defaultLocale);
  const serviceDescription = resolveLocalizedText(service.description, locale, defaultLocale);
  const businessName = getBusinessName(settings, domain);
  const h1 = buildServiceH1(serviceTitle, settings, locale);
  const duration = getServiceDurationMinutes(service);
  const location = getLocationLabel(settings);
  const seo = service.seo || null;
  const firstImage = getServiceImageList(service)[0]?.filePath || settings.seo?.ogImageOverride || settings.seo?.ogImage || undefined;

  const autoTitle = `${h1} | ${businessName}`;
  const autoDescription = truncate(
    serviceDescription ||
      compact([
        `${serviceTitle}${location ? ` - ${location}` : ''}.`,
        service.price ? `Price: ${service.price}.` : null,
        duration ? `Duration: ${duration} min.` : null,
        `Book online at ${businessName}.`,
      ]).join(' '),
    155,
  );

  const title = readSeoText(seo, ['titleOverride', 'title'], locale, defaultLocale) || autoTitle;
  const description = readSeoText(seo, ['descriptionOverride', 'description'], locale, defaultLocale) || autoDescription;
  const ogTitle = readSeoText(seo, ['ogTitleOverride', 'ogTitle'], locale, defaultLocale) || title;
  const ogDescription = readSeoText(seo, ['ogDescriptionOverride', 'ogDescription'], locale, defaultLocale) || description;
  const ogImage = seo?.ogImageOverride || seo?.ogImage || firstImage;

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    robots: seo?.noindex ? { index: false, follow: false } : undefined,
  };
}
