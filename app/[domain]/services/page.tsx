import type { Metadata } from 'next';
import { redirectToDefaultLocale } from '../_site/locale';

type ServicesRedirectRouteProps = {
  params: Promise<{ domain: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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

export default async function ServicesRedirectPage({
  params,
  searchParams,
}: ServicesRedirectRouteProps) {
  const { domain } = await params;
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page, 10) : 1;
  const path = page > 1 ? `/services?page=${page}` : '/services';

  return redirectToDefaultLocale(domain, path);
}
