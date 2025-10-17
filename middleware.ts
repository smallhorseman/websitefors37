// Completely disabled middleware - no authentication required
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Allow all requests through without any checks
  return NextResponse.next()
}