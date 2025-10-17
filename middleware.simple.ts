// Simplified middleware - temporary solution for admin access
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // For now, allow all admin access - we'll add simple session check later
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}