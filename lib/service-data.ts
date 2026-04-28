import type { CmsItem } from '@/cms/types';

export function getServiceDurationMinutes(item: CmsItem): number | null {
  const attributes = item.attributes;
  if (!attributes) return null;

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
    return match ? Number(match[0]) : null;
  }

  return null;
}

export function getServiceImageList(item: CmsItem): NonNullable<CmsItem['images']> {
  const ownImages = item.images || [];
  const linkedImages = (item.linkedItems || []).flatMap((link) => link.targetItem.images || []);

  return [...ownImages, ...linkedImages];
}

export function formatServicePrice(item: CmsItem, fallback: string): string {
  if (item.price === null || item.price === undefined || item.price === '') {
    return fallback;
  }

  return String(item.price);
}
