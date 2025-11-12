import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const dynamic = 'force-dynamic'

const defaultTheme = {
  primaryColor: '#3B82F6',
  secondaryColor: '#8B5CF6',
  accentColor: '#10B981',
  backgroundColor: '#F9FAFB',
  textColor: '#111827',
  borderRadius: '0.5rem',
  fontFamily: 'Inter, sans-serif'
}

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Try to get theme from settings table
    const { data: settings, error } = await supabase
      .from('settings')
      .select('theme_primary_color, theme_secondary_color')
      .single()

    if (error || !settings) {
      return NextResponse.json({ success: true, theme: defaultTheme })
    }

    // Map database fields to theme structure
    const theme = {
      ...defaultTheme,
      primaryColor: settings.theme_primary_color || defaultTheme.primaryColor,
      secondaryColor: settings.theme_secondary_color || defaultTheme.secondaryColor
    }

    return NextResponse.json({ success: true, theme })
  } catch (error: any) {
    console.error('Error fetching theme:', error)
    return NextResponse.json({ success: true, theme: defaultTheme })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const body = await request.json()

    // Save to settings table (singleton pattern with fixed UUID)
    const { data, error } = await supabase
      .from('settings')
      .update({
        theme_primary_color: body.primaryColor,
        theme_secondary_color: body.secondaryColor
      })
      .eq('id', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')
      .select()
      .single()

    if (error) {
      console.error('Error saving theme:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, theme: body })
  } catch (error: any) {
    console.error('Error in theme API:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

