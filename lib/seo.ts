import type { Metadata } from 'next';
import { resolveLocalizedText } from '@/cms/normalize/localized';
import type { CmsItem, CmsSeoOverrides, CmsSettingsResponse, LocalizedString } from '@/cms/types';
import { formatServicePrice, getServiceDurationMinutes, getServiceImageList } from './service-data';
import {
  absoluteSiteUrl,
  getAvailableLocaleCodes,
  getDefaultLocaleCode,
  localizedLanguageAlternates,
  localizedPath,
  siteOrigin,
} from './routes';

type Settings = CmsSettingsResponse['data'];
type JsonLdNode = Record<string, unknown>;

type SeoCopy = {
  in: string;
  and: string;
  localBusiness: string;
  services: string;
  gallery: string;
  prices: string;
  bookOnline: string;
  viewServices: string;
  viewGallery: string;
};

const SEO_COPY: Record<string, SeoCopy> = {
  uk: {
    in: 'у',
    and: 'та',
    localBusiness: 'Локальний бізнес',
    services: 'Послуги',
    gallery: 'Галерея',
    prices: 'ціни',
    bookOnline: 'запишіться онлайн',
    viewServices: 'Перегляньте послуги, ціни, контакти',
    viewGallery: 'Перегляньте фото, послуги, контакти',
  },
  cs: {
    in: 'v',
    and: 'a',
    localBusiness: 'Lokální firma',
    services: 'Služby',
    gallery: 'Galerie',
    prices: 'ceny',
    bookOnline: 'rezervujte online',
    viewServices: 'Prohlédněte si služby, ceny a kontakty',
    viewGallery: 'Prohlédněte si fotky, služby a kontakty',
  },
  en: {
    in: 'in',
    and: 'and',
    localBusiness: 'Local business',
    services: 'Services',
    gallery: 'Gallery',
    prices: 'prices',
    bookOnline: 'book online',
    viewServices: 'View services, prices, and contact details',
    viewGallery: 'View photos, services, and contact details',
  },
};

const OPEN_GRAPH_LOCALE: Record<string, string> = {
  uk: 'uk_UA',
  cs: 'cs_CZ',
  en: 'en_US',
};

export type BusinessSeoProfile = {
  locale: string;
  defaultLocale: string;
  availableLocales: string[];
  siteUrl: string;
  businessId: string;
  websiteId: string;
  businessName: string;
  businessType: string;
  locationLabel: string;
  streetAddress: string;
  city: string;
  district: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  languages: string[];
  mainServiceTitles: string[];
  googleMapsUrl: string;
  googleReviewUrl: string;
  bookingUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  telegramUrl: string;
  ogImage?: string;
};

