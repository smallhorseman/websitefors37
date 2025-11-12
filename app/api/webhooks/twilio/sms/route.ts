import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import twilio from 'twilio'
import { createLogger } from '@/lib/logger'

const log = createLogger('api/webhooks/twilio/sms')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || ''

/**
 * Twilio SMS Webhook Handler
 * Receives incoming SMS messages and stores them in conversations
 * 
 * Configure in Twilio Console:
 * Phone Numbers → Your Number → Messaging → Webhook URL:
 * https://www.studio37.cc/api/webhooks/twilio/sms
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const params = new URLSearchParams(body)
    
    // Verify request is from Twilio
    const twilioSignature = request.headers.get('x-twilio-signature') || ''
    const url = request.url
    
    if (twilioAuthToken) {
      const isValid = twilio.validateRequest(
        twilioAuthToken,
        twilioSignature,
        url,
        Object.fromEntries(params)
      )
      
      if (!isValid) {
        log.warn('Invalid Twilio signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
      }
    }
    
    // Extract message data from Twilio webhook
    const messageData = {
      messageSid: params.get('MessageSid'),
      from: params.get('From'), // Customer phone number
      to: params.get('To'), // Your Twilio number (832-281-6621)
      body: params.get('Body') || '',
      numMedia: parseInt(params.get('NumMedia') || '0'),
      status: params.get('SmsStatus'),
    }
    
    // Extract media URLs if MMS
    const mediaUrls: string[] = []
    for (let i = 0; i < messageData.numMedia; i++) {
      const mediaUrl = params.get(`MediaUrl${i}`)
      if (mediaUrl) mediaUrls.push(mediaUrl)
    }
    
    log.info('Received SMS', { from: messageData.from, to: messageData.to })
    
    // Normalize phone number (remove +1 prefix for consistency)
    const normalizedPhone = messageData.from?.replace(/^\+1/, '') || ''
    
    // Find or create conversation
    const { data: conversation, error: convError } = await supabase
      .rpc('get_or_create_conversation', {
        p_phone: normalizedPhone,
        p_lead_id: null, // Will be linked later if lead exists
        p_contact_name: null
      })
    
    if (convError) {
      log.error('Error creating conversation', convError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
    
    // Try to link to existing lead by phone number
    const { data: lead } = await supabase
      .from('leads')
      .select('id, first_name, last_name')
      .eq('phone', normalizedPhone)
      .single()
    
    // Update conversation with lead info if found
    if (lead) {
      await supabase
        .from('sms_conversations')
        .update({
          lead_id: lead.id,
          contact_name: `${lead.first_name} ${lead.last_name}`.trim()
        })
        .eq('contact_phone', normalizedPhone)
    }
    
    // Insert the message
    const { error: msgError } = await supabase
      .from('sms_messages')
      .insert({
        conversation_id: conversation,
        body: messageData.body,
        direction: 'inbound',
        from_phone: messageData.from,
        to_phone: messageData.to,
        provider: 'twilio',
        provider_message_sid: messageData.messageSid,
        provider_status: messageData.status,
        status: 'received',
        is_read: false,
        media_urls: mediaUrls,
        num_media: messageData.numMedia,
        provider_metadata: {
          rawParams: Object.fromEntries(params)
        }
      })
    
    if (msgError) {
      log.error('Error saving message', msgError)
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
    }
    
    log.info('SMS saved successfully', { conversationId: conversation })
    
    // Return TwiML response (optional - can send auto-reply here)
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      {
        status: 200,
        headers: { 'Content-Type': 'text/xml' }
      }
    )
    
  } catch (error) {
    log.error('Webhook error', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
