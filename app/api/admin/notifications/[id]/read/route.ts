import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // In production, would update a notifications table
  // For now, acknowledge the read request
  return NextResponse.json({ success: true })
}
