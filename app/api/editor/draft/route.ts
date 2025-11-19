import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

// Save draft props for a block (does not publish)
// payload: { path, block, id, props }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const path = String(body.path || '')
    const block = String(body.block || '')
    const id = String(body.id || '')
    const props = body.props ?? {}

    if (!path || !block || !id) {
      return NextResponse.json({ error: 'Missing required fields: path, block, id' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('page_configs')
      .upsert(
        [{ path, block_id: id, block_type: block, draft_props: props }],
        { onConflict: 'path,block_id' }
      )
      .select()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 })
  }
}
