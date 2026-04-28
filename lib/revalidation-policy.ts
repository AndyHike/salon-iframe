import { cacheTags, uniqueCacheTags } from './cache-tags';

export type RevalidationChangeEvent = {
  type?: string;
  event?: string;
  changeType?: string;
  siteId?: string | null;
  storeId?: string | null;
  domain?: string | null;
  collectionKey?: string | null;
  collection?: string | null;
  sectionKey?: string | null;
  categorySlug?: string | null;
  itemId?: string | null;
  itemSlug?: string | null;
  slug?: string | null;
  mediaId?: string | null;
  viewKey?: string | null;
};

function readEventType(event: RevalidationChangeEvent): string {
  return event.changeType || event.type || event.event || '';
}

function readCollectionKey(event: RevalidationChangeEvent): string | null {
  return event.collectionKey || event.collection || event.sectionKey || event.categorySlug || null;
}

function readItemKey(event: RevalidationChangeEvent): string | null {
  return event.itemSlug || event.slug || event.itemId || null;
}

function readSiteId(event: RevalidationChangeEvent, fallbackSiteId?: string | null): string | null {
  return event.siteId || event.storeId || fallbackSiteId || event.domain || null;
}

export function resolveRevalidationTags(
  event: RevalidationChangeEvent | null | undefined,
  fallbackSiteId?: string | null,
): string[] {
  if (!event || typeof event !== 'object') return [];

  const eventType = readEventType(event);
  const siteId = readSiteId(event, fallbackSiteId);
  if (!siteId) return [];

  const collectionKey = readCollectionKey(event);
  const itemKey = readItemKey(event);
  const tags: Array<string | null> = [];

  if (eventType.startsWith('settings.')) {
    tags.push(cacheTags.site(siteId), cacheTags.settings(siteId), cacheTags.view(siteId, 'home'));
  } else if (eventType.startsWith('appearance.')) {
    tags.push(cacheTags.site(siteId), cacheTags.appearance(siteId), cacheTags.view(siteId, 'home'));
  } else if (eventType.startsWith('media.')) {
    tags.push(cacheTags.media(siteId), event.mediaId ? cacheTags.mediaItem(siteId, event.mediaId) : null);
    if (collectionKey) {
      tags.push(cacheTags.collection(siteId, collectionKey), cacheTags.listView(siteId, collectionKey));
    }
    if (collectionKey && itemKey) {
      tags.push(cacheTags.item(siteId, collectionKey, itemKey), cacheTags.detailView(siteId, collectionKey, itemKey));
    }
    tags.push(cacheTags.view(siteId, 'home'));
  } else if (eventType.startsWith('collection.') || eventType.startsWith('category.')) {
    if (collectionKey) {
      tags.push(cacheTags.collection(siteId, collectionKey), cacheTags.listView(siteId, collectionKey));
    } else {
      tags.push(cacheTags.site(siteId));
    }
    tags.push(cacheTags.view(siteId, 'home'));
  } else if (eventType.startsWith('item.')) {
    if (collectionKey) {
      tags.push(cacheTags.collection(siteId, collectionKey), cacheTags.listView(siteId, collectionKey));
    }
    if (collectionKey && itemKey) {
      tags.push(cacheTags.item(siteId, collectionKey, itemKey), cacheTags.detailView(siteId, collectionKey, itemKey));
    }
    tags.push(cacheTags.view(siteId, 'home'));
  } else if (event.viewKey) {
    tags.push(cacheTags.view(siteId, event.viewKey));
  } else {
    tags.push(cacheTags.site(siteId));
  }

  return uniqueCacheTags(tags);
}
