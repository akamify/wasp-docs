import { NextResponse } from 'next/server'
import { getDocsLiveState } from '@/app/lib/server/docs-service'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const liveState = await getDocsLiveState()
    return NextResponse.json({ ok: true, data: liveState })
  } catch {
    return NextResponse.json({ ok: false, error: 'Failed to load live state' }, { status: 500 })
  }
}
