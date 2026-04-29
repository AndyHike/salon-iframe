'use client';

import { useCallback, useEffect, useState } from 'react';
import { FontLoader } from './FontLoader';
import { useLocale } from './LocaleContext';
import { normalizeAppearance } from '../cms/normalize/appearance';
import { getCssVariablesFromTokens, getFontFamilyFromTokens } from '../presentation/appearance/applyTokens';
import { AppointmentRequestModal } from '../presentation/appointments/AppointmentRequestModal';
import { resolveThemeAppearance, resolveThemeDefinition } from '../presentation/themes/registry';
import type { BeautySalonPageData, CmsItem } from '../cms/types';

export type PageData = BeautySalonPageData;

export function PreviewWrapper({ 
  domain,
  initialData,
}: { 
  domain: string;
  initialData: PageData;
}) {
  const [data, setData] = useState<PageData>(initialData);
  const [appointmentService, setAppointmentService] = useState<CmsItem | null>(null);

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

  const handleRequestService = useCallback((service: CmsItem) => {
    setAppointmentService(service);
  }, []);

  useEffect(() => {
    const serviceId = new URLSearchParams(window.location.search).get('serviceId');
    if (!serviceId) return;

    const service = data.servicesItems.find((item) => item.id === serviceId);
    if (!service) return;

    const timer = window.setTimeout(() => {
      setAppointmentService(service);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [data.servicesItems]);

  const cssVars = getCssVariablesFromTokens(data.appearance.tokens);
  const fontFamily = getFontFamilyFromTokens(data.appearance.tokens);
  
  const themeKey = data.appearance.themeKey || 'beauty-salon-classic';
  const resolvedTheme = resolveThemeDefinition(themeKey);
  const themeAppearance = resolveThemeAppearance(data.appearance, resolvedTheme);
  const Navbar = resolvedTheme.shell.Navbar;
  const Footer = resolvedTheme.shell.Footer;

  return (
    <div
      data-button-style={themeAppearance.tokens.buttonStyle || 'pill'}
      style={cssVars}
      className={`flex flex-col min-h-screen w-full transition-colors duration-300 theme-${resolvedTheme.key}`}
    >
      <FontLoader fontFamily={fontFamily} />
      <Navbar
        appearance={themeAppearance}
        settings={data.settings}
        layoutConfig={themeAppearance.layout.blocks}
        domain={domain}
        navigation={resolvedTheme.navigation}
      />
      <main className="flex-grow">
        {themeAppearance.layout.blocks.map((blockName, index) => {
          const Component = resolvedTheme.sections[blockName];
          if (!Component) return null;

          let limit = undefined;
          if (blockName === 'services') limit = 4;
          if (blockName === 'photoGallery') limit = 8;
          
          return (
            <Component 
              key={`${blockName}-${index}`} 
              settings={data.settings}
              appearance={themeAppearance}
              servicesItems={data.servicesItems}
              galleryItems={data.galleryItems}
              domain={domain}
              limit={limit}
              selectedService={null}
              onRequestService={handleRequestService}
            />
          );
        })}
      </main>
      <Footer appearance={themeAppearance} settings={data.settings} />
      {appointmentService && (
        <AppointmentRequestModal
          domain={domain}
          settings={data.settings}
          service={appointmentService}
          open={Boolean(appointmentService)}
          onClose={() => setAppointmentService(null)}
        />
      )}
    </div>
  );
}
