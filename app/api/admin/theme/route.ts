import { NextRequest, NextResponse } from 'next/server'

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
  return NextResponse.json({ success: true, theme: defaultTheme })
}

export async function POST(request: NextRequest) {
  // In production, persist to DB (settings.theme_settings). For now, acknowledge receipt
  try {
    await request.json()
  } catch {}
  return NextResponse.json({ success: true })
}
