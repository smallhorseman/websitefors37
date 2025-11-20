import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Admin service-role client for server-side use ONLY (app/api/**). Never import in client components.
// Uses lazy singleton initialization to avoid multiple GoTrue instances during build.
let _supabaseAdmin: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'service-role-placeholder'
    _supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return _supabaseAdmin
}

// Backwards compatibility export: behaves like a SupabaseClient but initializes on first property access.
export const supabaseAdmin: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const client = getSupabaseAdmin()
    // @ts-ignore - dynamic property access passthrough
    return client[prop]
  }
})
