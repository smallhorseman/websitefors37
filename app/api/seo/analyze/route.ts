import { NextRequest, NextResponse } from 'next/server'

// Deprecated endpoint - kept to prevent build failures from empty module
// Returns a simple OK response for both GET and POST to avoid breaking clients.
export const runtime = 'edge'

export async function GET(_req: NextRequest) {
	return NextResponse.json({ ok: true, deprecated: true, message: 'SEO analyze endpoint is deprecated.' })
}

export async function POST(_req: NextRequest) {
	return NextResponse.json({ ok: true, deprecated: true, message: 'SEO analyze endpoint is deprecated.' })
}

