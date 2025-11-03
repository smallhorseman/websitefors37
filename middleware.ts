import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Lightweight security middleware
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect admin routes (except login and setup)
  if (
    pathname.startsWith('/admin') &&
    pathname !== '/admin/login' &&
    pathname !== '/setup-admin'
  ) {
    const hasSession = req.cookies.has('admin_session')
    if (!hasSession) {
      const loginUrl = new URL('/login', req.url)
      // Preserve original destination to return after login
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Default pass-through with essential security headers only (CORS handled per-route)
  const res = NextResponse.next()
  res.headers.set('X-DNS-Prefetch-Control', 'on')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  return res
}

export const config = {
  matcher: [
    // Apply to all routes for headers
    '/((?!_next/static|_next/image|favicon.ico).*)',
    // Ensure admin protection runs
    '/admin/:path*',
  ],
}