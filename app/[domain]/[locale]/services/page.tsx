import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ClientProviders } from '@/components/ClientProviders';
import { FontLoader } from '@/components/FontLoader';
import { JsonLd } from '@/components/JsonLd';
import { renderAvailabilityPage } from '@/components/AvailabilityPage';
import { cmsFetchResult } from '@/cms/client';
import { loadSiteBootstrap } from '@/cms/loaders/loadSiteBootstrap';
import type { CmsItem, CmsItemsResponse, CmsCategory, CmsCategoriesResponse, ServiceCategoryGroupData } from '@/cms/types';
import { getCssVariablesFromTokens, getFontFamilyFromTokens } from '@/presentation/appearance/applyTokens';
import { resolveThemeAppearance, resolveThemeDefinition } from '@/presentation/themes/registry';
import { cacheTags, uniqueCacheTags } from '@/lib/cache-tags';
import { localizedPath } from '@/lib/routes';
import { buildServicesJsonLd, buildServicesMetadata } from '@/lib/seo';
import { resolveSiteLocale } from '../../_site/locale';

type LocalizedServicesRouteProps = {
  params: Promise<{ domain: string; locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: LocalizedServicesRouteProps): Promise<Metadata> {
  const { domain, locale } = await params;
  const bootstrap = await loadSiteBootstrap(domain);

  if (!bootstrap) {
    return {
      title: 'Not Found',
    };
  }

  if (bootstrap.kind === 'blocked') {
    return {
      title: `Site unavailable | ${domain}`,
    };
  }

  return buildServicesMetadata(bootstrap.settings, [], domain, locale);
}

export default async function LocalizedServicesPage({
  params,
  searchParams,
}: LocalizedServicesRouteProps) {
  const { domain, locale } = await params;
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page, 10) : 1;

  const bootstrap = await loadSiteBootstrap(domain);

  if (!bootstrap) {
    notFound();
  }

  if (bootstrap.kind === 'blocked') {
    return renderAvailabilityPage({ availability: bootstrap.availability, domain, locale });
  }

  const currentPath = page > 1 ? `/services?page=${page}` : '/services';
  const siteLocale = resolveSiteLocale(bootstrap.settings, locale, currentPath);
  const { settings, appearance, siteId } = bootstrap;

  // Step 1: Fetch categories to find subcategories of 'services'
  const categoriesRes = await cmsFetchResult<CmsCategoriesResponse>('/api/public/v1/categories', {
    domain,
    tags: uniqueCacheTags([
      cacheTags.domain(domain),
      cacheTags.site(siteId),
      cacheTags.collection(siteId, 'categories'),
      cacheTags.listView(siteId, 'services'),
    ]),
  });

  if (!categoriesRes.ok && categoriesRes.availability) {
    return renderAvailabilityPage({ availability: categoriesRes.availability, domain, locale: siteLocale.locale });
  }

  const categories: CmsCategory[] = categoriesRes.ok && categoriesRes.data?.success ? categoriesRes.data.data : [];
  const servicesCategory = categories.find((c) => c.slug === 'services');
  const serviceSubcategories = categories.filter((c) => c.parentId === servicesCategory?.id);

  // Step 2: Fetch items for main 'services' category
  let servicesData: ServiceCategoryGroupData[] = [];
  let allServicesItems: CmsItem[] = [];

  if (servicesCategory) {
    const mainItemsRes = await cmsFetchResult<CmsItemsResponse>('/api/public/v1/items?categorySlug=services&include=categories&limit=100', {
      domain,
      tags: uniqueCacheTags([
        cacheTags.domain(domain),
        cacheTags.site(siteId),
        cacheTags.collection(siteId, 'services'),
        cacheTags.listView(siteId, 'services'),
        cacheTags.legacy.collection(domain, 'services'),
      ]),
    });

    if (!mainItemsRes.ok && mainItemsRes.availability) {
      return renderAvailabilityPage({ availability: mainItemsRes.availability, domain, locale: siteLocale.locale });
    }

    const mainItems: CmsItem[] = mainItemsRes.ok && mainItemsRes.data?.success && mainItemsRes.data.data
      ? mainItemsRes.data.data
      : [];

    if (mainItems.length > 0) {
      servicesData.push({ category: servicesCategory, items: mainItems });
    }
  }

  // Step 3: Fetch items for each subcategory in parallel
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
              cacheTags.listView(siteId, 'services'),
            ]),
          }
        );
        const items: CmsItem[] = res.ok && res.data?.success && res.data.data ? res.data.data : [];
        return { category: sub, items };
      })
    );

    servicesData = [...servicesData, ...subResults.filter((d) => d.items.length > 0)];
  }

  allServicesItems = servicesData.flatMap((group) => group.items);
  const totalItems = allServicesItems.length;
  const totalPages = 1; // All items loaded at once now

  const cssVars = getCssVariablesFromTokens(appearance.tokens);
  const fontFamily = getFontFamilyFromTokens(appearance.tokens);
  const resolvedTheme = resolveThemeDefinition(appearance.themeKey);
  const themeAppearance = resolveThemeAppearance(appearance, resolvedTheme);
  const ServicesRenderer = resolvedTheme.sections.services;
  const Navbar = resolvedTheme.shell.Navbar;
  const Footer = resolvedTheme.shell.Footer;

  return (
    <>
      <JsonLd id="services-json-ld" data={buildServicesJsonLd(settings, allServicesItems, domain, siteLocale.locale)} />
      <ClientProviders
        defaultLocale={siteLocale.locale}
        availableLocales={siteLocale.availableLocaleCodes}
        persistLocale={false}
        localizedPaths
      >
      <div
        data-button-style={themeAppearance.tokens.buttonStyle || 'pill'}
        style={cssVars}
        className={`flex flex-col min-h-screen w-full transition-colors duration-300 theme-${resolvedTheme.key}`}
      >
        <FontLoader fontFamily={fontFamily} />
        <Navbar
          appearance={themeAppearance}
          settings={settings}
          layoutConfig={themeAppearance.layout.blocks}
          domain={domain}
          navigation={resolvedTheme.navigation}
        />
        <main className="flex-grow pt-24">
          <ServicesRenderer
            settings={settings}
            appearance={themeAppearance}
            servicesItems={allServicesItems}
            servicesData={servicesData}
            galleryItems={[]}
            domain={domain}
          />
        </main>
        <Footer appearance={themeAppearance} settings={settings} />
      </div>
      </ClientProviders>
    </>
  );
}
