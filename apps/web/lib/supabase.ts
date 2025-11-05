import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Local stub used during apps/web build via webpack alias.
// Uses placeholders to avoid crashing at module scope if envs are missing.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-placeholder'

declare global {
  // eslint-disable-next-line no-var
  var __supabase_stub__: SupabaseClient | undefined
}

export const supabase: SupabaseClient =
  globalThis.__supabase_stub__ ?? createClient(url, anon, { auth: { autoRefreshToken: true, persistSession: true } })

if (typeof window !== 'undefined') {
  globalThis.__supabase_stub__ = supabase
}
