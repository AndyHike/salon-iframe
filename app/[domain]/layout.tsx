import { getSiteData } from '@/lib/getSiteData';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

export default async function DomainLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const siteData = await getSiteData(domain);

  if (!siteData) {
    notFound();
  }

  return (
    <div
      style={
        {
          '--primary-color': siteData.primaryColor,
          fontFamily: siteData.fontFamily,
        } as React.CSSProperties
      }
      className="min-h-screen flex flex-col"
    >
      {children}
    </div>
  );
}
