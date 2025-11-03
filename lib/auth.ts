import { cookies } from 'next/headers'
import { supabase } from './supabase'
import { hashToken } from './authSession'

export interface AdminUser {
  id: string
  email: string
  role: string
  created_at: string
}

/**
 * Server-side authentication check
 * Validates session token and checks RLS policies
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin_session')?.value

    if (!sessionToken) {
      return null
    }

    // Verify session token via admin_sessions -> admin_users
    const tokenHash = hashToken(sessionToken)

    const { data, error } = await supabase
      .from('admin_sessions')
      .select('expires_at, revoked, user:admin_users(id, email, role, created_at)')
      .eq('token_hash', tokenHash)
      .single()

    if (error || !data || data.revoked) {
      return null
    }

    const now = new Date()
    const expiresAt = new Date(data.expires_at)
    if (expiresAt < now) {
      return null
    }

    const user = (data as any).user
    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      created_at: user.created_at
    }
  } catch (error) {
    console.error('Auth check failed:', error)
    return null
  }
}

/**
 * Check if user is authenticated (boolean only)
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getAdminUser()
  return user !== null
}

/**
 * Require authentication or throw
 * Use in server components/actions that need auth
 */
export async function requireAuth(): Promise<AdminUser> {
  const user = await getAdminUser()
  
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  return user
}
