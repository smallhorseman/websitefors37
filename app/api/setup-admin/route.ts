import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { createLogger } from '@/lib/logger'

const log = createLogger('api/setup-admin')

export async function POST(req: NextRequest) {
  try {
    // Basic guard: allow in development OR when a valid token is provided
    const isDev = process.env.NODE_ENV !== 'production'
    const token = req.nextUrl.searchParams.get('token') || req.headers.get('x-admin-setup-token') || ''
    const requiredToken = process.env.ADMIN_SETUP_TOKEN || ''

    if (!isDev && (!requiredToken || token !== requiredToken)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json().catch(() => ({}))
    const email = (body.email as string) || 'ceo@studio37.cc'
    const password = (body.password as string) || '19!Alebest'
    const name = (body.name as string) || 'CEO - Studio37'
    const role = (body.role as string) || 'owner'

    // Check if user already exists
    const { data: existing, error: findErr } = await supabaseAdmin
      .from('admin_users')
      .select('id, email')
      .eq('email', email)
      .maybeSingle()

    if (findErr) {
      log.error('Lookup failed', { email }, findErr)
      return NextResponse.json({ error: 'Lookup failed' }, { status: 500 })
    }

    const password_hash = await bcrypt.hash(password, 12)

    if (existing) {
      // Update password to ensure known credentials during setup
      const { error: updErr } = await supabaseAdmin
        .from('admin_users')
        .update({ password_hash, role })
        .eq('id', existing.id)

      if (updErr) {
        log.error('Update failed', { id: existing.id }, updErr)
        return NextResponse.json({ error: 'Update failed' }, { status: 500 })
      }

      log.info('Admin user updated', { id: existing.id, email })
      return NextResponse.json({ ok: true, updated: true })
    }

    // Create new admin user
    const { data: created, error: insErr } = await supabaseAdmin
      .from('admin_users')
      .insert({ name, email, password_hash, role })
      .select('id')
      .single()

    if (insErr) {
      log.error('Insert failed', { email }, insErr)
      return NextResponse.json({ error: 'Insert failed' }, { status: 500 })
    }

    log.info('Admin user created', { id: created.id, email })
    return NextResponse.json({ ok: true, created: true })
  } catch (err) {
    log.error('Setup error', undefined, err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
