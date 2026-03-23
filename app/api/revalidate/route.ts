import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { domain, token, tags } = body;

    // Verify the token
    if (token !== process.env.SYSTEM_MASTER_KEY) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!domain) {
      return NextResponse.json({ success: false, error: 'Domain is required' }, { status: 400 });
    }

    // Revalidate all fetches tagged with this domain
    revalidateTag(domain);

    // Revalidate any additional specific tags if provided
    if (tags && Array.isArray(tags)) {
      tags.forEach(tag => revalidateTag(tag));
    }

    return NextResponse.json({ 
      success: true, 
      revalidated: true, 
      domain, 
      now: Date.now() 
    });
  } catch (err) {
    console.error('Error revalidating:', err);
    return NextResponse.json({ success: false, error: 'Error revalidating' }, { status: 500 });
  }
}
