'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function NewEmailTemplatePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState('general')
  const [htmlContent, setHtmlContent] = useState('<p>—</p>')
  const [textContent, setTextContent] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onNameChange = (v: string) => {
    setName(v)
    if (!slug) setSlug(slugify(v))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/email-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug: slug || slugify(name),
          subject,
          category,
          html_content: htmlContent,
          text_content: textContent,
          is_active: isActive,
          variables: [],
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to create template')
      // redirect to editor for the new template
      router.push(`/admin/email-templates/editor/${data.template.id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">New Email Template</h1>
        <Link href="/admin/email-templates" className="text-sm text-blue-600 hover:underline">
          Back to Templates
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <input
              className="mt-1 w-full rounded border px-3 py-2"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Welcome Email"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Slug</label>
            <input
              className="mt-1 w-full rounded border px-3 py-2 font-mono"
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              placeholder="welcome-email"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm text-gray-600">Subject</label>
            <input
              className="mt-1 w-full rounded border px-3 py-2"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Thanks for contacting Studio37!"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Category</label>
            <select
              className="mt-1 w-full rounded border px-3 py-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="general">general</option>
              <option value="onboarding">onboarding</option>
              <option value="reminders">reminders</option>
              <option value="delivery">delivery</option>
              <option value="newsletter">newsletter</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">Active</label>
            <div className="mt-2">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                Enable this template
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600">HTML Content</label>
          <textarea
            className="mt-1 w-full rounded border px-3 py-2 font-mono"
            rows={10}
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Text Content (optional)</label>
          <textarea
            className="mt-1 w-full rounded border px-3 py-2 font-mono"
            rows={6}
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Creating…' : 'Create Template'}
          </button>
        </div>
      </form>
    </div>
  )
}
