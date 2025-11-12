import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { createLogger } from '@/lib/logger'

const log = createLogger('api/marketing/templates/[id]')

// Helper to determine table by type param or infer by existence
async function resolveTable(id: string, explicitType?: string) {
  if (explicitType === 'email' || explicitType === 'sms') return explicitType === 'email' ? 'email_templates' : 'sms_templates'
  // Try email first
  const { data: email } = await supabaseAdmin.from('email_templates').select('id').eq('id', id).single()
  if (email) return 'email_templates'
  const { data: sms } = await supabaseAdmin.from('sms_templates').select('id').eq('id', id).single()
  if (sms) return 'sms_templates'
  return null
}

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const table = await resolveTable(params.id)
    if (!table) return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    const { data, error } = await supabaseAdmin.from(table).select('*').eq('id', params.id).single()
    if (error || !data) return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    return NextResponse.json({ template: { ...data, type: table === 'email_templates' ? 'email' : 'sms' } })
  } catch (error: any) {
    log.error('GET template failed', undefined, error)
    return NextResponse.json({ error: 'Failed to fetch template' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const table = await resolveTable(params.id, body.type)
    if (!table) return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    const update: any = {}
    if (table === 'email_templates') {
      if (body.name) update.name = body.name
      if (body.subject) update.subject = body.subject
      if (body.html_content) update.html_content = body.html_content
      if (body.text_content !== undefined) update.text_content = body.text_content
      if (body.category) update.category = body.category
      if (body.variables) update.variables = Array.isArray(body.variables) ? JSON.stringify(body.variables) : body.variables
      if (body.is_active !== undefined) update.is_active = !!body.is_active
    } else {
      if (body.name) update.name = body.name
      if (body.message_body) {
        update.message_body = body.message_body
        update.character_count = body.message_body.length
        update.estimated_segments = Math.max(1, Math.ceil(body.message_body.length / 160))
      }
      if (body.category) update.category = body.category
      if (body.variables) update.variables = Array.isArray(body.variables) ? JSON.stringify(body.variables) : body.variables
      if (body.is_active !== undefined) update.is_active = !!body.is_active
    }
    const { data, error } = await supabaseAdmin.from(table).update(update).eq('id', params.id).select('*').single()
    if (error) throw error
    log.info('Template updated', { id: params.id })
    return NextResponse.json({ template: { ...data, type: table === 'email_templates' ? 'email' : 'sms' } })
  } catch (error: any) {
    log.error('PUT template failed', undefined, error)
    return NextResponse.json({ error: error.message || 'Failed to update template' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const table = await resolveTable(params.id)
    if (!table) return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    const { error } = await supabaseAdmin.from(table).delete().eq('id', params.id)
    if (error) throw error
    log.info('Template deleted', { id: params.id })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    log.error('DELETE template failed', undefined, error)
    return NextResponse.json({ error: error.message || 'Failed to delete template' }, { status: 500 })
  }
}
