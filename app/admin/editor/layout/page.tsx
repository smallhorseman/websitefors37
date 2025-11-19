import React from 'react'
import AdminProtected from '@/components/AdminProtected'
import BlockLayoutClient from '@/components/editor/BlockLayoutClient'

export const dynamic = 'force-dynamic'

export default function LayoutEditorPage({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
  const path = typeof searchParams?.path === 'string' ? searchParams?.path : '/'
  return (
    <AdminProtected>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Page Layout Editor</h1>
            <p className="text-gray-600">Manage the order of blocks, add new ones, or remove blocks for <code className="px-1 bg-gray-100 rounded">{path}</code>.</p>
          </div>
          <BlockLayoutClient path={path} />
        </div>
      </div>
    </AdminProtected>
  )
}
