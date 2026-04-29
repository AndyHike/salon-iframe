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
  id: string;
  title: Record<string, string>;
  slug: string;
};

function readStringList(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) {
    return value.flatMap((entry) => (typeof entry === 'string' ? [entry] : []));
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
  ];
}

function toServiceOption(
  service: ServiceTarget,
  locale: string,
  defaultLocale: string,
): GalleryServiceOption {
  return {
    id: service.id,
    slug: service.slug,
    title: resolveLocalizedText(service.title, locale, defaultLocale) || service.slug,
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
  servicesItems: CmsItem[],
  locale: string,
  defaultLocale: string,
): GalleryServiceOption[] {
  const serviceById = new Map(servicesItems.map((service) => [service.id, service]));
  const serviceBySlug = new Map(servicesItems.map((service) => [service.slug, service]));
  const linkedServices: GalleryServiceOption[] = [];

  (item.linkedItems || []).forEach((link) => {
    const target = link.targetItem;
    const knownService = serviceById.get(target.id) || serviceBySlug.get(target.slug);
    const looksLikeService = link.type.toLowerCase().includes('service');

    if (!knownService && servicesItems.length > 0 && !looksLikeService) return;

    linkedServices.push(toServiceOption(knownService || target, locale, defaultLocale));
  });

  readAttributeServiceKeys(item.attributes).forEach((key) => {
    const service = serviceById.get(key) || serviceBySlug.get(key);
    if (!service) return;

    linkedServices.push(toServiceOption(service, locale, defaultLocale));
  });

  return uniqueServices(linkedServices);
}

export function buildGalleryImages(
  galleryItems: CmsItem[],
  servicesItems: CmsItem[],
  locale: string,
  defaultLocale: string,
): GalleryImageItem[] {
  return galleryItems.flatMap((item) => {
    const sourceTitle = resolveLocalizedText(item.title, locale, defaultLocale);
    const services = getLinkedServices(item, servicesItems, locale, defaultLocale);
    const serviceIds = services.map((service) => service.id);

    return (item.images || []).flatMap((image, index) => {
      if (!image.filePath) return [];

      return [{
        id: `${item.id}:${image.id || index}`,
        filePath: image.filePath,
        altText: image.altText || sourceTitle || `Gallery image ${index + 1}`,
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
