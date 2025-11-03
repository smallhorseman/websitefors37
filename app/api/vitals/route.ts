import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getClientIp, rateLimit } from '@/lib/rateLimit'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { createLogger } from '@/lib/logger'

const log = createLogger('api/vitals')

const VitalsSchema = z.object({
  id: z.string(),
  name: z.enum(['CLS','FCP','FID','INP','LCP','TTFB']),
  value: z.number(),
  rating: z.enum(['good','needs-improvement','poor']).optional(),
  delta: z.number().optional(),
  navigationType: z.string().optional(),
  url: z.string().url().optional(),
  path: z.string().optional(),
  userAgent: z.string().optional(),
  ts: z.number().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers)
    const rl = rateLimit(`vitals:${ip}`, { limit: 30, windowMs: 60 * 1000 })
    if (!rl.allowed) {
      const retryAfter = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000))
      log.warn('Rate limit exceeded', { ip })
      return new NextResponse(JSON.stringify({ ok: false, error: 'too_many_requests' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': String(retryAfter) }
      })
    }

    const json = await req.json()
    const parsed = VitalsSchema.safeParse(json)
    if (!parsed.success) {
      log.warn('Invalid vitals payload', { issues: parsed.error.flatten() })
      return NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 })
    }

    const metric = parsed.data

    // Best-effort insert: if table doesn't exist, just log and return ok
    const { error } = await supabaseAdmin
      .from('web_vitals')
      .insert([
        {
          metric_id: metric.id,
          name: metric.name,
          value: metric.value,
          rating: metric.rating ?? null,
          delta: metric.delta ?? null,
          navigation_type: metric.navigationType ?? null,
          url: metric.url ?? null,
          path: metric.path ?? null,
          user_agent: metric.userAgent ?? req.headers.get('user-agent') ?? null,
          ip: ip || null,
          ts: metric.ts ? new Date(metric.ts).toISOString() : new Date().toISOString(),
        },
      ])

    if (error) {
      // Table likely missing; log once and continue
      log.warn('web_vitals insert failed (table missing or RLS)', { error: error.message })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    log.error('Vitals endpoint failure', undefined, err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
