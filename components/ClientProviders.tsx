'use client';

import { LocaleProvider } from './LocaleContext';

export function ClientProviders({ 
  children, 
  defaultLocale, 
  availableLocales 
}: { 
  children: React.ReactNode; 
  defaultLocale: string; 
  availableLocales: string[];
}) {
  return (
    <LocaleProvider defaultLocale={defaultLocale} availableLocales={availableLocales}>
      {children}
    </LocaleProvider>
  );
}
