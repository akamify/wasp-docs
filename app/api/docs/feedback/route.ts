import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { DocFeedbackModel } from '@/app/lib/server/doc-feedback-model';

export const runtime = 'nodejs';

type FeedbackBody = {
  slug?: string;
  helpful?: boolean;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as FeedbackBody;
    const slug = (body.slug || '').trim().toLowerCase();

    if (!slug || typeof body.helpful !== 'boolean') {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
    }

    const uri = (process.env.MONGODB_URI || '').trim();
    if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
      return NextResponse.json({ ok: false, error: 'Database is not configured' }, { status: 503 });
    }

    await connectToDatabase();

    await DocFeedbackModel.create({
      slug,
      helpful: body.helpful,
      userAgent: request.headers.get('user-agent') || '',
      source: 'docs-web',
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Failed to save feedback' }, { status: 500 });
  }
}
