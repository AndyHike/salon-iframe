import Link from 'next/link';
import { loadSiteBootstrap } from '@/cms/loaders/loadSiteBootstrap';
import { cmsFetchResult } from '@/cms/client';
import { CmsItemsResponse, CmsItem } from '@/cms/types';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ClientProviders } from '@/components/ClientProviders';
import { renderAvailabilityPage } from '@/components/AvailabilityPage';
import { FontLoader } from '@/components/FontLoader';
import { cacheTags, uniqueCacheTags } from '@/lib/cache-tags';
import { getCssVariablesFromTokens, getFontFamilyFromTokens } from '@/presentation/appearance/applyTokens';
import { resolveThemeAppearance, resolveThemeDefinition } from '@/presentation/themes/registry';

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> {
  const { domain } = await params;
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

  return {
    title: `Services | ${bootstrap.settings.companyName || domain}`,
    description: `Our services at ${bootstrap.settings.companyName || domain}`,
  };
}

export default async function ServicesPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ domain: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { domain } = await params;
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page, 10) : 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  const bootstrap = await loadSiteBootstrap(domain);

  if (!bootstrap) {
    notFound();
  }

  if (bootstrap.kind === 'blocked') {
    return renderAvailabilityPage({ availability: bootstrap.availability, domain });
  }

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
    return renderAvailabilityPage({ availability: servicesRes.availability, domain });
  }

  const servicesData = servicesRes.ok ? servicesRes.data : null;
  const servicesItems: CmsItem[] = servicesData?.success && servicesData.data ? servicesData.data : [];
  const totalItems = servicesData?.success && servicesData.meta?.total ? servicesData.meta.total : servicesItems.length;
  const totalPages = Math.ceil(totalItems / limit);

  const availableLocales = settings.availableLocales || [{ code: 'uk', name: 'Українська' }];
  const defaultLocale = settings.defaultLocale || 'uk';

  const cssVars = getCssVariablesFromTokens(appearance.tokens);
  const fontFamily = getFontFamilyFromTokens(appearance.tokens);
  const resolvedTheme = resolveThemeDefinition(appearance.themeKey);
  const themeAppearance = resolveThemeAppearance(appearance, resolvedTheme);
  const ServicesRenderer = resolvedTheme.sections.services;
  const Navbar = resolvedTheme.shell.Navbar;
  const Footer = resolvedTheme.shell.Footer;

  return (
    <ClientProviders defaultLocale={defaultLocale} availableLocales={availableLocales.map(l => l.code)}>
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
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="container mx-auto px-4 pb-24 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <Link
                  key={i}
                  href={`/services?page=${i + 1}`}
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
