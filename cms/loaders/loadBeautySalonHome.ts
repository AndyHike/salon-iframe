import { loadSiteBootstrap } from './loadSiteBootstrap';
import { cmsFetch } from '../client';
import { CmsItemsResponse, CmsItem } from '../types';

export async function loadBeautySalonHome(domain: string) {
  const bootstrap = await loadSiteBootstrap(domain);
  if (!bootstrap) return null;

  const { settings, appearance } = bootstrap;

  const [servicesRes, galleryRes] = await Promise.all([
    cmsFetch<CmsItemsResponse>('/api/public/v1/items?categorySlug=services&include=categories&limit=100', {
      domain,
      tags: [domain, `store-${domain}:services`],
    }),
    cmsFetch<CmsItemsResponse>('/api/public/v1/items?categorySlug=gallery&limit=100', {
      domain,
      tags: [domain, `store-${domain}:gallery`],
    }),
  ]);

  const servicesItems: CmsItem[] = servicesRes?.success && servicesRes.data ? servicesRes.data : [];
  const galleryItems: CmsItem[] = galleryRes?.success && galleryRes.data ? galleryRes.data : [];

  const availableLocales = settings.availableLocales || [{ code: 'uk', name: 'Українська' }];
  const defaultLocale = settings.defaultLocale || 'uk';

  return {
    settings,
    appearance,
    servicesItems,
    galleryItems,
    availableLocales,
    defaultLocale,
  };
}
