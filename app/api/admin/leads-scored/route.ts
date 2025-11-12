import { NextResponse } from 'next/server'

export async function GET() {
  // Minimal stub so the admin page renders without 404
  return NextResponse.json({ success: true, leads: [] })
}
