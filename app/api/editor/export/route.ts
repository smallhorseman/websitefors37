import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { getClientIp, rateLimit } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers)
    const rl = rateLimit(`export:${ip}`, { limit: 10, windowMs: 60_000 })
    if (!rl.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

    const authed = await isAuthenticated()
    if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const url = new URL(req.url)
    const path = url.searchParams.get('path')
    const query = supabaseAdmin.from('page_configs').select('*')
    const { data, error } = path ? await query.eq('path', path) : await query
    if (error) return NextResponse.json({ error: 'Query failed' }, { status: 500 })
    return NextResponse.json({ exported_at: new Date().toISOString(), count: (data || []).length, rows: data || [] })
  } catch (e) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
