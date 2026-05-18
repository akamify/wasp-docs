import { NextRequest, NextResponse } from 'next/server';
import { getPublishedDocBySlug } from '@/app/lib/server/docs-service';

export const runtime = 'nodejs';

export async function GET(_request: NextRequest, context: { params: { slug: string } }) {
  try {
    const slug = context.params.slug;
    const doc = await getPublishedDocBySlug(slug);

    if (!doc) {
      return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: { doc } });
  } catch {
    return NextResponse.json({ ok: false, error: 'Failed to load doc' }, { status: 500 });
  }
}
