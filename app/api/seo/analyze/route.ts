import { analyzeHTML } from '@/lib/seo-analyzer'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const path = searchParams.get('url') || '/'

    // Build absolute URL from request origin; restrict to same-origin paths
    const origin = new URL(req.url).origin
    let target: URL
    try {
      if (path.startsWith('http')) {
        const u = new URL(path)
        if (u.origin !== origin) {
          return new Response(JSON.stringify({ error: 'Only same-origin analysis is allowed.' }), { status: 400 })
        }
        target = u
      } else {
        target = new URL(path, origin)
      }
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid URL.' }), { status: 400 })
    }

    const res = await fetch(target.toString(), { cache: 'no-store' })
    const html = await res.text()
    const analysis = analyzeHTML(target.pathname, html)
    return new Response(JSON.stringify(analysis), { headers: { 'content-type': 'application/json' } })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'Unexpected error' }), { status: 500 })
  }
}
