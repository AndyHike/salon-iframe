type SiteIdentitySource = {
  id?: string | null;
  siteId?: string | null;
  storeId?: string | null;
};

function cleanDomain(domain: string): string {
  return domain.trim().toLowerCase();
}

function present(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function uniqueCacheTags(tags: Array<string | null | undefined>): string[] {
  return Array.from(new Set(tags.filter(present).map((tag) => tag.trim())));
}

export function resolveSiteCacheId(source: SiteIdentitySource | null | undefined, domain: string): string {
  return source?.siteId || source?.storeId || source?.id || cleanDomain(domain);
}

export const cacheTags = {
  site: (siteId: string) => `site:${siteId}`,
  settings: (siteId: string) => `site:${siteId}:settings`,
  appearance: (siteId: string) => `site:${siteId}:appearance`,
  navigation: (siteId: string) => `site:${siteId}:navigation`,
  collection: (siteId: string, collectionKey: string) => `site:${siteId}:collection:${collectionKey}`,
  item: (siteId: string, collectionKey: string, itemKey: string) => `site:${siteId}:item:${collectionKey}:${itemKey}`,
  media: (siteId: string) => `site:${siteId}:media`,
  mediaItem: (siteId: string, mediaId: string) => `site:${siteId}:media:${mediaId}`,
  view: (siteId: string, viewKey: string) => `site:${siteId}:view:${viewKey}`,
  listView: (siteId: string, collectionKey: string) => `site:${siteId}:view:list:${collectionKey}`,
  detailView: (siteId: string, collectionKey: string, itemKey: string) =>
    `site:${siteId}:view:detail:${collectionKey}:${itemKey}`,
  domain: (domain: string) => cleanDomain(domain),
  legacy: {
    settings: (domain: string) => `store-${cleanDomain(domain)}:settings`,
    appearance: (domain: string) => `store-${cleanDomain(domain)}:appearance`,
    collection: (domain: string, collectionKey: string) => `store-${cleanDomain(domain)}:${collectionKey}`,
  },
};
