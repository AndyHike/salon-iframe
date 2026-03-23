'use client';

import { useState, useEffect } from 'react';
import { SiteData } from '@/lib/getSiteData';
import { StoreData } from '@/lib/api';
import { ComponentMapper } from '@/components/ComponentMapper';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { FontLoader } from '@/components/FontLoader';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

export function LivePreviewClient({
  initialApiData,
  storeData,
  searchParams,
}: {
  initialApiData: SiteData | null;
  storeData: StoreData;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Helper to safely get string from searchParams
  const getParam = (key: string) => {
    const val = searchParams[key];
    return Array.isArray(val) ? val[0] : val;
  };

  // State Priority: postMessage Data (Live) > URL SearchParams (Initial Edit) > API Data (Saved Version)
  const [siteData, setSiteData] = useState<SiteData>({
    id: initialApiData?.id || 'preview',
    storeId: initialApiData?.storeId || 'preview',
    primaryColor: getParam('primaryColor') || initialApiData?.primaryColor || '#0f172a',
    fontFamily: getParam('fontFamily') || initialApiData?.fontFamily || "'Inter', sans-serif",
    layoutConfig: getParam('layoutConfig') || initialApiData?.layoutConfig || '["hero", "services", "gallery", "contacts"]',
    buttonStyle: (getParam('buttonStyle') as any) || initialApiData?.buttonStyle || 'pill',
    heroBackgroundImage: getParam('heroBackgroundImage') || initialApiData?.heroBackgroundImage || '',
    heroOverlay: getParam('heroOverlay') ? parseFloat(getParam('heroOverlay') as string) : initialApiData?.heroOverlay || 0.4,
    galleryLayout: (getParam('galleryLayout') as any) || initialApiData?.galleryLayout || 'grid',
    logoUrl: getParam('logoUrl') || initialApiData?.logoUrl || null,
    name: getParam('name') || initialApiData?.name || 'Preview Salon',
    description: getParam('description') || initialApiData?.description || 'Preview Description',
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted to avoid hydration mismatch errors
    const timer = setTimeout(() => setIsMounted(true), 0);

    const handleMessage = (event: MessageEvent) => {
      // Listen for the specific update event from the parent window (admin dashboard)
      if (event.data?.type === 'UPDATE_APPEARANCE') {
        setSiteData((prev) => ({
          ...prev,
          ...event.data.payload,
        }));
      }
    };

    // Add event listener safely only on the client side
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timer);
    };
  }, []);

  let layoutConfigArray: string[] = [];
  try {
    const parsed = typeof siteData.layoutConfig === 'string'
      ? JSON.parse(siteData.layoutConfig)
      : siteData.layoutConfig;
    if (Array.isArray(parsed)) {
      layoutConfigArray = parsed;
    }
  } catch (e) {
    console.error('Failed to parse layoutConfig', e);
  }

  // Prevent hydration errors by rendering a safe fallback until the client has mounted
  if (!isMounted) {
    return <div className="flex-grow flex flex-col w-full min-h-screen bg-stone-50 animate-pulse" />;
  }

  return (
    <div
      data-button-style={siteData.buttonStyle || 'pill'}
      style={{
        '--primary-color': siteData.primaryColor,
        fontFamily: siteData.fontFamily,
      } as any}
      className="flex-grow flex flex-col w-full transition-colors duration-300"
    >
      <FontLoader fontFamily={siteData.fontFamily} />
      <Navbar siteData={siteData} storeData={storeData} layoutConfig={layoutConfigArray} />
      <main className="flex-grow">
        {layoutConfigArray.map((componentName, index) => (
          <ErrorBoundary key={`${componentName}-${index}`}>
            <ComponentMapper name={componentName} siteData={siteData} storeData={storeData} />
          </ErrorBoundary>
        ))}
      </main>
      <Footer siteData={siteData} storeData={storeData} />
    </div>
  );
}
