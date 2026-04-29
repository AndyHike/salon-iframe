'use client';

import { LocaleProvider } from './LocaleContext';

export function ClientProviders({ 
  children, 
  defaultLocale, 
  availableLocales,
  persistLocale = true,
  localizedPaths = false,
}: { 
  children: React.ReactNode; 
  defaultLocale: string; 
  availableLocales: string[];
  persistLocale?: boolean;
  localizedPaths?: boolean;
}) {
  return (
    <LocaleProvider
      defaultLocale={defaultLocale}
      availableLocales={availableLocales}
      persistLocale={persistLocale}
      localizedPaths={localizedPaths}
    >
      {children}
    </LocaleProvider>
  );
}
