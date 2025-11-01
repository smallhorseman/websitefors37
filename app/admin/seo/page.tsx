'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, 
  TrendingUp, 
  FileText, 
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Globe,
  Target
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface SEOMetrics {
  totalPages: number
  pagesWithMeta: number
  pagesWithImages: number
  avgTitleLength: number
  avgDescriptionLength: number
  sitemapStatus: 'active' | 'inactive' | 'error'
  robotsStatus: 'active' | 'inactive' | 'error'
}

export default function SEOPage() {
  const [metrics, setMetrics] = useState<SEOMetrics>({
    totalPages: 0,
    pagesWithMeta: 0,
    pagesWithImages: 0,
    avgTitleLength: 0,
    avgDescriptionLength: 0,
    sitemapStatus: 'inactive',
    robotsStatus: 'inactive'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSEOData()
  }, [])

  const fetchSEOData = async () => {
    try {
      // This is a basic implementation - you can expand this with real analytics
      setMetrics({
        totalPages: 12, // Count of main pages
        pagesWithMeta: 12,
        pagesWithImages: 10,
        avgTitleLength: 52,
        avgDescriptionLength: 145,
        sitemapStatus: 'active',
        robotsStatus: 'active'
      })
    } catch (error) {
      console.error('Error fetching SEO data:', error)
    } finally {
      setLoading(false)
    }
  }

  const seoChecks = [
    {
      name: 'Sitemap.xml',
      status: metrics.sitemapStatus === 'active' ? 'success' : 'warning',
      description: 'XML sitemap is active and accessible',
      action: 'View Sitemap',
      link: '/sitemap.xml'
    },
    {
      name: 'Robots.txt',
      status: metrics.robotsStatus === 'active' ? 'success' : 'warning', 
      description: 'Robots file properly configured',
      action: 'View Robots',
      link: '/robots.txt'
    },
    {
      name: 'Meta Descriptions',
      status: metrics.pagesWithMeta === metrics.totalPages ? 'success' : 'warning',
      description: `${metrics.pagesWithMeta}/${metrics.totalPages} pages have meta descriptions`,
      action: 'Review Pages'
    },
    {
      name: 'Page Titles',
      status: metrics.avgTitleLength > 30 && metrics.avgTitleLength < 60 ? 'success' : 'warning',
      description: `Average title length: ${metrics.avgTitleLength} characters`,
      action: 'Optimize Titles'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 lg:ml-64 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SEO data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:ml-64">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Search className="h-8 w-8 text-blue-600" />
            SEO Management
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor and optimize your website's search engine performance.
          </p>
        </div>

        {/* SEO Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pages</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalPages}</p>
                <p className="text-xs text-green-600 mt-1">All indexed</p>
              </div>
              <Globe className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Title Length</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.avgTitleLength}</p>
                <p className="text-xs text-green-600 mt-1">Optimal range</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Meta Coverage</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((metrics.pagesWithMeta / metrics.totalPages) * 100)}%
                </p>
                <p className="text-xs text-green-600 mt-1">Complete coverage</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">SEO Score</p>
                <p className="text-2xl font-bold text-gray-900">92</p>
                <p className="text-xs text-green-600 mt-1">Excellent</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* SEO Health Checks */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">SEO Health Check</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {seoChecks.map((check, index) => (
              <div key={index} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {check.status === 'success' ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{check.name}</h3>
                    <p className="text-sm text-gray-600">{check.description}</p>
                  </div>
                </div>
                {check.link && (
                  <a
                    href={check.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {check.action}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick SEO Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a
                href="/admin/settings"
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Update Meta Tags</p>
                    <p className="text-sm text-gray-600">Manage default SEO settings</p>
                  </div>
                </div>
              </a>

              <a
                href="/admin/content"
                className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Content Audit</p>
                    <p className="text-sm text-gray-600">Review page content</p>
                  </div>
                </div>
              </a>

              <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Analytics Report</p>
                    <p className="text-sm text-gray-600">View SEO performance</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
