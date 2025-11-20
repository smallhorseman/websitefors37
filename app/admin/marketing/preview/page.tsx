'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Eye, Monitor, Smartphone, Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EmailPreviewPage() {
  const searchParams = useSearchParams()
  const templateId = searchParams.get('templateId')
  
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [template, setTemplate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [testData, setTestData] = useState({
    firstName: 'Sarah',
    lastName: 'Johnson',
    sessionType: 'Wedding Photography',
    sessionDate: 'December 15, 2025',
    sessionTime: '2:00 PM',
    location: 'Studio37',
    galleryLink: 'https://www.studio37.cc/gallery/sample',
    expiryDays: '30'
  })
  

  useEffect(() => {
    if (templateId) {
      loadTemplate()
    }
  }, [templateId])

  async function loadTemplate() {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', templateId)
      .single()

    if (data) {
      setTemplate(data)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading preview...</div>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Mail className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Template not found</h1>
          <Link href="/admin/marketing/templates" className="text-amber-600 hover:underline">
            ← Back to templates
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/marketing/templates"
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{template.name}</h1>
                <p className="text-sm text-gray-500">Subject: {template.subject}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                    viewMode === 'desktop'
                      ? 'bg-white shadow text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  Desktop
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                    viewMode === 'mobile'
                      ? 'bg-white shadow text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  Mobile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Test Data Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Test Data
              </h3>
              <div className="space-y-3">
                {Object.entries(testData).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {key}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setTestData({ ...testData, [key]: e.target.value })}
                      className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Modify these values to see how the email renders with different data
              </p>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-gray-50 border-b px-4 py-3">
                <div className="text-sm text-gray-600">
                  <strong>From:</strong> Studio37 Photography &lt;contact@studio37.cc&gt;<br/>
                  <strong>To:</strong> {testData.firstName} {testData.lastName} &lt;sarah.j@example.com&gt;<br/>
                  <strong>Subject:</strong> {template.subject}
                </div>
              </div>
              
              <div className="p-4 flex justify-center bg-gray-100">
                <div
                  className={`bg-white shadow-lg transition-all duration-300 ${
                    viewMode === 'mobile' ? 'w-[375px]' : 'w-full max-w-[600px]'
                  }`}
                  style={{
                    height: viewMode === 'mobile' ? '667px' : 'auto',
                    minHeight: viewMode === 'desktop' ? '500px' : undefined
                  }}
                >
                  <iframe
                    key={JSON.stringify(testData)} // Force reload when test data changes
                    src={`/api/marketing/preview?templateId=${templateId}`}
                    className="w-full h-full border-0"
                    title="Email Preview"
                  />
                </div>
              </div>
              
              <div className="bg-gray-50 border-t px-4 py-3 text-center text-xs text-gray-500">
                Preview shown with test data • Actual emails will use real recipient data
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
