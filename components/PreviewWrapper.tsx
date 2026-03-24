'use client';

import { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FontLoader } from './FontLoader';
import { normalizeAppearance } from '../cms/normalize/appearance';
import { getCssVariablesFromTokens, getFontFamilyFromTokens } from '../presentation/appearance/applyTokens';
import { sectionRegistry } from '../presentation/sections/registry';
import { AppearanceContract, CmsSettingsResponse, CmsItem } from '../cms/types';

type PageData = {
  settings: CmsSettingsResponse['data'];
  appearance: AppearanceContract;
  servicesItems: CmsItem[];
  galleryItems: CmsItem[];
  availableLocales: { code: string; name: string }[];
  defaultLocale: string;
};

export function PreviewWrapper({ 
  domain,
  initialData,
}: { 
  domain: string;
  initialData: PageData;
}) {
  const [data, setData] = useState<PageData>(initialData);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'UPDATE_APPEARANCE') {
        const payload = event.data.payload;
        
        setData(prev => ({
          ...prev,
          appearance: normalizeAppearance(payload)
        }));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const cssVars = getCssVariablesFromTokens(data.appearance.tokens);
  const fontFamily = getFontFamilyFromTokens(data.appearance.tokens);

  return (
    <div
      data-button-style={data.appearance.tokens.buttonStyle || 'pill'}
      style={cssVars}
      className="flex flex-col min-h-screen w-full transition-colors duration-300"
    >
      <FontLoader fontFamily={fontFamily} />
      <Navbar appearance={data.appearance} settings={data.settings} layoutConfig={data.appearance.layout.blocks} domain={domain} />
      <main className="flex-grow">
        {data.appearance.layout.blocks.map((blockName, index) => {
          const Component = sectionRegistry[blockName];
          if (!Component) return null;

          let limit = undefined;
          if (blockName === 'services') limit = 4;
          if (blockName === 'photoGallery') limit = 8;
          
          return (
            <Component 
              key={`${blockName}-${index}`} 
              settings={data.settings}
              appearance={data.appearance}
              servicesItems={data.servicesItems}
              galleryItems={data.galleryItems}
              domain={domain}
              limit={limit}
            />
          );
        })}
      </main>
      <Footer appearance={data.appearance} settings={data.settings} />
    </div>
  );
}
