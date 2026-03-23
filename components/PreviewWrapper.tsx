'use client';

import { useState, useEffect } from 'react';
import { SiteData } from '@/lib/getSiteData';
import { StoreData } from '@/lib/api';
import { ComponentMapper } from './ComponentMapper';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FontLoader } from './FontLoader';

export function PreviewWrapper({ 
  initialSiteData, 
  storeData,
  initialLayoutConfig
}: { 
  initialSiteData: SiteData; 
  storeData: StoreData;
  initialLayoutConfig: string[];
}) {
  const [siteData, setSiteData] = useState<SiteData>(initialSiteData);
  const [layoutConfig, setLayoutConfig] = useState<string[]>(initialLayoutConfig);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'UPDATE_APPEARANCE') {
        const payload = event.data.payload;
        
        setSiteData(prev => ({
          ...prev,
          ...payload
        }));

        if (payload.layoutConfig && Array.isArray(payload.layoutConfig)) {
          setLayoutConfig(payload.layoutConfig);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const buttonRadius = siteData.buttonStyle === 'pill' ? '9999px' : siteData.buttonStyle === 'square' ? '0px' : '8px';

  return (
    <div
      data-button-style={siteData.buttonStyle || 'pill'}
      style={{
        '--primary-color': siteData.primaryColor,
        fontFamily: siteData.fontFamily,
        '--btn-radius': buttonRadius,
      } as any}
      className="flex flex-col min-h-screen w-full transition-colors duration-300"
    >
      <FontLoader fontFamily={siteData.fontFamily} />
      <Navbar siteData={siteData} storeData={storeData} layoutConfig={layoutConfig} />
      <main className="flex-grow">
        {layoutConfig.map((componentName, index) => {
          let limit = undefined;
          if (componentName === 'services') limit = 4;
          if (componentName === 'gallery') limit = 8;
          
          return (
            <ComponentMapper 
              key={`${componentName}-${index}`} 
              name={componentName} 
              siteData={siteData} 
              storeData={storeData} 
              limit={limit}
            />
          );
        })}
      </main>
      <Footer siteData={siteData} storeData={storeData} />
    </div>
  );
}
