import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revokeSessionByToken } from '@/lib/authSession'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_session')?.value

    if (token) {
      // Revoke the session server-side
      await revokeSessionByToken(token)
    }

    // Clear session cookie client-side
    cookieStore.delete('admin_session')

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
