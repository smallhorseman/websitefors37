'use client'

import React, { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Loader2, Eye, EyeOff, Save, AlertTriangle, RotateCcw, FileEdit, Globe } from 'lucide-react'
import VisualEditor from '@/components/VisualEditor'
import type { PageComponent } from '@/types/page-builder'

interface ContentPage {
  id: number
  slug: string
  title: string
  content: string
  published: boolean
  updated_at: string
}

// Parse MDX to extract components (reuse from page-builder)
function mdxToComponents(mdx: string): PageComponent[] {
  const components: PageComponent[] = []
  const componentRegex = /<(\w+)\s+([^>]*)\/>/g
  const blockRegex = /<(\w+)\s+([^>]*)>(.*?)<\/\1>/gs
  
  let match
  while ((match = componentRegex.exec(mdx)) !== null) {
    const [, type, attrsStr] = match
    const attrs = parseAttrs(attrsStr)
    components.push({
      id: `component-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: type.toLowerCase() as any,
      data: attrs,
    })
  }
  
  while ((match = blockRegex.exec(mdx)) !== null) {
    const [, type, attrsStr, content] = match
    const attrs = parseAttrs(attrsStr)
    components.push({
      id: `component-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: type.toLowerCase() as any,
      data: { ...attrs, content: content?.trim() },
    })
  }
  
  return components
}

function parseAttrs(str: string): Record<string, any> {
  const attrs: Record<string, any> = {}
  const regex = /(\w+)=(?:{([^}]*)}|"([^"]*)")/g
  let m
  while ((m = regex.exec(str)) !== null) {
    const key = m[1]
    const jsonValue = m[2]
    const stringValue = m[3]
    if (jsonValue !== undefined) {
      try {
        attrs[key] = JSON.parse(jsonValue)
      } catch {
        attrs[key] = jsonValue
      }
    } else {
      attrs[key] = stringValue
    }
  }
  return attrs
}

