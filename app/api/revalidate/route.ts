import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { resolveRevalidationTags, type RevalidationChangeEvent } from '@/lib/revalidation-policy';
import { uniqueCacheTags } from '@/lib/cache-tags';

function readTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0);
}

function readEvent(value: unknown): RevalidationChangeEvent | null {
  return value && typeof value === 'object' ? value as RevalidationChangeEvent : null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { domain, token } = body;
    const receivedTags = readTags(body.tags);
    const event = readEvent(body.event);

    // Verify the token
    if (token !== process.env.SYSTEM_MASTER_KEY) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!domain) {
      return NextResponse.json({ success: false, error: 'Domain is required' }, { status: 400 });
    }

    const eventTags = resolveRevalidationTags(event, event?.siteId || event?.storeId || domain);
    const tagsToRevalidate = uniqueCacheTags([
      domain,
      ...receivedTags,
      ...eventTags,
    ]);

    tagsToRevalidate.forEach((tag) => revalidateTag(tag));

    return NextResponse.json({ 
      success: true, 
      revalidated: true, 
      domain, 
      tags: tagsToRevalidate,
      event: event ? {
        type: event.changeType || event.type || event.event || null,
      } : null,
      now: Date.now() 
    });
  } catch (err) {
    console.error('Error revalidating:', err);
    return NextResponse.json({ success: false, error: 'Error revalidating' }, { status: 500 });
  }
}
