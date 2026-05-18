import { NextRequest, NextResponse } from 'next/server';
import { deleteDocById, updateDocById } from '@/app/lib/server/docs-service';
import { requireAdmin } from '@/app/lib/server/admin-auth';
import { validateUpdateDoc } from '@/app/lib/server/docs-validators';

export const runtime = 'nodejs';

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    const auth = requireAdmin(request);
    if (!auth.ok) {
      return NextResponse.json({ ok: false, error: auth.message }, { status: auth.status });
    }

    const body = await request.json();
    const validation = validateUpdateDoc(body);
    if (!validation.ok) {
      return NextResponse.json({ ok: false, error: validation.message }, { status: 400 });
    }

    const doc = await updateDocById(context.params.id, validation.value);
    if (!doc) {
      return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, data: { doc } });
  } catch {
    return NextResponse.json({ ok: false, error: 'Failed to update doc' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    const auth = requireAdmin(request);
    if (!auth.ok) {
      return NextResponse.json({ ok: false, error: auth.message }, { status: auth.status });
    }

    const deleted = await deleteDocById(context.params.id);
    if (!deleted) {
      return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Failed to delete doc' }, { status: 500 });
  }
}
