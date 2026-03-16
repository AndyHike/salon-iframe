import { getSiteData } from '@/lib/getSiteData';
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
  const siteData = await getSiteData(domain);

  return (
    <main className="flex-grow flex flex-col">
      <LivePreviewClient
        initialApiData={siteData}
        searchParams={resolvedSearchParams}
      />
    </main>
  );
}
