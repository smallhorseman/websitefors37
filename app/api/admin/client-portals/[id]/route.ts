import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const dynamic = 'force-dynamic'

// GET single user with projects
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { id } = params

    const { data: user, error } = await supabase
      .from('client_portal_users')
      .select(`
        *,
        lead:lead_id (*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    // Get projects for this user
    const { data: projects, error: projError } = await supabase
      .from('client_projects')
      .select('*')
      .eq('client_user_id', id)
      .order('created_at', { ascending: false })

    if (projError) console.error('Error fetching projects:', projError)

    // Get messages for this user
    const { data: messages, error: msgError } = await supabase
      .from('client_messages')
      .select('*')
      .eq('client_user_id', id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (msgError) console.error('Error fetching messages:', msgError)

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        projects: projects || [],
        recent_messages: messages || []
      }
    })
  } catch (error: any) {
    console.error('Error fetching client portal user:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PATCH to update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { id } = params
    const body = await request.json()

    const updates: any = {}
    if (body.first_name !== undefined) updates.first_name = body.first_name
    if (body.last_name !== undefined) updates.last_name = body.last_name
    if (body.email !== undefined) updates.email = body.email
    if (body.phone !== undefined) updates.phone = body.phone
    if (body.is_active !== undefined) updates.is_active = body.is_active
    if (body.avatar_url !== undefined) updates.avatar_url = body.avatar_url

    const { data, error } = await supabase
      .from('client_portal_users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      user: data
    })
  } catch (error: any) {
    console.error('Error updating client portal user:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { id } = params

    const { error } = await supabase
      .from('client_portal_users')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({
      success: true
    })
  } catch (error: any) {
    console.error('Error deleting client portal user:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
