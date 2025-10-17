import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Handle admin routes authentication
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const supabase = createMiddlewareClient({ req, res })
    
    // Get the session
    const {
      data: { session },
    } = await supabase.auth.getSession()
    
    // Allow access to login page
    if (req.nextUrl.pathname === '/admin/login') {
      // If already authenticated, redirect to admin dashboard
      if (session) {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url))
      }
      return res
    }
    
    // Protect all other admin routes
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    
    // Check if user has admin role (you can customize this logic)
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()
    
    if (profile?.role !== 'admin' && profile?.role !== 'owner') {
      return NextResponse.redirect(new URL('/admin/login?error=unauthorized', req.url))
    }
  }
  
  return res
}

export const config = {
  matcher: ['/admin/:path*']
}