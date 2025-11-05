import { createClient } from '@supabase/supabase-js'

// Admin client with service role key for server-side operations
// Use safe fallbacks during build to avoid crashes; real envs must be present at runtime.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'service-role-placeholder'

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
