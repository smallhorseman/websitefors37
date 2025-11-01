'use client'

import { useState, useEffect } from 'react'
import VisualEditor from '@/components/VisualEditor'
import { supabase } from '@/lib/supabase'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PageBuilderPage() {
  const [components, setComponents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [slug, setSlug] = useState('new-landing-page')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadPageData()
  }, [slug])

  const loadPageData = async () => {
    try {
      const { data, error } = await supabase
        .from('page_configs')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data?.data?.components) {
        setComponents(data.data.components)
      } else {
        setComponents([])
      }
    } catch (e) {
      console.error('Failed to load page:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (newComponents: any[]) => {
    setMessage(null)
    setSaving(true)
    try {
      const cleanSlug = slug
        .toLowerCase()
        .replace(/[^a-z0-9-\s]/g, '')
        .replace(/\s+/g, '-')
        .trim()
      if (!cleanSlug) {
        alert('Please enter a valid URL slug before saving.')
        return
      }
      const { error } = await supabase
        .from('page_configs')
        .upsert({
          slug: cleanSlug,
          data: { components: newComponents }
        })

      if (error) throw error
      setMessage({ type: 'success', text: 'Page saved successfully.' })
      setComponents(newComponents)
    } catch (e) {
      console.error('Failed to save:', e)
      setMessage({ type: 'error', text: 'Failed to save page. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Admin
        </Link>
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-xl font-bold">Visual Page Builder</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">URL Slug:</span>
            <div className="flex items-center gap-1">
              <span className="text-gray-500">/</span>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="border rounded px-2 py-1 text-sm w-56"
                placeholder="new-landing-page"
                aria-label="Page URL slug"
              />
            </div>
          </div>
        </div>
        <div className="w-32" /> {/* Spacer for centering */}
      </div>

      {/* Editor Container */}
      <div className="flex-1 relative">
        {message && (
          <div className={`m-4 rounded border px-3 py-2 text-sm ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            {message.text}
          </div>
        )}
        <VisualEditor
          initialComponents={components}
          onSave={handleSave}
        />
      </div>
    </div>
  )
}
