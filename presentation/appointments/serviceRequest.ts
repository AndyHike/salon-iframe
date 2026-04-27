import { resolveLocalizedText } from '../../cms/normalize/localized';
import type { CmsItem, CmsItemCategory } from '../../cms/types';

export type AppointmentRequestSource = 'contact_form' | 'services_section' | 'hero_cta';

export type AppointmentServiceSelection = {
  serviceId: string;
  serviceTitle: string;
  servicePrice?: string;
  serviceDurationMinutes?: number;
  categoryId?: string;
  categoryTitle?: string;
  source: AppointmentRequestSource;
};

function readDurationMinutes(attributes: Record<string, unknown> | null | undefined): number | undefined {
  if (!attributes) return undefined;

  const rawValue =
    attributes.serviceDurationMinutes ??
    attributes.durationMinutes ??
    attributes.duration ??
    attributes.duration_min;

  if (typeof rawValue === 'number' && Number.isFinite(rawValue)) {
    return Math.round(rawValue);
  }

  if (typeof rawValue === 'string') {
    const match = rawValue.match(/\d+/);
    if (match) {
      return Number(match[0]);
    }
  }

  return undefined;
}

function pickSnapshotCategory(item: CmsItem): CmsItemCategory | undefined {
  if (!item.categories || item.categories.length === 0) return undefined;
  return item.categories.find((category) => category.slug !== 'services') ?? item.categories[0];
}

export function createAppointmentServiceSelection(
  item: CmsItem,
  locale: string,
  defaultLocale: string,
  source: AppointmentRequestSource,
  priceFallback?: string,
): AppointmentServiceSelection {
  const category = pickSnapshotCategory(item);
  const servicePrice = item.price === null || item.price === undefined || item.price === ''
    ? priceFallback
    : String(item.price);

  return {
    serviceId: item.id,
    serviceTitle: resolveLocalizedText(item.title, locale, defaultLocale),
    ...(servicePrice ? { servicePrice } : {}),
    ...(readDurationMinutes(item.attributes) ? { serviceDurationMinutes: readDurationMinutes(item.attributes) } : {}),
    ...(category ? { categoryId: category.id } : {}),
    ...(category ? { categoryTitle: resolveLocalizedText(category.title as Record<string, string>, locale, defaultLocale) } : {}),
    source,
  };
}
