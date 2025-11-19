import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

// Publish draft: copy draft_props into props and set is_published = true
// payload: { path, id }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const path = String(body.path || '')
    const id = String(body.id || '')

    if (!path || !id) {
      return NextResponse.json({ error: 'Missing required fields: path, id' }, { status: 400 })
    }

    // Fetch current row to get draft_props
    const { data: rows, error: selErr } = await supabaseAdmin
      .from('page_configs')
      .select('draft_props')
      .eq('path', path)
      .eq('block_id', id)
      .limit(1)

    if (selErr) return NextResponse.json({ error: selErr.message }, { status: 500 })
    const draft = rows?.[0]?.draft_props || {}

    const { data, error } = await supabaseAdmin
      .from('page_configs')
      .upsert(
        [{ path, block_id: id, props: draft, is_published: true }],
        { onConflict: 'path,block_id' }
      )
      .select()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 })
  }
}
