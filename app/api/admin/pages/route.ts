import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { getClientIp, rateLimit } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers)
    const rl = rateLimit(`pages:list:${ip}`, { limit: 60, windowMs: 60_000 })
    if (!rl.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

    const authed = await isAuthenticated()
    if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabaseAdmin
      .from('content_pages')
      .select('id, slug, title, published, updated_at')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch pages:', error)
      return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
    }

    return NextResponse.json({ pages: data || [] })
  } catch (e) {
    console.error('Pages list error:', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
