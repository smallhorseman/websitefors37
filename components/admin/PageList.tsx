"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

type ContentPage = {
  id: string
  slug: string
  title: string
  published: boolean
  updated_at: string
}

export default function PageList() {
  const [pages, setPages] = useState<ContentPage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPages()
  }, [])

  async function fetchPages() {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/pages', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to fetch pages')
      const data = await res.json()
      setPages(data.pages || [])
    } catch (e: any) {
      setError(e.message || 'Failed to load pages')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse space-y-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-red-600 text-sm">Error: {error}</div>
      </div>
    )
  }

  const publishedPages = pages.filter(p => p.published)

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Live Pages</h3>
          <p className="text-sm text-gray-500 mt-1">{publishedPages.length} published page{publishedPages.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/content" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          Manage All →
        </Link>
      </div>
      <div className="divide-y divide-gray-200">
        {publishedPages.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">
            No published pages yet
          </div>
        ) : (
          publishedPages.map(page => {
            const pageUrl = page.slug === 'home' ? '/' : `/${page.slug}`
            const editUrl = `${pageUrl}?edit=1`
            const layoutUrl = `/admin/editor/layout?path=${encodeURIComponent(pageUrl)}`
            
            return (
              <div key={page.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {page.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      <code className="bg-gray-100 px-1.5 py-0.5 rounded">{pageUrl}</code>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a 
                      href={pageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                      title="View live page"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </a>
                    <a 
                      href={editUrl}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded bg-primary-600 text-white hover:bg-primary-700"
                      title="Edit with overlay editor"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </a>
                    <a 
                      href={layoutUrl}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded border border-purple-300 text-purple-700 hover:bg-purple-50"
                      title="Manage block layout"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                      </svg>
                      Layout
                    </a>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
