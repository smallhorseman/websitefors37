import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// Persist edited block props for a path+block_id into `page_configs`.
// Expected payload: { path: string; block: string; id: string; props: Record<string, any> }
// Table shape assumption:
//   page_configs(path text, block_id text, block_type text, props jsonb, updated_at timestamptz default now())
// Primary key or unique index on (path, block_id)

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

    // Basic server-side guard: service envs must be available at runtime
    const hasServiceEnv = !!process.env.SUPABASE_SERVICE_ROLE_KEY && !!process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!hasServiceEnv) {
      return NextResponse.json({ error: 'Server not configured with Supabase env vars' }, { status: 500 })
    }

    const { data, error } = await supabaseAdmin
      .from('page_configs')
      .upsert(
        [{ path, block_id: id, block_type: block, props }],
        { onConflict: 'path,block_id' }
      )
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Optional: trigger revalidation via Next 14 route segment revalidate
    // We can rely on ISR revalidate or dynamic rendering for admin; returning OK is fine.
    return NextResponse.json({ ok: true, data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 })
  }
}