// Convert components back to MDX
function componentsToMdx(components: PageComponent[]): string {
  let mdx = ''
  
  for (const comp of components) {
    const { type, data } = comp
    const attrs = Object.entries(data)
      .map(([key, val]) => {
        if (typeof val === 'object') {
          const json = JSON.stringify(val).replace(/"/g, '\\"')
          return `${key}={${json}}`
        }
        return `${key}="${val}"`
      })
      .join(' ')
    
    if (data.content) {
      mdx += `<${type} ${attrs}>\n${data.content}\n</${type}>\n\n`
    } else {
      mdx += `<${type} ${attrs} />\n\n`
    }
  }
  
  return mdx
}

export default function LiveEditorPage() {
  const [pages, setPages] = useState<ContentPage[]>([])
  const [selectedSlug, setSelectedSlug] = useState<string>('')
  const [components, setComponents] = useState<PageComponent[]>([])
  const [originalComponents, setOriginalComponents] = useState<PageComponent[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    loadPages()
  }, [])

  useEffect(() => {
    if (selectedSlug) {
      loadPageContent(selectedSlug)
    }
  }, [selectedSlug])

  useEffect(() => {
    // Detect changes
    const changed = JSON.stringify(components) !== JSON.stringify(originalComponents)
    setHasChanges(changed)
  }, [components, originalComponents])

  const loadPages = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('content_pages')
        .select('id, slug, title, published, updated_at')
        .eq('published', true)
        .order('slug', { ascending: true })

      if (error) throw error
      setPages(data || [])
      if (data && data.length > 0 && !selectedSlug) {
        setSelectedSlug(data[0].slug)
      }
    } catch (e) {
      console.error('Load pages error:', e)
      setMessage({ type: 'error', text: 'Failed to load pages' })
    } finally {
      setLoading(false)
    }
  }

  const loadPageContent = async (slug: string) => {
    setLoading(true)
    setMessage(null)
    try {
      const { data, error } = await supabase
        .from('content_pages')
        .select('content')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle()

      if (error) throw error
      if (!data) {
        setMessage({ type: 'warning', text: 'Page not found' })
        setComponents([])
        setOriginalComponents([])
        return
      }

      const parsed = mdxToComponents(data.content || '')
      setComponents(parsed)
      setOriginalComponents(parsed)
    } catch (e) {
      console.error('Load page content error:', e)
      setMessage({ type: 'error', text: 'Failed to load page content' })
    } finally {
      setLoading(false)
    }
  }

  const saveChanges = async () => {
    if (!selectedSlug) return
    setSaving(true)
    setMessage(null)

    try {
      // Create backup before saving
      const { data: currentData, error: fetchError } = await supabase
        .from('content_pages')
        .select('*')
        .eq('slug', selectedSlug)
        .eq('published', true)
        .maybeSingle()

      if (fetchError) throw fetchError
      if (!currentData) throw new Error('Page not found')

      // Store backup in localStorage for quick revert
      localStorage.setItem(
        `backup_${selectedSlug}_${Date.now()}`,
        JSON.stringify({
          slug: selectedSlug,
          content: currentData.content,
          timestamp: new Date().toISOString(),
        })
      )

      // Convert components to MDX
      const newMdx = componentsToMdx(components)

      // Save to database
      const { error: updateError } = await supabase
        .from('content_pages')
        .update({ content: newMdx })
        .eq('slug', selectedSlug)
        .eq('published', true)

      if (updateError) throw updateError

      setOriginalComponents([...components])
      setMessage({ type: 'success', text: 'Changes saved successfully!' })

      // Trigger revalidation
      try {
        await fetch('/api/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: selectedSlug }),
        })
      } catch (revalError) {
        console.warn('Revalidation failed:', revalError)
      }
    } catch (e: any) {
      console.error('Save error:', e)
      setMessage({ type: 'error', text: e?.message || 'Failed to save changes' })
    } finally {
      setSaving(false)
    }
  }

  const revertChanges = () => {
    setComponents([...originalComponents])
    setMessage({ type: 'success', text: 'Changes reverted' })
  }

  const restoreFromBackup = () => {
    const backups = Object.keys(localStorage)
      .filter(key => key.startsWith(`backup_${selectedSlug}_`))
      .map(key => {
        const data = JSON.parse(localStorage.getItem(key) || '{}')
        return { key, ...data }
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    if (backups.length === 0) {
      setMessage({ type: 'warning', text: 'No backups found for this page' })
      return
    }

    const latest = backups[0]
    const parsed = mdxToComponents(latest.content)
    setComponents(parsed)
    setMessage({
      type: 'success',
      text: `Restored backup from ${new Date(latest.timestamp).toLocaleString()}`,
    })
  }

  const selectedPage = pages.find(p => p.slug === selectedSlug)

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary-600" />
            Live Page Editor
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Edit published pages directly (changes are reflected immediately after save)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
            className="border rounded px-4 py-2 bg-white shadow-sm focus:ring-2 focus:ring-primary-500"
            disabled={loading}
          >
            <option value="">Select a page...</option>
            {pages.map(page => (
              <option key={page.id} value={page.slug}>
                /{page.slug} - {page.title}
              </option>
            ))}
          </select>

          {hasChanges && (
            <button
              onClick={revertChanges}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2"
              title="Revert unsaved changes"
            >
              <RotateCcw className="h-4 w-4" />
              Revert
            </button>
          )}

          <button
            onClick={restoreFromBackup}
            className="px-4 py-2 border border-amber-300 bg-amber-50 text-amber-700 rounded hover:bg-amber-100 flex items-center gap-2"
            title="Restore from automatic backup"
          >
            <RotateCcw className="h-4 w-4" />
            Restore Backup
          </button>

          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center gap-2"
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPreview ? 'Hide' : 'Show'} Preview
          </button>

          <button
            onClick={saveChanges}
            disabled={!hasChanges || saving}
            className="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Warning Banner */}
      {selectedSlug && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Warning:</strong> You are editing a live published page. Changes will be visible to users after saving and revalidation.
            {hasChanges && ' You have unsaved changes.'}
          </p>
        </div>
      )}

      {/* Message */}
      {message && (
        <div
          className={`mx-6 mt-4 rounded border px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : message.type === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : !selectedSlug ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <FileEdit className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>Select a page to start editing</p>
            </div>
          </div>
        ) : (
          <>
            {/* Visual Editor */}
            <div className={showPreview ? 'flex-1 border-r' : 'flex-1'}>
              <VisualEditor
                components={components}
                onChange={setComponents}
                slug={selectedSlug}
                title={selectedPage?.title || ''}
              />
            </div>

            {/* Live Preview */}
            {showPreview && (
              <div className="w-1/2 bg-white flex flex-col">
                <div className="px-4 py-3 border-b bg-gray-50">
                  <h3 className="font-medium text-sm">Live Preview</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Preview shows how the page will look (refresh after save to see latest)
                  </p>
                </div>
                <div className="flex-1 overflow-auto">
                  <iframe
                    src={`/${selectedSlug}`}
                    className="w-full h-full border-0"
                    title="Page Preview"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
