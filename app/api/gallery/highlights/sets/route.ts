import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth'

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export async function GET() {
  try {
    await requireAuth()
    const { data, error } = await supabase
      .from('gallery_highlight_sets')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ sets: data || [] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to load sets' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await req.json()

    const name: string = body.name
    const slug: string = body.slug ? String(body.slug) : slugify(name)
    const description: string | undefined = body.description
    const config = body.config ?? null
    const slide_duration_ms: number | undefined = body.slide_duration_ms
    const transition: string | undefined = body.transition
    const layout: string | undefined = body.layout
    const is_active: boolean = body.is_active !== false

    if (!name || !slug) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('gallery_highlight_sets')
      .upsert(
        {
          name,
          slug,
          description,
          config,
          slide_duration_ms,
          transition,
          layout,
          is_active,
          created_by: user.id,
        },
        { onConflict: 'slug' }
      )
      .select('*')
      .single()

    if (error) throw error

    return NextResponse.json({ set: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save set' }, { status: 500 })
  }
}
