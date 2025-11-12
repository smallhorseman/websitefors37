'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface EmailTemplate {
  id: string
  name: string
  slug: string
  description: string
  is_active: boolean
  subject_line: string
  created_at: string
  updated_at: string
}

interface TemplateStats {
  slug: string
  totalSent: number
  lastSent: string | null
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [stats, setStats] = useState<Record<string, TemplateStats>>({})
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchTemplates()
    fetchStats()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/admin/email-templates')
      const data = await response.json()
      if (data.success) {
        setTemplates(data.templates)
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/email-templates/stats')
      const data = await response.json()
      if (data.success) {
        const statsMap: Record<string, TemplateStats> = {}
        data.stats.forEach((stat: TemplateStats) => {
          statsMap[stat.slug] = stat
        })
        setStats(statsMap)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const toggleTemplate = async (templateId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/email-templates/${templateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus })
      })
      
      if (response.ok) {
        fetchTemplates()
      }
    } catch (error) {
      console.error('Failed to toggle template:', error)
    }
  }

  const getTemplateIcon = (slug: string) => {
    switch (slug) {
      case 'contact-form-confirmation': return '✉️'
      case 'booking-request-confirmation': return '📅'
      case 'coupon-delivery': return '🎁'
      case 'newsletter-welcome': return '📰'
      default: return '📧'
    }
  }

  const getTemplateColor = (slug: string) => {
    switch (slug) {
      case 'contact-form-confirmation': return 'from-green-500 to-emerald-600'
      case 'booking-request-confirmation': return 'from-amber-500 to-orange-600'
      case 'coupon-delivery': return 'from-pink-500 to-purple-600'
      case 'newsletter-welcome': return 'from-blue-500 to-cyan-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading templates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin" className="text-sm text-indigo-600 hover:text-indigo-800 mb-2 inline-block">
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Email Templates</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your auto-response email templates and view performance metrics
              </p>
            </div>
            <Link
              href="/admin/email-templates/editor/new"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              + New Template
            </Link>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((template) => {
            const templateStats = stats[template.slug]
            return (
              <div
                key={template.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
              >
                {/* Template Header */}
                <div className={`bg-gradient-to-r ${getTemplateColor(template.slug)} p-6 text-white`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{getTemplateIcon(template.slug)}</span>
                      <div>
                        <h3 className="text-xl font-bold">{template.name}</h3>
                        <p className="text-sm opacity-90 mt-1">{template.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleTemplate(template.id, template.is_active)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                        template.is_active
                          ? 'bg-white/20 hover:bg-white/30'
                          : 'bg-red-500 hover:bg-red-600'
                      }`}
                    >
                      {template.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>

                {/* Template Body */}
                <div className="p-6">
                  {/* Subject Line */}
                  <div className="mb-4">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Subject Line
                    </label>
                    <p className="mt-1 text-gray-900">{template.subject_line}</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 font-medium">Total Sent</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {templateStats?.totalSent || 0}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 font-medium">Last Sent</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {templateStats?.lastSent
                          ? new Date(templateStats.lastSent).toLocaleDateString()
                          : 'Never'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/email-templates/editor/${template.id}`}
                      className="flex-1 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-100 transition text-center font-medium"
                    >
                      ✏️ Edit Template
                    </Link>
                    <Link
                      href={`/admin/email-templates/preview/${template.id}`}
                      className="flex-1 bg-gray-50 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-center font-medium"
                    >
                      👁️ Preview
                    </Link>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Slug: <code className="bg-white px-2 py-1 rounded">{template.slug}</code>
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {templates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No email templates found.</p>
            <Link
              href="/admin/email-templates/editor/new"
              className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Create Your First Template
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