function compact(parts: Array<string | null | undefined>): string[] {
  return parts
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part));
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}...`;
}

function seoCopy(locale: string): SeoCopy {
  return SEO_COPY[locale] || SEO_COPY.en;
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

function normalizeUrl(url: string | null | undefined): string {
  return url?.trim() || '';
}

function absoluteAssetUrl(domain: string, url: string | null | undefined): string | undefined {
  const value = normalizeUrl(url);
  if (!value) return undefined;
  if (/^[a-z][a-z\d+\-.]*:/i.test(value) || value.startsWith('//')) return value;
  return absoluteSiteUrl(domain, value);
}

function parseLanguages(languages: string[] | string | null | undefined): string[] {
  if (Array.isArray(languages)) return languages.map((item) => item.trim()).filter(Boolean);
  if (typeof languages === 'string') {
    return languages
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function joinLocalizedList(items: string[], locale: string, maxItems = 3): string {
  const cleanItems = items.map((item) => item.trim()).filter(Boolean).slice(0, maxItems);
  if (cleanItems.length <= 1) return cleanItems[0] || '';

  const copy = seoCopy(locale);
  return `${cleanItems.slice(0, -1).join(', ')} ${copy.and} ${cleanItems[cleanItems.length - 1]}`;
}

function buildPageTitle(subject: string, businessName: string): string {
  if (!subject || subject === businessName) return businessName;
  return `${subject} | ${businessName}`;
}

function buildMetadata({
  profile,
  path,
  title,
  description,
  ogTitle,
  ogDescription,
  seo,
  ogImage,
}: {
  profile: BusinessSeoProfile;
  path: string;
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  seo?: CmsSeoOverrides | null;
  ogImage?: string;
}): Metadata {
  const canonicalPath = localizedPath(profile.locale, path);
  const image = absoluteAssetUrl(profile.siteUrl, ogImage || profile.ogImage);

  return {
    title,
    description,
    alternates: {
      canonical: absoluteSiteUrl(profile.siteUrl, canonicalPath),
      languages: localizedLanguageAlternates(profile.siteUrl, profile.availableLocales, path),
    },
    openGraph: {
      title: ogTitle || title,
      description: ogDescription || description,
      url: absoluteSiteUrl(profile.siteUrl, canonicalPath),
      siteName: profile.businessName,
      locale: OPEN_GRAPH_LOCALE[profile.locale],
      alternateLocale: profile.availableLocales
        .filter((locale) => locale !== profile.locale)
        .map((locale) => OPEN_GRAPH_LOCALE[locale] || locale),
      ...(image ? { images: [{ url: image }] } : {}),
    },
    robots: seo?.noindex ? { index: false, follow: false } : undefined,
  };
}

export function getBusinessName(settings: Settings, fallback = 'Business'): string {
  return settings.companyName || fallback;
}

export function getBusinessType(settings: Settings): string {
  return settings.businessType || settings.businessCategory || '';
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
  return `${subject} ${seoCopy(locale).in} ${location}`;
}

export function buildBusinessSeoProfile(
  settings: Settings,
  domain: string,
  requestedLocale?: string,
  services: CmsItem[] = [],
): BusinessSeoProfile {
  const availableLocales = getAvailableLocaleCodes(settings.availableLocales);
  const defaultLocale = getDefaultLocaleCode(settings.defaultLocale, availableLocales);
  const locale = requestedLocale && availableLocales.includes(requestedLocale)
    ? requestedLocale
    : defaultLocale;
  const mainServiceTitles = services
    .map((service) => resolveLocalizedText(service.title, locale, defaultLocale))
    .filter(Boolean);
  const origin = siteOrigin(domain);

  return {
    locale,
    defaultLocale,
    availableLocales,
    siteUrl: origin,
    businessId: `${origin}/#business`,
    websiteId: `${origin}/#website`,
    businessName: getBusinessName(settings, domain),
    businessType: getBusinessType(settings),
    locationLabel: getLocationLabel(settings),
    streetAddress: settings.streetAddress || settings.street || '',
    city: settings.city || '',
    district: settings.district || '',
    postalCode: settings.postalCode || '',
    country: settings.country || 'CZ',
    phone: settings.phone || '',
    email: settings.email || '',
    languages: parseLanguages(settings.languages),
    mainServiceTitles,
    googleMapsUrl: settings.googleMapsUrl || settings.addressUrl || '',
    googleReviewUrl: settings.googleReviewUrl || '',
    bookingUrl: settings.bookingUrl || '',
    instagramUrl: settings.instagramActive === false ? '' : settings.instagramUrl || '',
    facebookUrl: settings.facebookActive === false ? '' : settings.facebookUrl || '',
    telegramUrl: settings.telegramActive === false ? '' : settings.telegramUrl || '',
    ogImage: absoluteAssetUrl(domain, settings.seo?.ogImageOverride || settings.seo?.ogImage || settings.appearance.tokens.heroBackgroundImage),
  };
}

export function buildHomeH1(settings: Settings, services: CmsItem[], locale: string): string {
  const availableLocales = getAvailableLocaleCodes(settings.availableLocales);
  const defaultLocale = getDefaultLocaleCode(settings.defaultLocale, availableLocales);
  const resolvedLocale = availableLocales.includes(locale) ? locale : defaultLocale;
  const serviceSummary = joinLocalizedList(
    services.map((service) => resolveLocalizedText(service.title, resolvedLocale, defaultLocale)),
    resolvedLocale,
    2,
  );
  const subject = getBusinessType(settings) || serviceSummary || seoCopy(resolvedLocale).localBusiness;
  const seoH1 = readSeoText(settings.seo, ['h1Override', 'h1'], resolvedLocale, defaultLocale);

  return seoH1 || withLocation(subject, getLocationLabel(settings), resolvedLocale);
}

export function buildHomeHeroTitle(settings: Settings, services: CmsItem[], locale: string): string {
  const businessName = getBusinessName(settings, '').trim();

  return businessName || buildHomeH1(settings, services, locale);
}

export function buildServiceH1(serviceTitle: string, settings: Settings, locale: string): string {
  return withLocation(serviceTitle, getLocationLabel(settings), locale);
}

