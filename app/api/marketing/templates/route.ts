import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { getClientIp, rateLimit } from '@/lib/rateLimit'
import { createLogger } from '@/lib/logger'

const log = createLogger('api/marketing/templates')

// GET /api/marketing/templates?type=email|sms  (lists templates)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as 'email' | 'sms' | null

    if (type === 'email') {
      const { data, error } = await supabaseAdmin
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return NextResponse.json({ templates: (data || []).map(t => ({ ...t, type: 'email' })) })
    }
    if (type === 'sms') {
      const { data, error } = await supabaseAdmin
        .from('sms_templates')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return NextResponse.json({ templates: (data || []).map(t => ({ ...t, type: 'sms' })) })
    }

    // Combined list (limited to latest 100 of each for performance)
    const [emails, smses] = await Promise.all([
      supabaseAdmin.from('email_templates').select('*').order('created_at', { ascending: false }).limit(100),
      supabaseAdmin.from('sms_templates').select('*').order('created_at', { ascending: false }).limit(100)
    ])
    if (emails.error) throw emails.error
    if (smses.error) throw smses.error
    const combined = [
      ...((emails.data || []).map(t => ({ ...t, type: 'email' }))),
      ...((smses.data || []).map(t => ({ ...t, type: 'sms' })))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    return NextResponse.json({ templates: combined })
  } catch (error: any) {
    log.error('GET templates failed', undefined, error)
    return NextResponse.json({ error: error.message || 'Failed to fetch templates' }, { status: 500 })
  }
}

// POST /api/marketing/templates  (create template)
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers)
    const rl = rateLimit(`createTemplate:${ip}`, { limit: 20, windowMs: 60 * 60 * 1000 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const body = await request.json()
    const { type, name, slug } = body
    if (type !== 'email' && type !== 'sms') {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }
    if (!name || !slug) {
      return NextResponse.json({ error: 'Missing name or slug' }, { status: 400 })
    }

    if (type === 'email') {
      const { subject, html_content, text_content, category, variables } = body
      if (!subject || !html_content) {
        return NextResponse.json({ error: 'Subject and html_content required' }, { status: 400 })
      }
      const insertPayload = {
        name,
        slug,
        subject,
        html_content,
        text_content: text_content || null,
        category: category || 'general',
        variables: Array.isArray(variables) ? JSON.stringify(variables) : '[]',
        is_active: true
      }
      const { data, error } = await supabaseAdmin
        .from('email_templates')
        .insert(insertPayload)
        .select('*')
        .single()
      if (error) throw error
      log.info('Email template created', { id: data.id, slug })
      return NextResponse.json({ template: { ...data, type: 'email' } }, { status: 201 })
    }

    // SMS template
    const { message_body, category, variables } = body
    if (!message_body) {
      return NextResponse.json({ error: 'message_body required' }, { status: 400 })
    }
    const msgLen = message_body.length
    const estimated_segments = Math.max(1, Math.ceil(msgLen / 160))
    const smsPayload = {
      name,
      slug,
      message_body,
      category: category || 'general',
      variables: Array.isArray(variables) ? JSON.stringify(variables) : '[]',
      is_active: true,
      character_count: msgLen,
      estimated_segments
    }
    const { data, error } = await supabaseAdmin
      .from('sms_templates')
      .insert(smsPayload)
      .select('*')
      .single()
    if (error) throw error
    log.info('SMS template created', { id: data.id, slug })
    return NextResponse.json({ template: { ...data, type: 'sms' } }, { status: 201 })
  } catch (error: any) {
    log.error('POST template failed', undefined, error)
    return NextResponse.json({ error: error.message || 'Failed to create template' }, { status: 500 })
  }
}
