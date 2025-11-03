import { randomBytes, createHash } from 'crypto'
import { supabase } from '@/lib/supabase'

export type SessionRecord = {
  id: string
  user_id: string
  token_hash: string
  created_at: string
  last_used_at?: string | null
  expires_at: string
  revoked: boolean
  ip?: string | null
  user_agent?: string | null
}

export function generateSessionToken(bytes: number = 32) {
  const token = randomBytes(bytes).toString('hex') // 64 hex chars
  const hash = hashToken(token)
  return { token, hash }
}

export function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export async function createSession(params: {
  userId: string
  expiresInDays?: number
  ip?: string
  userAgent?: string
}): Promise<{ token: string; expiresAt: Date } | null> {
  const { userId, expiresInDays = 7, ip, userAgent } = params
  const { token, hash } = generateSessionToken()
  const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)

  const { error } = await supabase
    .from('admin_sessions')
    .insert({
      user_id: userId,
      token_hash: hash,
      expires_at: expiresAt.toISOString(),
      ip: ip || null,
      user_agent: userAgent || null,
    })

  if (error) {
    console.error('Failed to create session:', error)
    return null
  }

  return { token, expiresAt }
}

export async function revokeSessionByToken(token: string): Promise<boolean> {
  try {
    const tokenHash = hashToken(token)
    const { error } = await supabase
      .from('admin_sessions')
      .update({ revoked: true })
      .eq('token_hash', tokenHash)
    if (error) throw error
    return true
  } catch (e) {
    console.error('Failed to revoke session:', e)
    return false
  }
}
