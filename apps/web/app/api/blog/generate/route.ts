import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST() {
  // Placeholder implementation in monorepo app; actual route exists in legacy root app.
  return NextResponse.json({ error: 'Not implemented in apps/web yet' }, { status: 503 })
}