export function buildHomeMetadata(
  settings: Settings,
  services: CmsItem[],
  domain: string,
  requestedLocale?: string,
): Metadata {
  const profile = buildBusinessSeoProfile(settings, domain, requestedLocale, services);
  const h1 = buildHomeH1(settings, services, profile.locale);
  const serviceSummary = joinLocalizedList(profile.mainServiceTitles, profile.locale, 4) || profile.businessType || seoCopy(profile.locale).services.toLowerCase();
  const copy = seoCopy(profile.locale);
  const autoDescription = truncate(
    profile.locale === 'uk'
      ? `${profile.businessName} пропонує ${serviceSummary}${profile.locationLabel ? ` ${copy.in} ${profile.locationLabel}` : ''}. ${copy.viewServices} та ${copy.bookOnline}.`
      : profile.locale === 'cs'
        ? `${profile.businessName} nabízí ${serviceSummary}${profile.locationLabel ? ` ${copy.in} ${profile.locationLabel}` : ''}. ${copy.viewServices} a ${copy.bookOnline}.`
        : `${profile.businessName} offers ${serviceSummary}${profile.locationLabel ? ` ${copy.in} ${profile.locationLabel}` : ''}. ${copy.viewServices}, and ${copy.bookOnline}.`,
    155,
  );
  const title = readSeoText(settings.seo, ['titleOverride', 'title'], profile.locale, profile.defaultLocale) || buildPageTitle(h1, profile.businessName);
  const description = readSeoText(settings.seo, ['descriptionOverride', 'description'], profile.locale, profile.defaultLocale) || autoDescription;
  const ogTitle = readSeoText(settings.seo, ['ogTitleOverride', 'ogTitle'], profile.locale, profile.defaultLocale) || title;
  const ogDescription = readSeoText(settings.seo, ['ogDescriptionOverride', 'ogDescription'], profile.locale, profile.defaultLocale) || description;

  return buildMetadata({
    profile,
    path: '/',
    title,
    description,
    ogTitle,
    ogDescription,
    seo: settings.seo,
    ogImage: settings.seo?.ogImageOverride || settings.seo?.ogImage || undefined,
  });
}

export function buildServicesMetadata(
  settings: Settings,
  services: CmsItem[],
  domain: string,
  requestedLocale?: string,
): Metadata {
  const profile = buildBusinessSeoProfile(settings, domain, requestedLocale, services);
  const copy = seoCopy(profile.locale);
  const subject = withLocation(copy.services, profile.locationLabel, profile.locale);
  const serviceSummary = joinLocalizedList(profile.mainServiceTitles, profile.locale, 4);
  const description = truncate(
    profile.locale === 'uk'
      ? `${copy.services} ${profile.businessName}${profile.locationLabel ? ` ${copy.in} ${profile.locationLabel}` : ''}: ${serviceSummary || copy.prices}, опис, тривалість та онлайн-запис.`
      : profile.locale === 'cs'
        ? `${copy.services} ${profile.businessName}${profile.locationLabel ? ` ${copy.in} ${profile.locationLabel}` : ''}: ${serviceSummary || copy.prices}, popis, délka a online rezervace.`
        : `${copy.services} at ${profile.businessName}${profile.locationLabel ? ` ${copy.in} ${profile.locationLabel}` : ''}: ${serviceSummary || copy.prices}, descriptions, duration, and online booking.`,
    155,
  );

  return buildMetadata({
    profile,
    path: '/services',
    title: buildPageTitle(subject, profile.businessName),
    description,
    seo: settings.seo?.noindex ? settings.seo : null,
  });
}

export function buildGalleryMetadata(
  settings: Settings,
  domain: string,
  requestedLocale?: string,
): Metadata {
  const profile = buildBusinessSeoProfile(settings, domain, requestedLocale);
  const copy = seoCopy(profile.locale);
  const subject = withLocation(copy.gallery, profile.locationLabel, profile.locale);
  const description = truncate(
    profile.locale === 'uk'
      ? `${copy.gallery} ${profile.businessName}${profile.locationLabel ? ` ${copy.in} ${profile.locationLabel}` : ''}. ${copy.viewGallery} та ${copy.bookOnline}.`
      : profile.locale === 'cs'
        ? `${copy.gallery} ${profile.businessName}${profile.locationLabel ? ` ${copy.in} ${profile.locationLabel}` : ''}. ${copy.viewGallery} a ${copy.bookOnline}.`
        : `${copy.gallery} from ${profile.businessName}${profile.locationLabel ? ` ${copy.in} ${profile.locationLabel}` : ''}. ${copy.viewGallery}, and ${copy.bookOnline}.`,
    155,
  );

  return buildMetadata({
    profile,
    path: '/gallery',
    title: buildPageTitle(subject, profile.businessName),
    description,
    seo: settings.seo?.noindex ? settings.seo : null,
  });
}

