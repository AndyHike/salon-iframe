import Link from 'next/link';
import { loadSiteBootstrap } from '@/cms/loaders/loadSiteBootstrap';
import { cmsFetch } from '@/cms/client';
import { CmsItemsResponse, CmsItem } from '@/cms/types';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ClientProviders } from '@/components/ClientProviders';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FontLoader } from '@/components/FontLoader';
import { getCssVariablesFromTokens, getFontFamilyFromTokens } from '@/presentation/appearance/applyTokens';
import { PhotoGallerySection } from '@/presentation/sections/photoGallery/PhotoGallerySection';

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> {
  const { domain } = await params;
  const bootstrap = await loadSiteBootstrap(domain);

  if (!bootstrap) {
    return {
      title: 'Not Found',
    };
  }

  return {
    title: `Gallery | ${bootstrap.settings.companyName || domain}`,
    description: `Our gallery at ${bootstrap.settings.companyName || domain}`,
  };
}

export default async function GalleryPage({ 
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

  const { settings, appearance } = bootstrap;

  const galleryRes = await cmsFetch<CmsItemsResponse>(`/api/public/v1/items?categorySlug=gallery&limit=${limit}&offset=${offset}`, {
    domain,
    tags: [domain, `store-${domain}:gallery`],
  });

  const galleryItems: CmsItem[] = galleryRes?.success && galleryRes.data ? galleryRes.data : [];
  const totalItems = galleryRes?.success && galleryRes.meta?.total ? galleryRes.meta.total : galleryItems.length;
  const totalPages = Math.ceil(totalItems / limit);

  const availableLocales = settings.availableLocales || [{ code: 'uk', name: 'Українська' }];
  const defaultLocale = settings.defaultLocale || 'uk';

  const cssVars = getCssVariablesFromTokens(appearance.tokens);
  const fontFamily = getFontFamilyFromTokens(appearance.tokens);

  return (
    <ClientProviders defaultLocale={defaultLocale} availableLocales={availableLocales.map(l => l.code)}>
      <div
        data-button-style={appearance.tokens.buttonStyle || 'pill'}
        style={cssVars}
        className="flex flex-col min-h-screen w-full transition-colors duration-300"
      >
        <FontLoader fontFamily={fontFamily} />
        <Navbar appearance={appearance} settings={settings} layoutConfig={appearance.layout.blocks} domain={domain} />
        <main className="flex-grow pt-24">
          <PhotoGallerySection 
            settings={settings}
            appearance={appearance}
            servicesItems={[]}
            galleryItems={galleryItems}
            domain={domain}
          />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="container mx-auto px-4 pb-24 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <Link
                  key={i}
                  href={`/gallery?page=${i + 1}`}
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
        <Footer appearance={appearance} settings={settings} />
      </div>
    </ClientProviders>
  );
}
