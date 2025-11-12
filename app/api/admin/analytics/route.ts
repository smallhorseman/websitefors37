import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get date ranges for analytics
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    // Leads analytics
    const { data: allLeads, error: leadsError } = await supabase
      .from('leads')
      .select('id, status, source, created_at, budget_range, lead_score')

    if (leadsError) console.error('Leads query error:', leadsError)

    const leadsLast30 = allLeads?.filter(l => 
      new Date(l.created_at) >= thirtyDaysAgo
    ) || []

    const leadsLast60 = allLeads?.filter(l => 
      new Date(l.created_at) >= sixtyDaysAgo && new Date(l.created_at) < thirtyDaysAgo
    ) || []

    // Leads by source
    const leadsBySource = (allLeads || []).reduce((acc: any, lead) => {
      const source = lead.source || 'unknown'
      acc[source] = (acc[source] || 0) + 1
      return acc
    }, {})

    // Leads by status
    const leadsByStatus = {
      new: allLeads?.filter(l => l.status === 'new').length || 0,
      contacted: allLeads?.filter(l => l.status === 'contacted').length || 0,
      qualified: allLeads?.filter(l => l.status === 'qualified').length || 0,
      converted: allLeads?.filter(l => l.status === 'converted').length || 0
    }

    // Conversion rate calculation
    const conversionRate = allLeads?.length 
      ? ((leadsByStatus.converted / allLeads.length) * 100).toFixed(1)
      : 0

    // Lead score distribution
    const scoreDistribution = {
      hot: allLeads?.filter(l => l.lead_score >= 70).length || 0,
      warm: allLeads?.filter(l => l.lead_score >= 40 && l.lead_score < 70).length || 0,
      cold: allLeads?.filter(l => l.lead_score < 40).length || 0
    }

    // Appointments analytics
    let appointmentsData = {
      total: 0,
      upcoming: 0,
      completed: 0,
      cancelled: 0,
      last30: 0
    }

    const { data: appointments, error: apptError } = await supabase
      .from('appointments')
      .select('id, status, appointment_date, created_at')

    if (!apptError && appointments) {
      appointmentsData = {
        total: appointments.length,
        upcoming: appointments.filter(a => 
          a.status === 'confirmed' && new Date(a.appointment_date) > now
        ).length,
        completed: appointments.filter(a => a.status === 'completed').length,
        cancelled: appointments.filter(a => a.status === 'cancelled').length,
        last30: appointments.filter(a => 
          new Date(a.created_at) >= thirtyDaysAgo
        ).length
      }
    }

    // Blog/Content analytics
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('id, view_count, published')

    const blogData = {
      total: blogPosts?.length || 0,
      published: blogPosts?.filter(p => p.published).length || 0,
      totalViews: blogPosts?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0
    }

    // Monthly leads trend (last 6 months)
    const monthlyTrend = []
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      const monthName = monthStart.toLocaleString('default', { month: 'short' })
      
      const count = allLeads?.filter(l => {
        const createdDate = new Date(l.created_at)
        return createdDate >= monthStart && createdDate <= monthEnd
      }).length || 0

      monthlyTrend.push({ month: monthName, leads: count })
    }

    return NextResponse.json({
      success: true,
      data: {
        leads: {
          total: allLeads?.length || 0,
          last30: leadsLast30.length,
          growthRate: leadsLast60.length > 0 
            ? (((leadsLast30.length - leadsLast60.length) / leadsLast60.length) * 100).toFixed(1)
            : leadsLast30.length > 0 ? '100' : '0',
          bySource: leadsBySource,
          byStatus: leadsByStatus,
          conversionRate: parseFloat(conversionRate),
          scoreDistribution,
          monthlyTrend
        },
        appointments: appointmentsData,
        blog: blogData
      }
    })
  } catch (error: any) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
