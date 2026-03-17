import { getSiteData } from '@/lib/getSiteData';
import { getStoreData } from '@/lib/api';
import { notFound } from 'next/navigation';
import { ComponentMapper } from '@/components/ComponentMapper';
import { FontLoader } from '@/components/FontLoader';
import { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

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

  return (
    <div
      data-button-style={siteData.buttonStyle || 'pill'}
      style={{
        '--primary-color': siteData.primaryColor,
        fontFamily: siteData.fontFamily,
      } as any}
      className="flex flex-col min-h-screen w-full transition-colors duration-300"
    >
      <FontLoader fontFamily={siteData.fontFamily} />
      <Navbar siteData={siteData} storeData={storeData} layoutConfig={layoutConfig} />
      <main className="flex-grow">
        {layoutConfig.map((componentName, index) => (
          <ComponentMapper key={`${componentName}-${index}`} name={componentName} siteData={siteData} storeData={storeData} />
        ))}
      </main>
      <Footer siteData={siteData} storeData={storeData} />
    </div>
  );
}
