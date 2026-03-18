import { getSiteData } from '@/lib/getSiteData';
import { getStoreData } from '@/lib/api';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ClientProviders } from '@/components/ClientProviders';
import { PreviewWrapper } from '@/components/PreviewWrapper';

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> {
  const { domain } = await params;
  const siteData = await getSiteData(domain);

  if (!siteData) {
    return {
      title: 'Not Found',
    };
  }

  return {
    title: siteData.name || `${domain} - Premium Services`,
    description: siteData.description || `Welcome to ${domain}`,
    openGraph: {
      title: siteData.name || `${domain} - Premium Services`,
      description: siteData.description || `Welcome to ${domain}`,
    },
  };
}

export default async function DomainPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  const [siteData, storeData] = await Promise.all([
    getSiteData(domain),
    getStoreData(domain)
  ]);

  if (!siteData) {
    notFound();
  }

  let layoutConfig: string[] = [];
  try {
    const parsed = typeof siteData.layoutConfig === 'string'
      ? JSON.parse(siteData.layoutConfig)
      : siteData.layoutConfig;
    if (Array.isArray(parsed)) {
      layoutConfig = parsed;
    }
  } catch (e) {
    console.error('Failed to parse layoutConfig', e);
  }

  const availableLocales = storeData.settings?.locales || ['uk', 'en', 'cs'];
  const defaultLocale = storeData.settings?.defaultLocale || 'uk';

  return (
    <ClientProviders defaultLocale={defaultLocale} availableLocales={availableLocales}>
      <PreviewWrapper 
        initialSiteData={siteData} 
        storeData={storeData} 
        initialLayoutConfig={layoutConfig} 
      />
    </ClientProviders>
  );
}
