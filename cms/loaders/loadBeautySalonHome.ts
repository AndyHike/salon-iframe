import { loadSiteBootstrap } from './loadSiteBootstrap';
import { cmsFetchResult } from '../client';
import { CmsItemsResponse, CmsItem, CmsCategoriesResponse, CmsCategory, ServiceCategoryGroupData } from '../types';
import { cacheTags, uniqueCacheTags } from '../../lib/cache-tags';

export type ServiceCategoryGroup = ServiceCategoryGroupData;

export async function loadBeautySalonHome(domain: string) {
  const bootstrap = await loadSiteBootstrap(domain);
  if (!bootstrap) return null;
  if (bootstrap.kind === 'blocked') return bootstrap;

  const { settings, appearance, siteId } = bootstrap;

  // Step 1: Fetch categories and gallery in parallel
  const [categoriesRes, galleryRes] = await Promise.all([
    cmsFetchResult<CmsCategoriesResponse>('/api/public/v1/categories', {
      domain,
      tags: uniqueCacheTags([
        cacheTags.domain(domain),
        cacheTags.site(siteId),
        cacheTags.collection(siteId, 'categories'),
        cacheTags.view(siteId, 'home'),
      ]),
    }),
    cmsFetchResult<CmsItemsResponse>('/api/public/v1/items?categorySlug=gallery&include=linkedItems&limit=100', {
      domain,
      tags: uniqueCacheTags([
        cacheTags.domain(domain),
        cacheTags.site(siteId),
        cacheTags.collection(siteId, 'gallery'),
        cacheTags.view(siteId, 'home'),
        cacheTags.legacy.collection(domain, 'gallery'),
      ]),
    }),
  ]);

  if (!categoriesRes.ok && categoriesRes.availability) {
    return { kind: 'blocked' as const, availability: categoriesRes.availability };
  }

  if (!galleryRes.ok && galleryRes.availability) {
    return { kind: 'blocked' as const, availability: galleryRes.availability };
  }

  const categories: CmsCategory[] = categoriesRes.ok && categoriesRes.data?.success ? categoriesRes.data.data : [];
  const galleryData = galleryRes.ok ? galleryRes.data : null;
  const galleryItems: CmsItem[] = galleryData?.success && galleryData.data ? galleryData.data : [];

  // Step 2: Find the root 'services' category and its subcategories
  const servicesCategory = categories.find((c) => c.slug === 'services');
  const serviceSubcategories = categories.filter((c) => c.parentId === servicesCategory?.id);

  // Step 3: Fetch items for main 'services' category and each subcategory
  let servicesData: ServiceCategoryGroup[] = [];

  if (servicesCategory) {
    const mainItemsRes = await cmsFetchResult<CmsItemsResponse>('/api/public/v1/items?categorySlug=services&include=categories&limit=100', {
      domain,
      tags: uniqueCacheTags([
        cacheTags.domain(domain),
        cacheTags.site(siteId),
        cacheTags.collection(siteId, 'services'),
        cacheTags.view(siteId, 'home'),
        cacheTags.legacy.collection(domain, 'services'),
      ]),
    });

    if (!mainItemsRes.ok && mainItemsRes.availability) {
      return { kind: 'blocked' as const, availability: mainItemsRes.availability };
    }

    const mainItems: CmsItem[] = mainItemsRes.ok && mainItemsRes.data?.success && mainItemsRes.data.data
      ? mainItemsRes.data.data
      : [];

    if (mainItems.length > 0) {
      servicesData.push({ category: servicesCategory, items: mainItems });
    }
  }

  // Step 4: Fetch items for each subcategory in parallel
  if (serviceSubcategories.length > 0) {
    const subResults = await Promise.all(
      serviceSubcategories.map(async (sub) => {
        const res = await cmsFetchResult<CmsItemsResponse>(
          `/api/public/v1/items?categorySlug=${encodeURIComponent(sub.slug)}&include=categories&limit=100`,
          {
            domain,
            tags: uniqueCacheTags([
              cacheTags.domain(domain),
              cacheTags.site(siteId),
              cacheTags.collection(siteId, sub.slug),
              cacheTags.view(siteId, 'home'),
            ]),
          }
        );
        const items: CmsItem[] = res.ok && res.data?.success && res.data.data ? res.data.data : [];
        return { category: sub, items };
      })
    );

    // Only include subcategories that have items
    servicesData = [...servicesData, ...subResults.filter((d) => d.items.length > 0)];
  }

  // Build flat list for backward compatibility
  const servicesItems: CmsItem[] = servicesData.flatMap((group) => group.items);

  const availableLocales = settings.availableLocales || [{ code: 'uk', name: 'Українська' }];
  const defaultLocale = settings.defaultLocale || 'uk';

  return {
    kind: 'available' as const,
    settings,
    appearance,
    servicesItems,
    servicesData,
    galleryItems,
    availableLocales,
    defaultLocale,
  };
}
