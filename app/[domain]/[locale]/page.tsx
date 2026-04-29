import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ClientProviders } from '@/components/ClientProviders';
import { PreviewWrapper } from '@/components/PreviewWrapper';
import { renderAvailabilityPage } from '@/components/AvailabilityPage';
import { loadBeautySalonHome } from '@/cms/loaders/loadBeautySalonHome';
import {
  absoluteSiteUrl,
  getAvailableLocaleCodes,
  getDefaultLocaleCode,
  isSupportedLocale,
  localizedLanguageAlternates,
  localizedPath,
} from '@/lib/routes';
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

  const availableLocaleCodes = getAvailableLocaleCodes(data.availableLocales);
  const defaultLocale = getDefaultLocaleCode(data.defaultLocale, availableLocaleCodes);
  const metadataLocale = isSupportedLocale(locale) && availableLocaleCodes.includes(locale)
    ? locale
    : defaultLocale;
  const title = data.settings.companyName || `${domain} - Premium Services`;
  const description = data.settings.contactName || `Welcome to ${domain}`;

  return {
    title,
    description,
    alternates: {
      canonical: absoluteSiteUrl(domain, localizedPath(metadataLocale, '/')),
      languages: localizedLanguageAlternates(domain, availableLocaleCodes, '/'),
    },
    openGraph: {
      title,
      description,
    },
  };
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
  );
}
