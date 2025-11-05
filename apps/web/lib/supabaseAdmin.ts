import { createClient } from '@supabase/supabase-js'

// Local admin stub used during apps/web build via webpack alias.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const service = process.env.SUPABASE_SERVICE_ROLE_KEY || 'service-role-placeholder'

export const supabaseAdmin = createClient(url, service, {
  auth: { autoRefreshToken: false, persistSession: false },
})
