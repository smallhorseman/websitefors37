import { NextResponse } from 'next/server'

export async function POST() {
  // In production, would mark all notifications as read in DB
  // For now, acknowledge the request
  return NextResponse.json({ success: true })
}
