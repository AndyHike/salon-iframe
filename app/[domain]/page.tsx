import { loadBeautySalonHome } from '@/cms/loaders/loadBeautySalonHome';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ClientProviders } from '@/components/ClientProviders';
import { PreviewWrapper } from '@/components/PreviewWrapper';

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> {
  const { domain } = await params;
  const data = await loadBeautySalonHome(domain);

  if (!data) {
    return {
      title: 'Not Found',
    };
  }

  return {
    title: data.settings.companyName || `${domain} - Premium Services`,
    description: data.settings.contactName || `Welcome to ${domain}`,
    openGraph: {
      title: data.settings.companyName || `${domain} - Premium Services`,
      description: data.settings.contactName || `Welcome to ${domain}`,
    },
  };
}

export default async function DomainPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  const data = await loadBeautySalonHome(domain);

  if (!data) {
    notFound();
  }

  return (
    <ClientProviders defaultLocale={data.defaultLocale} availableLocales={data.availableLocales.map(l => l.code)}>
      <PreviewWrapper 
        domain={domain}
        initialData={data} 
      />
    </ClientProviders>
  );
}
