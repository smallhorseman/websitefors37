import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { getClientIp, rateLimit } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers)
    const rl = rateLimit(`import:${ip}`, { limit: 5, windowMs: 60_000 })
    if (!rl.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

    const authed = await isAuthenticated()
    if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const rows = Array.isArray(body?.rows) ? body.rows : []
    if (!rows.length) return NextResponse.json({ error: 'No rows provided' }, { status: 400 })

    // Normalize records: keep only known columns
    const cleaned = rows.map((r: any) => ({
      path: String(r.path || ''),
      block_id: String(r.block_id || ''),
      block_type: String(r.block_type || ''),
      props: r.props || {},
      draft_props: r.draft_props || null,
      is_published: !!r.is_published,
      updated_at: r.updated_at || new Date().toISOString(),
    }))

    // Upsert by (path, block_id)
    const { error } = await supabaseAdmin
      .from('page_configs')
      .upsert(cleaned, { onConflict: 'path,block_id' as any })
    if (error) return NextResponse.json({ error: 'Upsert failed' }, { status: 500 })
    return NextResponse.json({ imported: cleaned.length })
  } catch (e) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
