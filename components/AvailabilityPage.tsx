import { normalizeLocale, resolveRequestLocale, SUPPORTED_LOCALES } from '../cms/locale';
import type { SiteAvailability } from '../cms/types';
import { AvailabilityScreen } from './AvailabilityScreen';
import { ClientProviders } from './ClientProviders';

export async function renderAvailabilityPage({
  availability,
  domain,
  locale,
}: {
  availability: SiteAvailability;
  domain?: string;
  locale?: string | null;
}) {
  const defaultLocale = normalizeLocale(locale) || await resolveRequestLocale();

  return (
    <ClientProviders
      defaultLocale={defaultLocale}
      availableLocales={SUPPORTED_LOCALES.map((supportedLocale) => supportedLocale.code)}
    >
      <AvailabilityScreen availability={availability} domain={domain} />
    </ClientProviders>
  );
}