export function buildServiceMetadata(
  service: CmsItem,
  settings: Settings,
  domain: string,
  requestedLocale?: string,
): Metadata {
  const profile = buildBusinessSeoProfile(settings, domain, requestedLocale, [service]);
  const serviceTitle = resolveLocalizedText(service.title, profile.locale, profile.defaultLocale);
  const serviceDescription = resolveLocalizedText(service.description, profile.locale, profile.defaultLocale);
  const h1 = buildServiceH1(serviceTitle, settings, profile.locale);
  const duration = getServiceDurationMinutes(service);
  const seo = service.seo || null;
  const firstImage = getServiceImageList(service)[0]?.filePath || settings.seo?.ogImageOverride || settings.seo?.ogImage || undefined;
  const price = formatServicePrice(service, '');

  const autoTitle = buildPageTitle(h1, profile.businessName);
  const autoDescription = truncate(
    serviceDescription ||
      compact([
        `${serviceTitle}${profile.locationLabel ? ` - ${profile.locationLabel}` : ''}.`,
        price ? `Price: ${price}.` : null,
        duration ? `Duration: ${duration} min.` : null,
        `Book online at ${profile.businessName}.`,
      ]).join(' '),
    155,
  );

  const title = readSeoText(seo, ['titleOverride', 'title'], profile.locale, profile.defaultLocale) || autoTitle;
  const description = readSeoText(seo, ['descriptionOverride', 'description'], profile.locale, profile.defaultLocale) || autoDescription;
  const ogTitle = readSeoText(seo, ['ogTitleOverride', 'ogTitle'], profile.locale, profile.defaultLocale) || title;
  const ogDescription = readSeoText(seo, ['ogDescriptionOverride', 'ogDescription'], profile.locale, profile.defaultLocale) || description;

  return buildMetadata({
    profile,
    path: `/services/${encodeURIComponent(service.slug)}`,
    title,
    description,
    ogTitle,
    ogDescription,
    seo,
    ogImage: seo?.ogImageOverride || seo?.ogImage || firstImage || undefined,
  });
}

function businessSchemaType(profile: BusinessSeoProfile): string {
  const value = `${profile.businessType} ${profile.mainServiceTitles.join(' ')}`.toLowerCase();

  if (/(nail|manicure|pedicure|ногт|нігт|манік|neht)/i.test(value)) return 'NailSalon';
  if (/(hair|barber|перук|волос|vlasy|kadeř)/i.test(value)) return 'HairSalon';
  if (/(beauty|salon|cosmet|крас|космет|krás|kosmet)/i.test(value)) return 'BeautySalon';

  return 'LocalBusiness';
}

function postalAddress(profile: BusinessSeoProfile): JsonLdNode | undefined {
  const address = {
    '@type': 'PostalAddress',
    streetAddress: profile.streetAddress || undefined,
    addressLocality: profile.city || undefined,
    addressRegion: profile.district || undefined,
    postalCode: profile.postalCode || undefined,
    addressCountry: profile.country || undefined,
  };

  return Object.values(address).some(Boolean) ? address : undefined;
}

function buildJsonLdGraph(nodes: Array<JsonLdNode | null | undefined>): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter(Boolean),
  };
}

function buildBusinessJsonLd(profile: BusinessSeoProfile): JsonLdNode {
  const sameAs = compact([
    profile.instagramUrl,
    profile.facebookUrl,
    profile.telegramUrl,
  ]);

  return {
    '@type': businessSchemaType(profile),
    '@id': profile.businessId,
    name: profile.businessName,
    url: profile.siteUrl,
    telephone: profile.phone || undefined,
    email: profile.email || undefined,
    address: postalAddress(profile),
    areaServed: profile.city ? { '@type': 'City', name: profile.city } : undefined,
    hasMap: profile.googleMapsUrl || undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    image: profile.ogImage || undefined,
    knowsLanguage: profile.languages.length > 0 ? profile.languages : undefined,
  };
}

function buildWebsiteJsonLd(profile: BusinessSeoProfile): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': profile.websiteId,
    name: profile.businessName,
    url: profile.siteUrl,
    inLanguage: profile.locale,
    publisher: {
      '@id': profile.businessId,
    },
  };
}

function buildBreadcrumbJsonLd(profile: BusinessSeoProfile, items: Array<{ name: string; path: string }>): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteSiteUrl(profile.siteUrl, localizedPath(profile.locale, item.path)),
    })),
  };
}

