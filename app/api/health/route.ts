import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  }

  let db = { ok: false as boolean, error: undefined as string | undefined }

  try {
    // Light-weight DB check
    const { error } = await supabaseAdmin.from('settings').select('id').limit(1)
    if (error) throw error
    db.ok = true
  } catch (e: any) {
    db = { ok: false, error: e?.message || 'db_error' }
  }

  const ok = env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY && env.SUPABASE_SERVICE_ROLE_KEY && db.ok
  return NextResponse.json({ ok, env, db }, { status: ok ? 200 : 500 })
}
