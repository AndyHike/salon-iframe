import { cmsFetch } from '../client';
import { CmsSettingsResponse } from '../types';
import { normalizeAppearance } from '../normalize/appearance';

export async function loadSiteBootstrap(domain: string) {
  const settingsRes = await cmsFetch<CmsSettingsResponse>('/api/public/v1/settings', {
    domain,
    tags: [domain, `store-${domain}:settings`, `store-${domain}:appearance`],
  });

  if (!settingsRes || !settingsRes.success || !settingsRes.data) {
    return null;
  }

  const { data } = settingsRes;
  const appearance = normalizeAppearance(data.appearance);

  return {
    settings: data,
    appearance,
  };
}
