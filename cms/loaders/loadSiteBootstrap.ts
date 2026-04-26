import { cmsFetchResult } from '../client';
import { CmsSettingsResponse } from '../types';
import { normalizeAppearance } from '../normalize/appearance';

export async function loadSiteBootstrap(domain: string) {
  const settingsResult = await cmsFetchResult<CmsSettingsResponse>('/api/public/v1/settings', {
    domain,
    tags: [domain, `store-${domain}:settings`, `store-${domain}:appearance`],
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

  return {
    kind: 'available' as const,
    settings: data,
    appearance,
  };
}
