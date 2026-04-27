'use client';

import { useCallback, useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FontLoader } from './FontLoader';
import { useLocale } from './LocaleContext';
import { normalizeAppearance } from '../cms/normalize/appearance';
import { getCssVariablesFromTokens, getFontFamilyFromTokens } from '../presentation/appearance/applyTokens';
import { createAppointmentServiceSelection, type AppointmentServiceSelection } from '../presentation/appointments/serviceRequest';
import { resolveThemeDefinition } from '../presentation/themes/registry';
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
  const [selectedService, setSelectedService] = useState<AppointmentServiceSelection | null>(null);
  const { locale, t } = useLocale();

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

  const focusContactForm = useCallback(() => {
    window.setTimeout(() => {
      const contactsSection = document.getElementById('contacts');
      contactsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });

      const serviceSelect = document.querySelector<HTMLElement>('[data-appointment-service-select]');
      serviceSelect?.focus({ preventScroll: true });
    }, 60);
  }, []);

  const handleRequestService = useCallback((service: CmsItem) => {
    setSelectedService(createAppointmentServiceSelection(
      service,
      locale,
      data.settings.defaultLocale || data.defaultLocale || 'uk',
      'services_section',
      t('services.priceOnRequest'),
    ));
    focusContactForm();
  }, [data.defaultLocale, data.settings.defaultLocale, focusContactForm, locale, t]);

  useEffect(() => {
    const serviceId = new URLSearchParams(window.location.search).get('serviceId');
    if (!serviceId) return;

    const service = data.servicesItems.find((item) => item.id === serviceId);
    if (!service) return;

    const timer = window.setTimeout(() => {
      setSelectedService(createAppointmentServiceSelection(
        service,
        locale,
        data.settings.defaultLocale || data.defaultLocale || 'uk',
        'services_section',
        t('services.priceOnRequest'),
      ));
    }, 0);

    return () => window.clearTimeout(timer);
  }, [data.defaultLocale, data.servicesItems, data.settings.defaultLocale, locale, t]);

  const cssVars = getCssVariablesFromTokens(data.appearance.tokens);
  const fontFamily = getFontFamilyFromTokens(data.appearance.tokens);
  
  const themeKey = data.appearance.themeKey || 'beauty-salon-classic';
  const resolvedTheme = resolveThemeDefinition(themeKey);

  return (
    <div
      data-button-style={data.appearance.tokens.buttonStyle || 'pill'}
      style={cssVars}
      className={`flex flex-col min-h-screen w-full transition-colors duration-300 theme-${resolvedTheme.key}`}
    >
      <FontLoader fontFamily={fontFamily} />
      <Navbar appearance={data.appearance} settings={data.settings} layoutConfig={data.appearance.layout.blocks} domain={domain} />
      <main className="flex-grow">
        {data.appearance.layout.blocks.map((blockName, index) => {
          const Component = resolvedTheme.sections[blockName];
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
              selectedService={selectedService}
              onRequestService={handleRequestService}
            />
          );
        })}
      </main>
      <Footer appearance={data.appearance} settings={data.settings} />
    </div>
  );
}
