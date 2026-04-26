import { notFound } from 'next/navigation';
import { renderAvailabilityPage } from '@/components/AvailabilityPage';
import { ClientProviders } from '@/components/ClientProviders';
import { PreviewWrapper } from '@/components/PreviewWrapper';
import { beautySalonMinimalFixture } from '@/cms/fixtures/beautySalonMinimal';
import type { SiteAvailability, SiteAvailabilityCode } from '@/cms/types';

export const dynamic = 'force-dynamic';

const availabilityCodes: SiteAvailabilityCode[] = [
  'STORE_SUSPENDED',
  'SITE_MAINTENANCE',
  'SITE_TEMPORARILY_CLOSED',
];

function readAvailabilityCode(value: string | string[] | undefined): SiteAvailabilityCode {
  const code = Array.isArray(value) ? value[0] : value;
  return availabilityCodes.includes(code as SiteAvailabilityCode)
    ? (code as SiteAvailabilityCode)
    : 'SITE_MAINTENANCE';
}

function createAvailabilityFixture(
  code: SiteAvailabilityCode,
  message: string | null,
): SiteAvailability {
  const modeByCode: Record<SiteAvailabilityCode, SiteAvailability['mode']> = {
    STORE_SUSPENDED: 'SUSPENDED',
    SITE_MAINTENANCE: 'MAINTENANCE',
    SITE_TEMPORARILY_CLOSED: 'TEMPORARILY_CLOSED',
  };

  return {
    status: 403,
    success: false,
    code,
    mode: modeByCode[code],
    source: code === 'STORE_SUSPENDED' ? 'billing' : 'manual',
    message,
    until: '2026-05-01T09:00:00.000Z',
    error: 'Fixture availability response',
  };
}

export default async function ThemeFixturePage({
  params,
  searchParams,
}: {
  params: Promise<{ domain: string; fixture: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  const { domain, fixture } = await params;
  const resolvedSearchParams = await searchParams;

  if (fixture === 'beauty-salon-minimal') {
    return (
      <ClientProviders
        defaultLocale={beautySalonMinimalFixture.defaultLocale}
        availableLocales={beautySalonMinimalFixture.availableLocales.map((locale) => locale.code)}
      >
        <PreviewWrapper domain={domain} initialData={beautySalonMinimalFixture} />
      </ClientProviders>
    );
  }

  if (fixture === 'availability') {
    const code = readAvailabilityCode(resolvedSearchParams.code);
    const message = typeof resolvedSearchParams.message === 'string' ? resolvedSearchParams.message : null;
    const locale = typeof resolvedSearchParams.locale === 'string' ? resolvedSearchParams.locale : null;

    return renderAvailabilityPage({
      availability: createAvailabilityFixture(code, message),
      domain,
      locale,
    });
  }

  notFound();
}
