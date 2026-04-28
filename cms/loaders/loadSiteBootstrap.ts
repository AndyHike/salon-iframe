import { cmsFetchResult } from '../client';
import { CmsSettingsResponse } from '../types';
import { normalizeAppearance } from '../normalize/appearance';
import { cacheTags, resolveSiteCacheId, uniqueCacheTags } from '../../lib/cache-tags';

export async function loadSiteBootstrap(domain: string) {
  const settingsResult = await cmsFetchResult<CmsSettingsResponse>('/api/public/v1/settings', {
    domain,
    tags: uniqueCacheTags([
      cacheTags.domain(domain),
      cacheTags.legacy.settings(domain),
      cacheTags.legacy.appearance(domain),
    ]),
  });

  if (!settingsResult.ok) {
    if (settingsResult.availability) {
      return {
        kind: 'blocked' as const,
        availability: settingsResult.availability,
      };
    }

    return null;
  }

  const settingsRes = settingsResult.data;

  if (!settingsRes || !settingsRes.success || !settingsRes.data) {
    return null;
  }

  const { data } = settingsRes;
  const appearance = normalizeAppearance(data.appearance);
  const siteId = resolveSiteCacheId(data, domain);

  return {
    kind: 'available' as const,
    siteId,
    settings: data,
    appearance,
  };
}
