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
  const [lastPublishedSlug, setLastPublishedSlug] = useState<string | null>(null)

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
        .upsert(
          {
            slug: cleanSlug,
            data: { components: newComponents },
          },
          { onConflict: 'slug' }
        )

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

  // Convert builder components to MDX content for content_pages
  const componentsToMDX = (list: any[]): string => {
    const md: string[] = []
    const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()

    list.forEach((c) => {
      switch (c.type) {
        case 'hero': {
          const d = c.data || {}
          if (d.backgroundImage) md.push(`![${d.title || ''}](${d.backgroundImage})`)
          if (d.title) md.push(`# ${d.title}`)
          if (d.subtitle) md.push(`${d.subtitle}`)
          if (d.buttonText && d.buttonLink) md.push(`[${d.buttonText}](${d.buttonLink})`)
          md.push('\n---\n')
          break
        }
        case 'text': {
          const d = c.data || {}
          // Allow raw HTML within MDX for rich formatting
          if (d.content) md.push(String(d.content))
          md.push('')
          break
        }
        case 'image': {
          const d = c.data || {}
          if (d.url) {
            md.push(`![${d.alt || ''}](${d.url})`)
            if (d.caption) md.push(`*${d.caption}*`)
            md.push('')
          }
          break
        }
        case 'button': {
          const d = c.data || {}
          if (d.text && d.link) md.push(`[${d.text}](${d.link})`)
          md.push('')
          break
        }
        case 'columns': {
          const d = c.data || { columns: [] }
          // Render each column sequentially; avoid HTML comments which can break MDX parsing
          ;(d.columns || []).forEach((col: any, i: number) => {
            if (col?.image) md.push(`![Column ${i + 1}](${col.image})`)
            if (col?.content) md.push(String(col.content))
            // Add a visual separator between columns
            md.push('\n')
          })
          md.push('\n')
          break
        }
        case 'spacer': {
          md.push('\n')
          break
        }
        default:
          break
      }
    })

    return md.join('\n')
  }

  const handlePublish = async () => {
    setMessage(null)
    setSaving(true)
    try {
      const cleanSlug = slug
        .toLowerCase()
        .replace(/[^a-z0-9-\s]/g, '')
        .replace(/\s+/g, '-')
        .trim()
      if (!cleanSlug) {
        alert('Please enter a valid URL slug before publishing.')
        return
      }

      // Build MDX content from components
      const mdx = componentsToMDX(components)

      // Derive title and meta from components
      let derivedTitle = cleanSlug.replace(/-/g, ' ')
      const hero = components.find((c) => c.type === 'hero')
      if (hero?.data?.title) derivedTitle = String(hero.data.title)
      const firstText = components.find((c) => c.type === 'text' && c.data?.content)
      const metaDescription = firstText ? firstText.data.content.replace(/<[^>]*>/g, '').slice(0, 160) : ''

      const { error } = await supabase
        .from('content_pages')
        .upsert(
          {
            slug: cleanSlug,
            title: derivedTitle,
            content: mdx,
            meta_description: metaDescription,
            published: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'slug' }
        )

      if (error) throw error

  setMessage({ type: 'success', text: `Published to /${cleanSlug}.` })
  setLastPublishedSlug(cleanSlug)
    } catch (e) {
      console.error('Failed to publish:', e)
      setMessage({ type: 'error', text: 'Failed to publish page. Please check the slug and try again.' })
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
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span>{message.text}</span>
              {message.type === 'success' && lastPublishedSlug && (
                <div className="flex items-center gap-2">
                  <Link href={`/${lastPublishedSlug}`} target="_blank" className="underline text-green-800 hover:text-green-900">
                    View Page
                  </Link>
                  <button
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${lastPublishedSlug}`)}
                    className="px-2 py-1 border rounded text-green-800 hover:bg-green-100"
                    title="Copy public URL"
                  >
                    Copy Link
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        <VisualEditor
          initialComponents={components}
          onSave={handleSave}
        />
        <div className="p-4 flex justify-end gap-2">
          <Link
            href={`/${slug.replace(/[^a-z0-9-\s]/gi, '').toLowerCase().replace(/\s+/g, '-').trim() || ''}`}
            target="_blank"
            className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
            aria-disabled={!slug}
          >
            View /{slug || '…'}
          </Link>
          <button
            onClick={() => handleSave(components)}
            disabled={saving}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Save Draft
          </button>
          <button
            onClick={handlePublish}
            disabled={saving}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Publish to /{slug}
          </button>
        </div>
      </div>
    </div>
  )
}
