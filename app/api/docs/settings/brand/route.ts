import { NextResponse } from 'next/server';
import { getBrandNameSetting } from '@/app/lib/server/docs-service';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const brandName = await getBrandNameSetting();
    return NextResponse.json({ ok: true, data: { brandName } });
  } catch {
    return NextResponse.json({ ok: false, error: 'Failed to load brand name' }, { status: 500 });
  }
}
