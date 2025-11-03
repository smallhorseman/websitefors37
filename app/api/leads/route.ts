import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { getClientIp, rateLimit } from '@/lib/rateLimit'
import { createLogger } from '@/lib/logger'

const log = createLogger('api/leads')

const LeadSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().optional(),
  service_interest: z.string().min(1),
  budget_range: z.string().optional(),
  event_date: z.string().optional(),
  message: z.string().min(10).max(5000),
  source: z.string().optional().default('web-form')
})

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 form posts per 5 minutes per IP
    const ip = getClientIp(req.headers)
    const rl = rateLimit(`lead:${ip}`, { limit: 5, windowMs: 5 * 60 * 1000 })
    if (!rl.allowed) {
      const retryAfter = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000))
      log.warn('Rate limit exceeded', { ip })
      return new NextResponse(JSON.stringify({ error: 'Too many submissions. Please try later.' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter)
        }
      })
    }

    const json = await req.json()
    const parsed = LeadSchema.safeParse(json)
    if (!parsed.success) {
      log.warn('Validation failed', { issues: parsed.error.flatten() })
      return NextResponse.json({ error: 'Invalid form data', details: parsed.error.flatten() }, { status: 400 })
    }

    const payload = parsed.data

    const { error } = await supabaseAdmin.from('leads').insert([
      {
        name: payload.name,
        email: payload.email,
        phone: payload.phone || null,
        service_interest: payload.service_interest,
        budget_range: payload.budget_range || null,
        event_date: payload.event_date || null,
        message: payload.message,
        status: 'new',
        source: payload.source || 'web-form'
      }
    ])

    if (error) {
      log.error('Lead insert error', { email: payload.email, service: payload.service_interest }, error)
      return NextResponse.json({ error: 'Failed to submit lead' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    log.error('Lead submission failed', undefined, e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
