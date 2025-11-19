import { NextRequest, NextResponse } from 'next/server'
import { getPageLayout } from '@/lib/pageConfigs'
import { isAuthenticated } from '@/lib/auth'
import { getClientIp, rateLimit } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const path = url.searchParams.get('path') || '/'
    const draft = url.searchParams.get('draft') === '1'

    const ip = getClientIp(req.headers)
    const rl = rateLimit(`layout:get:${ip}`, { limit: 60, windowMs: 60_000 })
    if (!rl.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

    const authed = await isAuthenticated()
    if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const layout = await getPageLayout(path, draft)
    if (!layout) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ path: layout.path, blocks: layout.blocks })
  } catch (e) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
