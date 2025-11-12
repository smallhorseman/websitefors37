export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// Fixed: Direct Supabase query instead of fetch for server component

type EmailTemplate = {
  id: string
  name?: string
  subject?: string
  html_content?: string
  text_content?: string
  updated_at?: string
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

export default async function EmailTemplateEditor({ params }: { params: { id: string } }) {
  const template = await getTemplate(params.id)

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Email Template Editor</h1>
        <Link href="/admin/email-templates" className="text-sm text-blue-600 hover:underline">
          Back to Templates
        </Link>
      </div>

      {!template && (
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
          <p className="font-medium">Template not found</p>
          <p className="text-sm">We couldn't load this template. It may not exist yet or the API endpoint is unavailable.</p>
        </div>
      )}

      {template && (
        <div className="space-y-6">
          <section className="rounded-md border bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-medium">Details</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <div className="text-sm text-gray-500">ID</div>
                <div className="font-mono text-sm">{template.id}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Name</div>
                <div>{template.name || '—'}</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-sm text-gray-500">Subject</div>
                <div>{template.subject || '—'}</div>
              </div>
            </div>
          </section>

          <section className="rounded-md border bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-medium">Preview</h2>
            <div className="rounded border bg-white p-3">
              {/* Basic preview; in the future, wire to a rich editor */}
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: template.html_content || '<p>—</p>' }} />
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
