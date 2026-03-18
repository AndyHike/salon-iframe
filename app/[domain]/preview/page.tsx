import { getSiteData } from '@/lib/getSiteData';
import { getStoreData } from '@/lib/api';
import { LivePreviewClient } from './LivePreviewClient';
import { ClientProviders } from '@/components/ClientProviders';

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ domain: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { domain } = await params;
  const resolvedSearchParams = await searchParams;
  
  // Fetch the saved API data
  const [siteData, storeData] = await Promise.all([
    getSiteData(domain),
    getStoreData(domain)
  ]);

  const availableLocales = storeData.settings?.locales || ['uk', 'en', 'cs'];
  const defaultLocale = storeData.settings?.defaultLocale || 'uk';

  return (
    <ClientProviders defaultLocale={defaultLocale} availableLocales={availableLocales}>
      <div className="flex-grow flex flex-col min-h-screen">
        <LivePreviewClient
          initialApiData={siteData}
          storeData={storeData}
          searchParams={resolvedSearchParams}
        />
      </div>
    </ClientProviders>
  );
}
