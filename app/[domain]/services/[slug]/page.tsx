import type { Metadata } from 'next';
import { redirectToDefaultLocale } from '../../_site/locale';

type ServiceRedirectRouteProps = {
  params: Promise<{ domain: string; slug: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Redirecting',
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function ServiceRedirectRoute({ params }: ServiceRedirectRouteProps) {
  const { domain, slug } = await params;

  return redirectToDefaultLocale(domain, `/services/${encodeURIComponent(slug)}`);
}
