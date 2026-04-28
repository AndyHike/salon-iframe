import { cacheTags, uniqueCacheTags } from '../../lib/cache-tags';
import { loadSiteBootstrap } from './loadSiteBootstrap';
import { cmsFetchResult } from '../client';
import type { CmsItemResponse } from '../types';

export async function loadBeautySalonServiceDetail(domain: string, slug: string) {
  const bootstrap = await loadSiteBootstrap(domain);
  if (!bootstrap) return null;
  if (bootstrap.kind === 'blocked') return bootstrap;

  const { settings, appearance, siteId } = bootstrap;
  const serviceRes = await cmsFetchResult<CmsItemResponse>(
    `/api/public/v1/items/${encodeURIComponent(slug)}?include=categories`,
    {
      domain,
      tags: uniqueCacheTags([
        cacheTags.domain(domain),
        cacheTags.site(siteId),
        cacheTags.collection(siteId, 'services'),
        cacheTags.item(siteId, 'services', slug),
        cacheTags.detailView(siteId, 'services', slug),
        cacheTags.legacy.collection(domain, 'services'),
      ]),
    },
  );

  if (!serviceRes.ok && serviceRes.availability) {
    return { kind: 'blocked' as const, availability: serviceRes.availability };
  }

  const serviceData = serviceRes.ok ? serviceRes.data : null;
  if (!serviceData?.success || !serviceData.data) return null;

  const availableLocales = settings.availableLocales || [{ code: 'uk', name: '\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430' }];
  const defaultLocale = settings.defaultLocale || 'uk';

  return {
    kind: 'available' as const,
    siteId,
    settings,
    appearance,
    serviceItem: serviceData.data,
    availableLocales,
    defaultLocale,
  };
}
