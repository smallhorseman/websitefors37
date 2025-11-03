import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()
    const { data, error } = await supabase
      .from('gallery_highlight_sets')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) throw error
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({ set: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to load set' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth()
    const body = await req.json()

    const update: any = {}
    ;['name','slug','description','config','slide_duration_ms','transition','layout','is_active'].forEach((k) => {
      if (body[k] !== undefined) update[k] = body[k]
    })

    const { data, error } = await supabase
      .from('gallery_highlight_sets')
      .update(update)
      .eq('id', params.id)
      .select('*')
      .single()

    if (error) throw error

    return NextResponse.json({ set: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update set' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth()
    const { error } = await supabase
      .from('gallery_highlight_sets')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete set' }, { status: 500 })
  }
}
