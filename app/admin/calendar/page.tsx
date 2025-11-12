'use client'

import Link from 'next/link'

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="text-blue-600 hover:underline">← Back to Admin</Link>
          <h1 className="text-xl font-semibold">Calendar</h1>
          <div />
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white border rounded-lg p-6">
          <p className="text-gray-700">The interactive booking calendar will load here once the calendar API is configured.</p>
          <p className="text-sm text-gray-500 mt-2">Add the data endpoint at <code className="font-mono">app/api/admin/appointments-calendar/route.ts</code>.</p>
        </div>
      </div>
    </div>
  )
}
