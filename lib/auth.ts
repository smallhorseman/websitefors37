import { cookies } from 'next/headers'
import { supabase } from './supabase'

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

    // Verify session token against user_profiles table
    const { data: user, error } = await supabase
      .from('user_profiles')
      .select('id, email, role, created_at')
      .eq('id', sessionToken)
      .eq('role', 'admin')
      .single()

    if (error || !user) {
      return null
    }

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
