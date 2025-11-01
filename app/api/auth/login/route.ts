import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Query admin user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password_hash, role')
      .eq('email', email)
      .eq('role', 'admin')
      .single()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // In production, you should use bcrypt or similar to verify password
    // For now, this is a basic comparison (REPLACE WITH PROPER HASHING)
    const passwordMatch = password === user.password_hash // TEMPORARY - use bcrypt.compare() in production

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create session by setting secure HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
