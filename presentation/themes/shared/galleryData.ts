import { resolveLocalizedText } from '@/cms/normalize/localized';
import type { CmsItem } from '@/cms/types';

export type GalleryServiceOption = {
  id: string;
  slug: string;
  title: string;
};

export type GalleryImageItem = {
  id: string;
  filePath: string;
  altText: string;
  sourceTitle: string;
  services: GalleryServiceOption[];
  serviceIds: string[];
};

type ServiceTarget = {
  id?: string;
  title?: Record<string, string> | string;
  slug?: string;
};

type UnknownRecord = Record<string, unknown>;

type GalleryImageSource = NonNullable<CmsItem['images']>[number] & {
  attributes?: Record<string, unknown> | null;
  linkedItems?: unknown[];
  links?: unknown[];
  relatedItems?: unknown[];
  services?: unknown[];
  service?: unknown;
  serviceId?: unknown;
  serviceIds?: unknown;
  serviceSlug?: unknown;
  serviceSlugs?: unknown;
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

function readStringList(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) {
    return value.flatMap((entry) => readStringList(entry));
  }

  if (isRecord(value)) {
    return [
      ...readStringList(value.id),
      ...readStringList(value.slug),
      ...readStringList(value.serviceId),
      ...readStringList(value.serviceSlug),
    ];
  }

  return [];
}

function readAttributeServiceKeys(attributes: CmsItem['attributes']): string[] {
  if (!attributes) return [];

  return [
    ...readStringList(attributes.serviceId),
    ...readStringList(attributes.serviceIds),
    ...readStringList(attributes.serviceSlug),
    ...readStringList(attributes.serviceSlugs),
    ...readStringList(attributes.linkedServiceId),
    ...readStringList(attributes.linkedServiceIds),
    ...readStringList(attributes.relatedServiceId),
    ...readStringList(attributes.relatedServiceIds),
    ...readStringList(attributes.service),
    ...readStringList(attributes.services),
  ];
}

function readDirectServiceKeys(source: UnknownRecord): string[] {
  return [
    ...readStringList(source.serviceId),
    ...readStringList(source.serviceIds),
    ...readStringList(source.serviceSlug),
    ...readStringList(source.serviceSlugs),
    ...readStringList(source.linkedServiceId),
    ...readStringList(source.linkedServiceIds),
    ...readStringList(source.relatedServiceId),
    ...readStringList(source.relatedServiceIds),
    ...readStringList(source.service),
    ...readStringList(source.services),
  ];
}

function readTargetCandidate(value: unknown): ServiceTarget | null {
  if (!isRecord(value)) return null;

  const target =
    value.targetItem ||
    value.target ||
    value.item ||
    value.service ||
    value.linkedItem ||
    value.relatedItem ||
    value;

  if (!isRecord(target)) return null;

  const id = typeof target.id === 'string' ? target.id : undefined;
  const slug = typeof target.slug === 'string' ? target.slug : undefined;
  const title =
    isRecord(target.title) || typeof target.title === 'string'
      ? target.title as Record<string, string> | string
      : undefined;

  if (!id && !slug && !title) return null;

  return { id, slug, title };
}

function readLinkedArrays(source: UnknownRecord): unknown[] {
  return [
    ...(Array.isArray(source.linkedItems) ? source.linkedItems : []),
    ...(Array.isArray(source.links) ? source.links : []),
    ...(Array.isArray(source.relatedItems) ? source.relatedItems : []),
    ...(Array.isArray(source.services) ? source.services : []),
  ];
}

function toServiceOption(
  service: ServiceTarget,
  locale: string,
  defaultLocale: string,
): GalleryServiceOption {
  const titleRecord =
    typeof service.title === 'string'
      ? { [defaultLocale]: service.title }
      : service.title;
  const title = resolveLocalizedText(titleRecord, locale, defaultLocale);
  const slug = service.slug || service.id || title;

  return {
    id: service.id || slug,
    slug,
    title: title || slug,
  };
}

function uniqueServices(services: GalleryServiceOption[]): GalleryServiceOption[] {
  const seen = new Set<string>();
  const result: GalleryServiceOption[] = [];

  services.forEach((service) => {
    if (seen.has(service.id)) return;
    seen.add(service.id);
    result.push(service);
  });

  return result;
}

