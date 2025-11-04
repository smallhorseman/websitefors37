import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { createLogger } from '@/lib/logger'

const log = createLogger('api/revalidate')

// Simple bearer token auth for on-demand revalidation
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'change-me-in-production'

export async function POST(req: NextRequest) {
  try {
    // Check authorization
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (token !== REVALIDATE_SECRET) {
      log.warn('Unauthorized revalidation attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { path, tag, type = 'path' } = body

    if (type === 'path' && path) {
      revalidatePath(path)
      log.info('Revalidated path', { path })
      return NextResponse.json({ revalidated: true, path })
    }

    if (type === 'tag' && tag) {
      revalidateTag(tag)
      log.info('Revalidated tag', { tag })
      return NextResponse.json({ revalidated: true, tag })
    }

    log.warn('Invalid revalidation request', { body })
    return NextResponse.json({ error: 'Invalid request. Provide path or tag.' }, { status: 400 })
  } catch (err) {
    log.error('Revalidation failed', undefined, err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
