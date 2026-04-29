import { loadBeautySalonHome } from '@/cms/loaders/loadBeautySalonHome';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import { renderAvailabilityPage } from '@/components/AvailabilityPage';
import { getDefaultLocaleCode, localizedPath } from '@/lib/routes';

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> {
  const { domain } = await params;
  const data = await loadBeautySalonHome(domain);

  if (!data) {
    return {
      title: 'Not Found',
    };
  }

  if (data.kind === 'blocked') {
    return {
      title: `Site unavailable | ${domain}`,
    };
  }

  return {
    title: data.settings.companyName || `${domain} - Premium Services`,
    description: data.settings.contactName || `Welcome to ${domain}`,
    openGraph: {
      title: data.settings.companyName || `${domain} - Premium Services`,
      description: data.settings.contactName || `Welcome to ${domain}`,
    },
  };
}

export default async function DomainPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  const data = await loadBeautySalonHome(domain);

  if (!data) {
    notFound();
  }

  if (data.kind === 'blocked') {
    return renderAvailabilityPage({ availability: data.availability, domain });
  }

  const defaultLocale = getDefaultLocaleCode(data.defaultLocale, data.availableLocales);
  redirect(localizedPath(defaultLocale, '/'));
}
