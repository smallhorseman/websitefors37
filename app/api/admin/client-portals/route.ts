import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const dynamic = 'force-dynamic'

// GET all client portal users
export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: users, error } = await supabase
      .from('client_portal_users')
      .select(`
        *,
        lead:lead_id (
          id,
          name,
          email,
          phone,
          status
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Get project count for each user
    const usersWithProjects = await Promise.all(
      (users || []).map(async (user) => {
        const { data: projects, error: projError } = await supabase
          .from('client_projects')
          .select('id, status')
          .eq('client_user_id', user.id)

        return {
          ...user,
          project_count: projects?.length || 0,
          active_projects: projects?.filter(p => p.status !== 'archived' && p.status !== 'completed').length || 0
        }
      })
    )

    return NextResponse.json({
      success: true,
      users: usersWithProjects
    })
  } catch (error: any) {
    console.error('Error fetching client portal users:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST to create a new client portal user
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const body = await request.json()

    // Hash password if provided
    let passwordHash = null
    if (body.password) {
      passwordHash = await bcrypt.hash(body.password, 10)
    }

    const { data, error } = await supabase
      .from('client_portal_users')
      .insert({
        lead_id: body.lead_id,
        email: body.email,
        password_hash: passwordHash,
        first_name: body.first_name,
        last_name: body.last_name,
        phone: body.phone,
        is_active: body.is_active !== undefined ? body.is_active : true
      })
      .select()
      .single()

    if (error) throw error

    // Send welcome email (TODO: integrate with email template system)

    return NextResponse.json({
      success: true,
      user: data
    })
  } catch (error: any) {
    console.error('Error creating client portal user:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
