import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      return NextResponse.json({ 
        error: 'Session error', 
        details: sessionError.message 
      }, { status: 401 })
    }
    
    if (!session) {
      return NextResponse.json({ 
        error: 'No session found',
        authenticated: false 
      }, { status: 401 })
    }
    
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
    
    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        profile: profile || null,
        profileError: profileError?.message || null
      }
    })
    
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Server error', 
      details: error.message 
    }, { status: 500 })
  }
}