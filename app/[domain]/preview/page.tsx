import { loadBeautySalonHome } from '@/cms/loaders/loadBeautySalonHome';
import { notFound } from 'next/navigation';
import { ClientProviders } from '@/components/ClientProviders';
import { PreviewWrapper } from '@/components/PreviewWrapper';
import { renderAvailabilityPage } from '@/components/AvailabilityPage';

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const data = await loadBeautySalonHome(domain);

  if (!data) {
    notFound();
  }

  if (data.kind === 'blocked') {
    return renderAvailabilityPage({ availability: data.availability, domain });
  }

  return (
    <ClientProviders defaultLocale={data.defaultLocale} availableLocales={data.availableLocales.map(l => l.code)}>
      <div className="flex-grow flex flex-col min-h-screen">
        <PreviewWrapper 
          domain={domain}
          initialData={data} 
        />
      </div>
    </ClientProviders>
  );
}
