'use client'

import Link from 'next/link'

export default function ClientPortalsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="text-blue-600 hover:underline">← Back to Admin</Link>
          <h1 className="text-xl font-semibold">Client Portals</h1>
          <div />
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white border rounded-lg p-6">
          <p className="text-gray-700">Client portal management UI will appear here once the APIs are wired.</p>
          <p className="text-sm text-gray-500 mt-2">Add routes under <code className="font-mono">app/api/admin/client-portals</code> to enable full functionality.</p>
        </div>
      </div>
    </div>
  )
}
