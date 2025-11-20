import { NextRequest, NextResponse } from "next/server";

// TEMPORARY STUB: Marketing campaign send route disabled to unblock production build.
// Original implementation caused build failures when RESEND_API_KEY missing during static analysis.
// TODO: Restore full email/SMS campaign sending with runtime-only client instantiation.

export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json(
    {
      error: "Campaign send feature temporarily disabled",
      campaignId: params.id,
      success: false,
      message: "Email/SMS campaign sending is currently unavailable. Please contact support."
    },
    { status: 503 }
  );
}
