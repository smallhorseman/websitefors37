'use client'

import Link from 'next/link'

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="text-blue-600 hover:underline">← Back to Admin</Link>
          <h1 className="text-xl font-semibold">Analytics Dashboard</h1>
          <div />
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white border rounded-lg p-6">
          <p className="text-gray-700">Analytics charts and conversion funnel will render here when the analytics API is available.</p>
          <p className="text-sm text-gray-500 mt-2">Create <code className="font-mono">app/api/admin/analytics/route.ts</code> to provide data.</p>
        </div>
      </div>
    </div>
  )
}
