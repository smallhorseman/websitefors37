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

/**
 * Send auto-response email based on form type
 * Determines template based on service_interest and source
 */
async function sendAutoResponseEmail(lead: any, payload: any) {
  // Determine template slug based on context
  let templateSlug = 'contact-form-confirmation'
  
  // If service interest suggests booking/quote, use booking template
  const bookingKeywords = ['wedding', 'event', 'portrait', 'session', 'photoshoot', 'commercial']
  const isBookingRequest = bookingKeywords.some(kw => 
    payload.service_interest?.toLowerCase().includes(kw) ||
    payload.message?.toLowerCase().includes(kw)
  )
  

  // If source is newsletter signup, use newsletter welcome template
  if (payload.source === "newsletter-modal" || payload.service_interest === "newsletter") {
    templateSlug = "newsletter-welcome"
  } else if (isBookingRequest || payload.event_date) {
    templateSlug = "booking-request-confirmation"
  }
  // Get template ID from database
  const { data: template } = await supabaseAdmin
    .from('email_templates')
    .select('id')
    .eq('slug', templateSlug)
    .eq('is_active', true)
    .single()

  if (!template) {
    log.warn('Auto-response template not found', { slug: templateSlug })
    return
  }

  // Split name into first/last
  const nameParts = payload.name.split(' ')
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''

  // Prepare variables based on template type
  const variables: Record<string, any> = {
    firstName,
    lastName,
    email: payload.email,
    phone: payload.phone || '',
    message: payload.message,
    submittedAt: new Date().toLocaleString()
  }

  if (templateSlug === 'booking-request-confirmation') {
    variables.sessionType = payload.service_interest
    variables.preferredDate = payload.event_date || 'To be determined'
    variables.budget = payload.budget_range || 'Not specified'
    variables.details = payload.message
  }

  // Send email via marketing API
  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.studio37.cc'}/api/marketing/email/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: payload.email,
      subject: templateSlug === 'booking-request-confirmation' 
        ? 'We Received Your Booking Request!' 
        : 'Thanks for Contacting Studio37!',
      templateId: template.id,
      variables,
      leadId: lead.id
    })
  })

  log.info('Auto-response email sent', { 
    leadId: lead.id, 
    email: payload.email, 
    template: templateSlug 
  })
}

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

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
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter)
        }
      })
    }

    const json = await req.json()
    const parsed = LeadSchema.safeParse(json)
    if (!parsed.success) {
      log.warn('Validation failed', { issues: parsed.error.flatten() })
      return NextResponse.json({ error: 'Invalid form data', details: parsed.error.flatten() }, { 
        status: 400,
        headers: corsHeaders
      })
    }

    const payload = parsed.data

    // Insert the lead
    const { data: insertedLead, error } = await supabaseAdmin.from('leads').insert([
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
      .select()
      .single()

    if (error) {
      log.error('Lead insert error', { email: payload.email, service: payload.service_interest }, error)
      return NextResponse.json({ error: 'Failed to submit lead' }, { 
        status: 500,
        headers: corsHeaders
      })
    }

    // Send auto-response email (fire and forget - don't block response)
    sendAutoResponseEmail(insertedLead, payload).catch(err => {
      log.error('Auto-response email failed', { leadId: insertedLead.id }, err)
    })

    return NextResponse.json({ success: true }, { headers: corsHeaders })
  } catch (e: any) {
    log.error('Lead submission failed', undefined, e)
    return NextResponse.json({ error: 'Internal server error' }, { 
      status: 500,
      headers: corsHeaders
    })
  }
}
