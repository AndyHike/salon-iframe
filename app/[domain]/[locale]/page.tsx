import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ClientProviders } from '@/components/ClientProviders';
import { JsonLd } from '@/components/JsonLd';
import { PreviewWrapper } from '@/components/PreviewWrapper';
import { renderAvailabilityPage } from '@/components/AvailabilityPage';
import { loadBeautySalonHome } from '@/cms/loaders/loadBeautySalonHome';
import { buildHomeJsonLd, buildHomeMetadata } from '@/lib/seo';
import { resolveSiteLocale } from '../_site/locale';

type LocalizedHomeRouteProps = {
  params: Promise<{ domain: string; locale: string }>;
};

export async function generateMetadata({ params }: LocalizedHomeRouteProps): Promise<Metadata> {
  const { domain, locale } = await params;
  const data = await loadBeautySalonHome(domain);

  if (!data) {
    return {
      title: 'Not Found',
    };
  }

  if (data.kind === 'blocked') {
    return {
      title: `Site unavailable | ${domain}`,
    };
  }

  return buildHomeMetadata(data.settings, data.servicesItems, domain, locale);
}

export default async function LocalizedHomePage({ params }: LocalizedHomeRouteProps) {
  const { domain, locale } = await params;
  const data = await loadBeautySalonHome(domain);

  if (!data) {
    notFound();
  }

  if (data.kind === 'blocked') {
    return renderAvailabilityPage({ availability: data.availability, domain, locale });
  }

  const siteLocale = resolveSiteLocale(data.settings, locale, '/');

  return (
    <>
      <JsonLd id="site-json-ld" data={buildHomeJsonLd(data.settings, data.servicesItems, domain, siteLocale.locale)} />
      <ClientProviders
        defaultLocale={siteLocale.locale}
        availableLocales={siteLocale.availableLocaleCodes}
        persistLocale={false}
        localizedPaths
      >
        <PreviewWrapper
          domain={domain}
          initialData={data}
        />
      </ClientProviders>
    </>
  );
}
