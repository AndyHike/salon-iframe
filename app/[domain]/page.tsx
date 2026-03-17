import { getSiteData } from '@/lib/getSiteData';
import { notFound } from 'next/navigation';
import { ComponentMapper } from '@/components/ComponentMapper';
import { Metadata } from 'next';

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
  const siteData = await getSiteData(domain);

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

  return (
    <main className="flex-grow">
      {layoutConfig.map((componentName, index) => (
        <ComponentMapper key={`${componentName}-${index}`} name={componentName} siteData={siteData} />
      ))}
    </main>
  );
}
