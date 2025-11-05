import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { AppUser, TenantConfig } from './types'

export function createSupabaseClient(url: string, anonKey: string): SupabaseClient {
  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  })
}

export function createSupabaseAdminClient(url: string, serviceKey: string): SupabaseClient {
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Tenant utilities
export async function getTenantBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<TenantConfig | null> {
  const { data, error } = await supabase
    .from('tenant_config')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !data) return null
  return data as TenantConfig
}

export async function getTenantById(
  supabase: SupabaseClient,
  id: string
): Promise<TenantConfig | null> {
  const { data, error } = await supabase
    .from('tenant_config')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error || !data) return null
  return data as TenantConfig
}

// User utilities
export async function getUserByEmail(
  supabase: SupabaseClient,
  email: string
): Promise<AppUser | null> {
  const { data, error } = await supabase
    .from('app_users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !data) return null
  return data as AppUser
}

export async function hasAppAccess(user: AppUser, appName: keyof AppUser['app_access']): boolean {
  return user.app_access[appName] === true
}

// Session helpers
export function hashToken(token: string): string {
  // Simple hash for demo; in production use crypto
  return Buffer.from(token).toString('base64')
}

export function generateToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
