import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Get query params for filtering/sorting
  const { searchParams } = new URL(request.url)
  const minScore = searchParams.get('minScore') ? parseInt(searchParams.get('minScore')!) : 0
  const status = searchParams.get('status')
  const sortBy = searchParams.get('sortBy') || 'lead_score' // lead_score, created_at, last_activity_at
  const sortOrder = searchParams.get('sortOrder') || 'desc'
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100

  // Helper to compute score ranges safely even if lead_score missing
  const computeRanges = (items: any[] | null | undefined) => {
    const list = items || []
    const getScore = (l: any) => (typeof l.lead_score === 'number' ? l.lead_score : 0)
    return {
      hot: list.filter(l => getScore(l) >= 70).length,
      warm: list.filter(l => getScore(l) >= 40 && getScore(l) < 70).length,
      cold: list.filter(l => getScore(l) < 40).length,
    }
  }

  try {
    // Primary attempt: use requested filters/sorts (requires migration applied)
    let query = supabase
      .from('leads')
      .select('*')
      .order(sortBy as any, { ascending: sortOrder === 'asc' })
      .limit(limit)

    if (minScore > 0) {
      query = query.gte('lead_score', minScore)
    }
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    let { data: leads, error } = await query

    // If missing column (undefined_column), fall back to created_at and no lead_score filter
    if (error && (error.code === '42703' || /column .* does not exist/i.test(error.message))) {
      let fallback = supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (status && status !== 'all') {
        fallback = fallback.eq('status', status)
      }

      const fb = await fallback
      leads = fb.data || []
      error = fb.error as any

      if (error) {
        console.error('Fallback leads query failed:', error)
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        leads,
        total: leads.length,
        scoreRanges: computeRanges(leads),
        note: 'Using fallback (migration not applied yet). Run 20251112_lead_scoring.sql to enable lead_score filters and sorting.'
      })
    }

    if (error) {
      console.error('Error fetching scored leads:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      leads: leads || [],
      total: leads?.length || 0,
      scoreRanges: computeRanges(leads)
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
