import type { MetadataRoute } from 'next';
import { cmsFetchResult, resolveDomainFromHeaders, resolveHostFromHeaders } from '@/cms/client';
import { loadSiteBootstrap } from '@/cms/loaders/loadSiteBootstrap';
import type { CmsItem, CmsItemsResponse } from '@/cms/types';
import { cacheTags, uniqueCacheTags } from '@/lib/cache-tags';
import {
  absoluteSiteUrl,
  getAvailableLocaleCodes,
  localizedLanguageAlternates,
  localizedPath,
} from '@/lib/routes';

export const dynamic = 'force-dynamic';

type SitemapEntry = MetadataRoute.Sitemap[number];

const SERVICE_PAGE_LIMIT = 200;
const MAX_SERVICE_PAGES = 25;

function localizedSitemapEntry(
  host: string,
  locales: string[],
  locale: string,
  path: string,
  priority: number,
  changeFrequency: SitemapEntry['changeFrequency'] = 'weekly',
): SitemapEntry {
  return {
    url: absoluteSiteUrl(host, localizedPath(locale, path)),
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: localizedLanguageAlternates(host, locales, path),
    },
  };
}

async function loadSitemapServices(domain: string, siteId: string): Promise<CmsItem[]> {
  const services: CmsItem[] = [];

  for (let page = 0; page < MAX_SERVICE_PAGES; page += 1) {
    const offset = page * SERVICE_PAGE_LIMIT;
    const result = await cmsFetchResult<CmsItemsResponse>(
      `/api/public/v1/items?categorySlug=services&limit=${SERVICE_PAGE_LIMIT}&offset=${offset}`,
      {
        domain,
        tags: uniqueCacheTags([
          cacheTags.domain(domain),
          cacheTags.site(siteId),
          cacheTags.collection(siteId, 'services'),
          cacheTags.listView(siteId, 'services'),
          cacheTags.view(siteId, 'sitemap'),
          cacheTags.legacy.collection(domain, 'services'),
        ]),
      },
    );

    if (!result.ok || !result.data?.success || !result.data.data) {
      break;
    }

    services.push(...result.data.data);

    const total = result.data.meta?.total;
    if (result.data.data.length < SERVICE_PAGE_LIMIT || total && services.length >= total) {
      break;
    }
  }

  const seen = new Set<string>();
  return services.filter((service) => {
    if (!service.slug || service.seo?.noindex) return false;
    if (seen.has(service.slug)) return false;
    seen.add(service.slug);
    return true;
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [domain, host] = await Promise.all([
    resolveDomainFromHeaders(),
    resolveHostFromHeaders(),
  ]);
  const bootstrap = await loadSiteBootstrap(domain);

  if (!bootstrap || bootstrap.kind === 'blocked' || bootstrap.settings.seo?.noindex) {
    return [];
  }

  const locales = getAvailableLocaleCodes(bootstrap.settings.availableLocales);
  const services = await loadSitemapServices(domain, bootstrap.siteId);
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push(
      localizedSitemapEntry(host, locales, locale, '/', 1, 'weekly'),
      localizedSitemapEntry(host, locales, locale, '/services', 0.9, 'weekly'),
      localizedSitemapEntry(host, locales, locale, '/gallery', 0.7, 'weekly'),
    );

    for (const service of services) {
      entries.push(
        localizedSitemapEntry(
          host,
          locales,
          locale,
          `/services/${encodeURIComponent(service.slug)}`,
          0.85,
          'weekly',
        ),
      );
    }
  }

  return entries;
}
