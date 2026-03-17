'use client';

import { useState, useEffect } from 'react';
import { SiteData } from '@/lib/getSiteData';
import { ComponentMapper } from '@/components/ComponentMapper';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export function LivePreviewClient({
  initialApiData,
  searchParams,
}: {
  initialApiData: SiteData | null;
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
    logoUrl: getParam('logoUrl') || initialApiData?.logoUrl || null,
    name: getParam('name') || initialApiData?.name || 'Preview Salon',
    description: getParam('description') || initialApiData?.description || 'Preview Description',
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted to avoid hydration mismatch errors
    setIsMounted(true);

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
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  let layoutConfigArray: string[] = [];
  try {
    layoutConfigArray = JSON.parse(siteData.layoutConfig);
  } catch (e) {
    console.error('Failed to parse layoutConfig', e);
  }

  // Prevent hydration errors by rendering a safe fallback until the client has mounted
  if (!isMounted) {
    return <div className="flex-grow flex flex-col w-full min-h-screen bg-stone-50 animate-pulse" />;
  }

  return (
    <div
      style={{
        '--primary-color': siteData.primaryColor,
        fontFamily: siteData.fontFamily,
      } as any}
      className="flex-grow flex flex-col w-full transition-colors duration-300"
    >
      {layoutConfigArray.map((componentName, index) => (
        <ErrorBoundary key={`${componentName}-${index}`}>
          <ComponentMapper name={componentName} siteData={siteData} />
        </ErrorBoundary>
      ))}
    </div>
  );
}
