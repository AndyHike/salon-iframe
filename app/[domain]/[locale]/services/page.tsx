import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ClientProviders } from '@/components/ClientProviders';
import { FontLoader } from '@/components/FontLoader';
import { renderAvailabilityPage } from '@/components/AvailabilityPage';
import { cmsFetchResult } from '@/cms/client';
import { loadSiteBootstrap } from '@/cms/loaders/loadSiteBootstrap';
import type { CmsItem, CmsItemsResponse } from '@/cms/types';
import { getCssVariablesFromTokens, getFontFamilyFromTokens } from '@/presentation/appearance/applyTokens';
import { resolveThemeAppearance, resolveThemeDefinition } from '@/presentation/themes/registry';
import { cacheTags, uniqueCacheTags } from '@/lib/cache-tags';
import {
  absoluteSiteUrl,
  getAvailableLocaleCodes,
  getDefaultLocaleCode,
  isSupportedLocale,
  localizedLanguageAlternates,
  localizedPath,
} from '@/lib/routes';
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

  const availableLocaleCodes = getAvailableLocaleCodes(bootstrap.settings.availableLocales);
  const defaultLocale = getDefaultLocaleCode(bootstrap.settings.defaultLocale, availableLocaleCodes);
  const metadataLocale = isSupportedLocale(locale) && availableLocaleCodes.includes(locale)
    ? locale
    : defaultLocale;

  return {
    title: `Services | ${bootstrap.settings.companyName || domain}`,
    description: `Our services at ${bootstrap.settings.companyName || domain}`,
    alternates: {
      canonical: absoluteSiteUrl(domain, localizedPath(metadataLocale, '/services')),
      languages: localizedLanguageAlternates(domain, availableLocaleCodes, '/services'),
    },
  };
}

export default async function LocalizedServicesPage({
  params,
  searchParams,
}: LocalizedServicesRouteProps) {
  const { domain, locale } = await params;
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page, 10) : 1;
  const limit = 20;
  const offset = (page - 1) * limit;

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

  const servicesRes = await cmsFetchResult<CmsItemsResponse>(`/api/public/v1/items?categorySlug=services&include=categories&limit=${limit}&offset=${offset}`, {
    domain,
    tags: uniqueCacheTags([
      cacheTags.domain(domain),
      cacheTags.site(siteId),
      cacheTags.collection(siteId, 'services'),
      cacheTags.listView(siteId, 'services'),
      cacheTags.legacy.collection(domain, 'services'),
    ]),
  });

  if (!servicesRes.ok && servicesRes.availability) {
    return renderAvailabilityPage({ availability: servicesRes.availability, domain, locale: siteLocale.locale });
  }

  const servicesData = servicesRes.ok ? servicesRes.data : null;
  const servicesItems: CmsItem[] = servicesData?.success && servicesData.data ? servicesData.data : [];
  const totalItems = servicesData?.success && servicesData.meta?.total ? servicesData.meta.total : servicesItems.length;
  const totalPages = Math.ceil(totalItems / limit);

  const cssVars = getCssVariablesFromTokens(appearance.tokens);
  const fontFamily = getFontFamilyFromTokens(appearance.tokens);
  const resolvedTheme = resolveThemeDefinition(appearance.themeKey);
  const themeAppearance = resolveThemeAppearance(appearance, resolvedTheme);
  const ServicesRenderer = resolvedTheme.sections.services;
  const Navbar = resolvedTheme.shell.Navbar;
  const Footer = resolvedTheme.shell.Footer;

  return (
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
            servicesItems={servicesItems}
            galleryItems={[]}
            domain={domain}
          />

          {totalPages > 1 && (
            <div className="container mx-auto px-4 pb-24 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <Link
                  key={i}
                  href={localizedPath(siteLocale.locale, `/services?page=${i + 1}`)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors ${
                    page === i + 1
                      ? 'bg-[var(--primary-color)] text-white border-[var(--primary-color)]'
                      : 'border-stone-200 text-stone-600 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)]'
                  }`}
                >
                  {i + 1}
                </Link>
              ))}
            </div>
          )}
        </main>
        <Footer appearance={themeAppearance} settings={settings} />
      </div>
    </ClientProviders>
  );
}
