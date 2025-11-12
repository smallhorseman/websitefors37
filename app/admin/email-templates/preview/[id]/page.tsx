export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

type EmailTemplate = {
  id: string
  name: string
  slug: string
  subject: string
  html_content: string
  text_content: string
  category: string
}

async function getTemplate(id: string): Promise<EmailTemplate | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('email_templates')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) return null
    return data
  } catch {
    return null
  }
}

export default async function EmailTemplatePreview({ params }: { params: { id: string } }) {
  const template = await getTemplate(params.id)

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Template Not Found</h1>
          <p className="text-gray-600 mb-4">This template doesn't exist or couldn't be loaded.</p>
          <Link
            href="/admin/email-templates"
            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Back to Templates
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin/email-templates" className="text-sm text-indigo-600 hover:text-indigo-800 mb-2 inline-block">
                ← Back to Templates
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{template.name} - Preview</h1>
              <p className="text-sm text-gray-600 mt-1">Category: {template.category}</p>
            </div>
            <Link
              href={`/admin/email-templates/editor/${template.id}`}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Edit Template
            </Link>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Email Metadata */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Details</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Subject Line:</label>
              <p className="text-gray-900 mt-1">{template.subject}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Slug:</label>
              <p className="text-gray-900 mt-1">
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">{template.slug}</code>
              </p>
            </div>
          </div>
        </div>

        {/* HTML Preview */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
          <div className="bg-gray-50 px-6 py-3 border-b">
            <h2 className="text-lg font-semibold text-gray-900">HTML Preview</h2>
          </div>
          <div className="p-6">
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: template.html_content }} 
            />
          </div>
        </div>

        {/* Text Version */}
        {template.text_content && (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Plain Text Version</h2>
            </div>
            <div className="p-6">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                {template.text_content}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
