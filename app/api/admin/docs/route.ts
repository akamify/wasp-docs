import { NextRequest, NextResponse } from 'next/server';
import { createDoc } from '@/app/lib/server/docs-service';
import { requireAdmin } from '@/app/lib/server/admin-auth';
import { validateCreateDoc } from '@/app/lib/server/docs-validators';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const auth = requireAdmin(request);
    if (!auth.ok) {
      return NextResponse.json({ ok: false, error: auth.message }, { status: auth.status });
    }

    const body = await request.json();
    const validation = validateCreateDoc(body);

    if (!validation.ok) {
      return NextResponse.json({ ok: false, error: validation.message }, { status: 400 });
    }

    const created = await createDoc(validation.value);
    return NextResponse.json({ ok: true, data: { doc: created } }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, error: 'Failed to create doc' }, { status: 500 });
  }
}
