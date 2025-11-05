import { NextResponse } from 'next/server'
import { STUDIO37_TENANT_SLUG } from '@studio37/shared'

export async function GET() {
  // Minimal gateway health/info endpoint. Expand to route sub-requests later.
  const info = {
    ok: true,
    app: 'gateway',
    tenant: STUDIO37_TENANT_SLUG,
    versions: {
      web: process.env.npm_package_version || 'unknown',
      node: process.version,
    },
    features: {
      workflow_app: true,
      client_portal: true,
      ai_tools: true,
      white_label: false,
    },
  }

  return NextResponse.json(info)
}
