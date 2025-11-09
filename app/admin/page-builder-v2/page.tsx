'use client'

import { useState, useEffect } from 'react'
import VisualEditorV2, { PageComponent } from '@/components/VisualEditorV2'
import { supabase } from '@/lib/supabase'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function PageBuilderV2Page() {
  const [components, setComponents] = useState<PageComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const searchParams = useSearchParams()
  const [slug, setSlug] = useState('test-page-v2')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const initialSlug = searchParams?.get('slug')
    if (initialSlug) {
      setSlug(initialSlug)
    }
  }, [searchParams])

  useEffect(() => {
    loadPageData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleSave = async (newComponents: PageComponent[]) => {
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
        .upsert(
          {
            slug: cleanSlug,
            data: { components: newComponents },
          },
          { onConflict: 'slug' }
        )

      if (error) throw error
      
      setMessage({ type: 'success', text: 'Page saved successfully!' })
      setComponents(newComponents)
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000)
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
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Admin
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Slug:</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="border rounded px-2 py-1 text-sm w-48"
              placeholder="page-slug"
            />
          </div>
          
          {message && (
            <div
              className={`px-4 py-2 rounded text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
        
        <div className="w-32" />
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <VisualEditorV2
          initialComponents={components}
          onSave={handleSave}
          onChange={setComponents}
        />
      </div>
    </div>
  )
}
