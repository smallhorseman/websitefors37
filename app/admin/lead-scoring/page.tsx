'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Lead {
  id: string
  name?: string
  email?: string
  phone?: string
}

export default function LeadScoringPage() {
  const [leads, setLeads] = useState<Lead[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function run() {
      try {
        const res = await fetch('/api/admin/leads-scored', { next: { revalidate: 0 } })
        if (!res.ok) throw new Error(`API ${res.status}`)
        const data = await res.json()
        if (!cancelled) setLeads(data?.leads ?? [])
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load leads')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="text-blue-600 hover:underline">← Back to Admin</Link>
          <h1 className="text-xl font-semibold">Lead Scoring</h1>
          <div />
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {loading && (
          <div className="text-gray-600">Loading…</div>
        )}

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded">
            This page is installed, but the data API isn't configured yet. ({error})
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white border rounded-lg p-6">
            <p className="mb-4 text-gray-700">Lead scoring dashboard will appear here. {leads?.length ?? 0} leads loaded.</p>
            <div className="text-sm text-gray-500">To enable full functionality, add the API route at <code className="font-mono">app/api/admin/leads-scored/route.ts</code>.</div>
          </div>
        )}
      </div>
    </div>
  )
}