export function buildHomeJsonLd(settings: Settings, services: CmsItem[], domain: string, requestedLocale?: string): JsonLdNode {
  const profile = buildBusinessSeoProfile(settings, domain, requestedLocale, services);
  return buildJsonLdGraph([
    buildBusinessJsonLd(profile),
    buildWebsiteJsonLd(profile),
  ]);
}

export function buildServicesJsonLd(settings: Settings, services: CmsItem[], domain: string, requestedLocale?: string): JsonLdNode {
  const profile = buildBusinessSeoProfile(settings, domain, requestedLocale, services);
  const copy = seoCopy(profile.locale);

  return buildJsonLdGraph([
    buildBusinessJsonLd(profile),
    buildWebsiteJsonLd(profile),
    buildBreadcrumbJsonLd(profile, [
      { name: profile.businessName, path: '/' },
      { name: copy.services, path: '/services' },
    ]),
    services.length > 0
      ? {
          '@type': 'ItemList',
          name: copy.services,
          itemListElement: services.map((service, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: resolveLocalizedText(service.title, profile.locale, profile.defaultLocale),
            url: absoluteSiteUrl(profile.siteUrl, localizedPath(profile.locale, `/services/${encodeURIComponent(service.slug)}`)),
          })),
        }
      : null,
  ]);
}

export function buildGalleryJsonLd(settings: Settings, galleryItems: CmsItem[], domain: string, requestedLocale?: string): JsonLdNode {
  const profile = buildBusinessSeoProfile(settings, domain, requestedLocale);
  const copy = seoCopy(profile.locale);
  const images = galleryItems
    .flatMap((item) => item.images || [])
    .map((image) => absoluteAssetUrl(domain, image.filePath))
    .filter((image): image is string => Boolean(image))
    .slice(0, 20);

  return buildJsonLdGraph([
    buildBusinessJsonLd(profile),
    buildWebsiteJsonLd(profile),
    buildBreadcrumbJsonLd(profile, [
      { name: profile.businessName, path: '/' },
      { name: copy.gallery, path: '/gallery' },
    ]),
    images.length > 0
      ? {
          '@type': 'ImageGallery',
          name: `${copy.gallery} ${profile.businessName}`,
          url: absoluteSiteUrl(profile.siteUrl, localizedPath(profile.locale, '/gallery')),
          image: images,
        }
      : null,
  ]);
}

export function buildServiceJsonLd(service: CmsItem, settings: Settings, domain: string, requestedLocale?: string): JsonLdNode {
  const profile = buildBusinessSeoProfile(settings, domain, requestedLocale, [service]);
  const copy = seoCopy(profile.locale);
  const serviceTitle = resolveLocalizedText(service.title, profile.locale, profile.defaultLocale);
  const serviceDescription = resolveLocalizedText(service.description, profile.locale, profile.defaultLocale);
  const price = typeof service.price === 'number'
    ? service.price
    : typeof service.price === 'string'
      ? Number(service.price.replace(',', '.').match(/\d+(\.\d+)?/)?.[0] || NaN)
      : NaN;
  const images = getServiceImageList(service)
    .map((image) => absoluteAssetUrl(domain, image.filePath))
    .filter((image): image is string => Boolean(image));

  return buildJsonLdGraph([
    buildBusinessJsonLd(profile),
    buildWebsiteJsonLd(profile),
    buildBreadcrumbJsonLd(profile, [
      { name: profile.businessName, path: '/' },
      { name: copy.services, path: '/services' },
      { name: serviceTitle, path: `/services/${encodeURIComponent(service.slug)}` },
    ]),
    {
      '@type': 'Service',
      '@id': absoluteSiteUrl(profile.siteUrl, `${localizedPath(profile.locale, `/services/${encodeURIComponent(service.slug)}`)}#service`),
      name: serviceTitle,
      description: serviceDescription || undefined,
      provider: {
        '@id': profile.businessId,
      },
      areaServed: profile.city ? { '@type': 'City', name: profile.city } : undefined,
      image: images.length > 0 ? images : undefined,
      offers: Number.isFinite(price)
        ? {
            '@type': 'Offer',
            price,
            priceCurrency: 'CZK',
            url: absoluteSiteUrl(profile.siteUrl, localizedPath(profile.locale, `/services/${encodeURIComponent(service.slug)}`)),
            availability: 'https://schema.org/InStock',
          }
        : undefined,
    },
  ]);
}
