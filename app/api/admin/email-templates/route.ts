import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  try {
    const { data: templates, error } = await supabaseAdmin
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, templates })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// Create a new email template
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))

    // Basic validation and defaults
    const name: string = (body.name || '').toString().trim()
    let slug: string = (body.slug || '').toString().trim()
    const subject: string = (body.subject || '').toString().trim()
    const category: string = (body.category || 'general').toString().trim()
    const html_content: string = (body.html_content || '<p>—</p>').toString()
    const text_content: string = (body.text_content || '').toString()
    const is_active: boolean = typeof body.is_active === 'boolean' ? body.is_active : true
    const variables = Array.isArray(body.variables) ? body.variables : []

    if (!name) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 })
    }
    if (!subject) {
      return NextResponse.json({ success: false, error: 'Subject is required' }, { status: 400 })
    }

    // Slugify if not provided
    if (!slug) {
      slug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
    }

    // Ensure slug uniqueness (append -2, -3, ... if needed)
    let uniqueSlug = slug
    let counter = 1
    while (true) {
      const { data: existing, error: slugErr } = await supabaseAdmin
        .from('email_templates')
        .select('id')
        .eq('slug', uniqueSlug)
        .maybeSingle()
      if (slugErr) break // if error, ignore and attempt insert
      if (!existing) break
      counter += 1
      uniqueSlug = `${slug}-${counter}`
    }

    const { data, error } = await supabaseAdmin
      .from('email_templates')
      .insert([
        {
          name,
          slug: uniqueSlug,
          subject,
          html_content,
          text_content,
          category,
          is_active,
          variables,
        },
      ])
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, template: data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
