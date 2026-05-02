import type { MetadataRoute } from 'next';
import { resolveHostFromHeaders } from '@/cms/client';
import { absoluteSiteUrl } from '@/lib/routes';

export const dynamic = 'force-dynamic';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = await resolveHostFromHeaders();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: absoluteSiteUrl(host, '/sitemap.xml'),
  };
}
