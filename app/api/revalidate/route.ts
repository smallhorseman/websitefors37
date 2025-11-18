 import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { createLogger } from '@/lib/logger'

const log = createLogger('api/revalidate')

// Simple bearer token auth for on-demand revalidation
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'change-me-in-production'

// CORS headers for admin panel
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(req: NextRequest) {
  try {
    // Check authorization - allow both Bearer token and cookie-based admin sessions
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    // Allow if valid token OR if coming from same origin (admin panel)
    const isValidToken = token === REVALIDATE_SECRET
    const isSameOrigin = req.headers.get('origin')?.includes(req.headers.get('host') || '') || 
                         !req.headers.get('origin') // Same-origin requests may not have Origin header
    
    if (!isValidToken && !isSameOrigin) {
      log.warn('Unauthorized revalidation attempt', { 
        origin: req.headers.get('origin'),
        hasToken: !!token 
      })
      return NextResponse.json({ error: 'Unauthorized' }, { 
        status: 401,
        headers: corsHeaders 
      })
    }

    const body = await req.json()
    const { path, tag, type = 'path' } = body

    if (type === 'path' && path) {
      revalidatePath(path)
      log.info('Revalidated path', { path })
      return NextResponse.json({ revalidated: true, path }, { headers: corsHeaders })
    }

    if (type === 'tag' && tag) {
      revalidateTag(tag)
      log.info('Revalidated tag', { tag })
      return NextResponse.json({ revalidated: true, tag }, { headers: corsHeaders })
    }

    log.warn('Invalid revalidation request', { body })
    return NextResponse.json({ error: 'Invalid request. Provide path or tag.' }, { 
      status: 400,
      headers: corsHeaders 
    })
  } catch (err) {
    log.error('Revalidation failed', undefined, err)
    return NextResponse.json({ error: 'Internal server error' }, { 
      status: 500,
      headers: corsHeaders 
    })
  }
}
