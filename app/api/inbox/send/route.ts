import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import twilio from 'twilio'
import { createLogger } from '@/lib/logger'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

const log = createLogger('api/inbox/send')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const twilioPhone = process.env.TWILIO_PHONE_NUMBER || ''

/**
 * Send SMS from inbox
 * POST /api/inbox/send
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request.headers)
    const rl = rateLimit(`inbox-send:${ip}`, { limit: 10, windowMs: 60000 })
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }
    
    const body = await request.json()
    const { conversationId, to, message, sentBy } = body
    
    if (!conversationId || !to || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Normalize phone number (add +1 if needed)
    const normalizedTo = to.startsWith('+') ? to : `+1${to.replace(/\D/g, '')}`
    const normalizedFrom = twilioPhone.startsWith('+') ? twilioPhone : `+1${twilioPhone}`
    
    log.info('Sending SMS', { to: normalizedTo, from: normalizedFrom })
    
    // Send via Twilio
    const twilioMessage = await twilioClient.messages.create({
      body: message,
      from: normalizedFrom,
      to: normalizedTo
    })
    
    // Calculate cost (estimate: 0.75 cents per segment)
    const segments = Math.ceil(message.length / 160)
    const costCents = segments * 0.75
    
    // Save to database
    const { data: savedMessage, error: dbError } = await supabase
      .from('sms_messages')
      .insert({
        conversation_id: conversationId,
        body: message,
        direction: 'outbound',
        from_phone: normalizedFrom,
        to_phone: normalizedTo,
        provider: 'twilio',
        provider_message_sid: twilioMessage.sid,
        provider_status: twilioMessage.status,
        status: 'sent',
        segments_count: segments,
        cost_cents: Math.round(costCents),
        sent_by: sentBy || null
      })
      .select()
      .single()
    
    if (dbError) {
      log.error('Database error', dbError)
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      )
    }
    
    log.info('Message sent successfully', { sid: twilioMessage.sid })
    
    return NextResponse.json({
      success: true,
      message: savedMessage
    })
    
  } catch (error: any) {
    log.error('Send error', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    )
  }
}
