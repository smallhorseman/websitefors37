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
    const { data: credentials, error } = await supabase
      .from('admin_credentials')
      .select('*, user_profiles!admin_credentials_user_profile_id_fkey(*)')
      .eq('email', email)
      .single()

    if (error || !credentials) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // TEMPORARY: Direct password comparison (MUST use bcrypt.compare() in production)
    const passwordMatch = password === credentials.password_hash

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Get user profile data
    const userProfile = credentials.user_profiles

    if (!userProfile || userProfile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - admin access required' },
        { status: 403 }
      )
    }

    // Create session by setting secure HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_session', userProfile.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    return NextResponse.json({
      success: true,
      user: {
        id: userProfile.id,
        email: userProfile.email,
        role: userProfile.role,
        name: userProfile.name
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
