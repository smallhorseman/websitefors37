import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { searchParams } = new URL(request.url)
    
    const month = searchParams.get('month') // e.g., "2025-11"
    const view = searchParams.get('view') || 'month' // month, week, day

    let query = supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true })

    // Filter by month if specified
    if (month) {
      const [year, monthNum] = month.split('-')
      const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1)
      const endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59)
      
      query = query
        .gte('appointment_date', startDate.toISOString())
        .lte('appointment_date', endDate.toISOString())
    }

    const { data: appointments, error } = await query

    if (error) throw error

    return NextResponse.json({
      success: true,
      appointments: appointments || []
    })
  } catch (error: any) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST to create new appointment
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const body = await request.json()

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        lead_id: body.lead_id,
        client_name: body.client_name,
        client_email: body.client_email,
        client_phone: body.client_phone,
        appointment_date: body.appointment_date,
        appointment_time: body.appointment_time,
        session_type: body.session_type,
        location: body.location,
        notes: body.notes,
        status: body.status || 'confirmed'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      appointment: data
    })
  } catch (error: any) {
    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PATCH to update appointment (for drag-and-drop reschedule)
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const body = await request.json()

    const updates: any = {}
    if (body.appointment_date) updates.appointment_date = body.appointment_date
    if (body.appointment_time) updates.appointment_time = body.appointment_time
    if (body.status) updates.status = body.status
    if (body.notes !== undefined) updates.notes = body.notes

    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', body.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      appointment: data
    })
  } catch (error: any) {
    console.error('Error updating appointment:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
