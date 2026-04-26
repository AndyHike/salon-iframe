import { loadSiteBootstrap } from './loadSiteBootstrap';
import { cmsFetchResult } from '../client';
import { CmsItemsResponse, CmsItem } from '../types';

export async function loadBeautySalonHome(domain: string) {
  const bootstrap = await loadSiteBootstrap(domain);
  if (!bootstrap) return null;
  if (bootstrap.kind === 'blocked') return bootstrap;

  const { settings, appearance } = bootstrap;

  const [servicesRes, galleryRes] = await Promise.all([
    cmsFetchResult<CmsItemsResponse>('/api/public/v1/items?categorySlug=services&include=categories&limit=100', {
      domain,
      tags: [domain, `store-${domain}:services`],
    }),
    cmsFetchResult<CmsItemsResponse>('/api/public/v1/items?categorySlug=gallery&limit=100', {
      domain,
      tags: [domain, `store-${domain}:gallery`],
    }),
  ]);

  if (!servicesRes.ok && servicesRes.availability) {
    return { kind: 'blocked' as const, availability: servicesRes.availability };
  }

  if (!galleryRes.ok && galleryRes.availability) {
    return { kind: 'blocked' as const, availability: galleryRes.availability };
  }

  const servicesData = servicesRes.ok ? servicesRes.data : null;
  const galleryData = galleryRes.ok ? galleryRes.data : null;
  const servicesItems: CmsItem[] = servicesData?.success && servicesData.data ? servicesData.data : [];
  const galleryItems: CmsItem[] = galleryData?.success && galleryData.data ? galleryData.data : [];

  const availableLocales = settings.availableLocales || [{ code: 'uk', name: 'Українська' }];
  const defaultLocale = settings.defaultLocale || 'uk';

  return {
    kind: 'available' as const,
    settings,
    appearance,
    servicesItems,
    galleryItems,
    availableLocales,
    defaultLocale,
  };
}
