import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST() {
  return NextResponse.json({ error: 'Login not implemented in apps/web yet' }, { status: 503 })
}