function getLinkedServices(
  item: CmsItem,
  image: GalleryImageSource,
  servicesItems: CmsItem[],
  locale: string,
  defaultLocale: string,
): GalleryServiceOption[] {
  const serviceById = new Map(servicesItems.map((service) => [service.id, service]));
  const serviceBySlug = new Map(servicesItems.map((service) => [service.slug, service]));
  const linkedServices: GalleryServiceOption[] = [];

  const addKnownServiceByKey = (key: string) => {
    const service = serviceById.get(key) || serviceBySlug.get(key);
    if (!service) return;
    linkedServices.push(toServiceOption(service, locale, defaultLocale));
  };

  const addLinkedTarget = (link: unknown) => {
    if (!isRecord(link)) return;

    const target = readTargetCandidate(link);
    if (!target) return;

    const knownService =
      (target.id ? serviceById.get(target.id) : undefined) ||
      (target.slug ? serviceBySlug.get(target.slug) : undefined);
    const linkType = typeof link.type === 'string' ? link.type.toLowerCase() : '';
    const looksLikeService = linkType.includes('service') || linkType.includes('posl');

    if (!knownService && servicesItems.length > 0 && !looksLikeService) return;

    linkedServices.push(toServiceOption(knownService || target, locale, defaultLocale));
  };

  readLinkedArrays(item as unknown as UnknownRecord).forEach(addLinkedTarget);
  readLinkedArrays(image as unknown as UnknownRecord).forEach(addLinkedTarget);

  readAttributeServiceKeys(item.attributes).forEach((key) => {
    addKnownServiceByKey(key);
  });

  readAttributeServiceKeys(image.attributes).forEach(addKnownServiceByKey);
  readDirectServiceKeys(image as unknown as UnknownRecord).forEach(addKnownServiceByKey);
  readDirectServiceKeys(item as unknown as UnknownRecord).forEach(addKnownServiceByKey);

  return uniqueServices(linkedServices);
}

function getFallbackAltText(sourceTitle: string, locale: string, index: number): string {
  if (sourceTitle) return sourceTitle;

  const fallbackByLocale: Record<string, string> = {
    uk: 'Фото',
    cs: 'Fotka',
    en: 'Photo',
  };

  return `${fallbackByLocale[locale] || fallbackByLocale.en} ${index + 1}`;
}

export function buildGalleryImages(
  galleryItems: CmsItem[],
  servicesItems: CmsItem[],
  locale: string,
  defaultLocale: string,
): GalleryImageItem[] {
  return galleryItems.flatMap((item) => {
    const sourceTitle = resolveLocalizedText(item.title, locale, defaultLocale);

    return (item.images || []).flatMap((image, index) => {
      if (!image.filePath) return [];

      const imageSource = image as GalleryImageSource;
      const services = getLinkedServices(item, imageSource, servicesItems, locale, defaultLocale);
      const serviceIds = services.map((service) => service.id);

      return [{
        id: `${item.id}:${image.id || index}`,
        filePath: image.filePath,
        altText: image.altText || getFallbackAltText(sourceTitle, locale, index),
        sourceTitle,
        services,
        serviceIds,
      }];
    });
  });
}

export function buildGalleryServiceFilters(
  images: GalleryImageItem[],
  servicesItems: CmsItem[],
  locale: string,
  defaultLocale: string,
): GalleryServiceOption[] {
  const linkedServiceIds = new Set(images.flatMap((image) => image.serviceIds));
  const orderedFilters: GalleryServiceOption[] = [];

  servicesItems.forEach((service) => {
    if (!linkedServiceIds.has(service.id)) return;
    orderedFilters.push(toServiceOption(service, locale, defaultLocale));
  });

  images.forEach((image) => {
    image.services.forEach((service) => {
      if (!linkedServiceIds.has(service.id)) return;
      orderedFilters.push(service);
    });
  });

  return uniqueServices(orderedFilters);
}

export function filterGalleryImages(
  images: GalleryImageItem[],
  activeServiceId: string,
): GalleryImageItem[] {
  if (activeServiceId === 'all') return images;
  return images.filter((image) => image.serviceIds.includes(activeServiceId));
}
