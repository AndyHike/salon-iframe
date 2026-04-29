import { notFound, redirect } from 'next/navigation';
import { loadSiteBootstrap } from '@/cms/loaders/loadSiteBootstrap';
import type { CmsSettingsResponse } from '@/cms/types';
import {
  getAvailableLocaleCodes,
  getDefaultLocaleCode,
  isSupportedLocale,
  localizedPath,
} from '@/lib/routes';
import { renderAvailabilityPage } from '@/components/AvailabilityPage';

type Settings = CmsSettingsResponse['data'];

export type SiteLocaleRoute = {
  locale: string;
  defaultLocale: string;
  availableLocaleCodes: string[];
};

export function resolveSiteLocale(
  settings: Settings,
  requestedLocale: string,
  currentPath: string,
): SiteLocaleRoute {
  if (!isSupportedLocale(requestedLocale)) {
    notFound();
  }

  const availableLocaleCodes = getAvailableLocaleCodes(settings.availableLocales);
  const defaultLocale = getDefaultLocaleCode(settings.defaultLocale, availableLocaleCodes);

  if (!availableLocaleCodes.includes(requestedLocale)) {
    redirect(localizedPath(defaultLocale, currentPath));
  }

  return {
    locale: requestedLocale,
    defaultLocale,
    availableLocaleCodes,
  };
}

export async function redirectToDefaultLocale(domain: string, path: string) {
  const bootstrap = await loadSiteBootstrap(domain);

  if (!bootstrap) {
    notFound();
  }

  if (bootstrap.kind === 'blocked') {
    return renderAvailabilityPage({ availability: bootstrap.availability, domain });
  }

  const defaultLocale = getDefaultLocaleCode(
    bootstrap.settings.defaultLocale,
    bootstrap.settings.availableLocales,
  );

  redirect(localizedPath(defaultLocale, path));
}
