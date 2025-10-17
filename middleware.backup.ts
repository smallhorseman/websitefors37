import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Skip middleware entirely for login and setup pages
  if (req.nextUrl.pathname === '/admin/login' || req.nextUrl.pathname === '/setup-admin') {
    return NextResponse.next()
  }
  
  // Only apply middleware to admin routes (excluding login)
  if (req.nextUrl.pathname.startsWith('/admin')) {
    try {
      const res = NextResponse.next()
      const supabase = createMiddlewareClient({ req, res })
      
      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession()
      
      if (!session || sessionError) {
        const loginUrl = new URL('/admin/login', req.url)
        return NextResponse.redirect(loginUrl)
      }
      
      // Optional: Check user role
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()
      
      if (!profile || (profile.role !== 'admin' && profile.role !== 'owner')) {
        const loginUrl = new URL('/admin/login', req.url)
        loginUrl.searchParams.set('error', 'unauthorized')
        return NextResponse.redirect(loginUrl)
      }
      
      return res
    } catch (error) {
      console.error('Middleware error:', error)
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('error', 'middleware')
      return NextResponse.redirect(loginUrl)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/((?!login$|_next|api|favicon.ico).*)',
    '/admin$'
  ]
}