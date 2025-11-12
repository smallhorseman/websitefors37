import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get query params for filtering/sorting
    const { searchParams } = new URL(request.url)
    const minScore = searchParams.get('minScore') ? parseInt(searchParams.get('minScore')!) : 0
    const status = searchParams.get('status')
    const sortBy = searchParams.get('sortBy') || 'lead_score' // lead_score, created_at, last_activity_at
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100

    // Build query
    let query = supabase
      .from('leads')
      .select('*')
      .gte('lead_score', minScore)
      .order(sortBy as any, { ascending: sortOrder === 'asc' })
      .limit(limit)

    // Apply status filter if provided
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: leads, error } = await query

    if (error) {
      console.error('Error fetching scored leads:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    // Calculate score distribution
    const scoreRanges = {
      hot: leads?.filter(l => l.lead_score >= 70).length || 0,
      warm: leads?.filter(l => l.lead_score >= 40 && l.lead_score < 70).length || 0,
      cold: leads?.filter(l => l.lead_score < 40).length || 0
    }

    return NextResponse.json({
      success: true,
      leads: leads || [],
      total: leads?.length || 0,
      scoreRanges
    })
  } catch (error: any) {
    console.error('Failed to fetch scored leads:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

// POST to manually recalculate scores
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Manually update each lead to trigger the score calculation
    const { data: allLeads, error: fetchError } = await supabase
      .from('leads')
      .select('id')

    if (fetchError) throw fetchError

    // Update each lead to trigger the score calculation
    for (const lead of allLeads || []) {
      await supabase
        .from('leads')
        .update({ last_activity_at: new Date().toISOString() })
        .eq('id', lead.id)
    }

    return NextResponse.json({
      success: true,
      message: 'Lead scores recalculated',
      count: allLeads?.length || 0
    })
  } catch (error: any) {
    console.error('Failed to recalculate scores:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to recalculate' },
      { status: 500 }
    )
  }
}
