import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  try {
    // Get stats from leads table by checking the auto-response logs
    // For now, we'll return mock data - you can enhance this later
    const { data: templates, error } = await supabaseAdmin
      .from('email_templates')
      .select('slug')

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    // Mock stats for now - in production, you'd query actual email send logs
    const stats = templates?.map(t => ({
      slug: t.slug,
      totalSent: Math.floor(Math.random() * 100), // Replace with actual query
      lastSent: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    })) || []

    return NextResponse.json({ success: true, stats })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
