import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revokeSessionByToken } from '@/lib/authSession'
import { createLogger } from '@/lib/logger'

const log = createLogger('api/auth/logout')

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_session')?.value

    if (token) {
      // Revoke the session server-side
      await revokeSessionByToken(token)
      log.info('Session revoked')
    }

    // Clear session cookie client-side
    cookieStore.delete('admin_session')

    return NextResponse.json({ success: true })

  } catch (error) {
    log.error('Logout error', undefined, error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
