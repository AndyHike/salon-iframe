import { getSiteData } from '@/lib/getSiteData';
import { getStoreData } from '@/lib/api';
import { LivePreviewClient } from './LivePreviewClient';

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

  return (
    <div className="flex-grow flex flex-col min-h-screen">
      <LivePreviewClient
        initialApiData={siteData}
        storeData={storeData}
        searchParams={resolvedSearchParams}
      />
    </div>
  );
}
