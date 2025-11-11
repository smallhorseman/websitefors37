'use client'

import React, { useState } from 'react'
import VisualEditor from '@/components/VisualEditor'
import { Loader2, Sparkles, RefreshCw, AlertCircle, Save, CheckCircle, Edit2, Eye } from 'lucide-react'

interface GeneratedPage {
  title: string
  suggestedSlug: string
  notes?: string
  components: any[]
}

export default function AISiteBuilderPage() {
  const [prompt, setPrompt] = useState('Landing page promoting portrait & brand photography packages for local businesses')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<GeneratedPage | null>(null)
  const [style, setStyle] = useState('friendly, premium, trustworthy')
  const [wordCount, setWordCount] = useState(650)
  
  // New state for slug customization and publishing
  const [customSlug, setCustomSlug] = useState('')
  const [isEditingSlug, setIsEditingSlug] = useState(false)
  const [pageTitle, setPageTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    setPublishSuccess(false)
    try {
      const res = await fetch('/api/site/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style, wordCount })
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Generation failed')
      } else {
        setData(json)
        setCustomSlug(json.suggestedSlug)
        setPageTitle(json.title)
        setMetaDescription(json.notes || '')
        setIsEditingSlug(false)
      }
    } catch (e: any) {
      setError(e?.message || 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async (published: boolean) => {
    if (!data || !customSlug) {
      setError('Missing page data or slug')
      return
    }

    setPublishing(true)
    setError(null)
    setPublishSuccess(false)

    try {
      // Convert components to MDX format
      const mdxContent = generateMDXFromComponents(data.components)

      const res = await fetch('/api/admin/pages/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: customSlug,
          title: pageTitle,
          content: mdxContent,
          meta_description: metaDescription,
          published,
        })
      })

      const json = await res.json()
      
      if (!res.ok) {
        setError(json.error || 'Failed to publish page')
      } else {
        setPublishSuccess(true)
        setTimeout(() => setPublishSuccess(false), 5000)
      }
    } catch (e: any) {
      setError(e?.message || 'Publish error')
    } finally {
      setPublishing(false)
    }
  }

  const generateMDXFromComponents = (components: any[]): string => {
    // Convert visual editor components to MDX format
    return components.map(comp => {
      const componentName = comp.type.charAt(0).toUpperCase() + comp.type.slice(1)
      const props = Object.entries(comp.data || {})
        .map(([key, value]) => {
          if (typeof value === 'string') {
            return `${key}="${value.replace(/"/g, '\\"')}"`
          } else if (typeof value === 'number' || typeof value === 'boolean') {
            return `${key}={${value}}`
          } else if (typeof value === 'object') {
            return `${key}={${JSON.stringify(value)}}`
          }
          return ''
        })
        .filter(Boolean)
        .join(' ')
      
      return `<${componentName}Block ${props} />`
    }).join('\n\n')
  }

  const normalizeSlug = (slug: string): string => {
    return slug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleSlugChange = (value: string) => {
    setCustomSlug(normalizeSlug(value))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-xl font-semibold flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary-600"/> AI Site Builder</h1>
        <div className="flex gap-2">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 py-2 rounded bg-primary-600 text-white flex items-center gap-2 shadow hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin"/> : <RefreshCw className="h-4 w-4"/>}
            {loading ? 'Generating...' : 'Generate Page'}
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="prompt">Prompt / Brief</label>
          <textarea
            id="prompt"
            className="w-full border rounded px-3 py-2 text-sm"
            rows={4}
            value={prompt}
            onChange={e=>setPrompt(e.target.value)}
            placeholder="Describe the purpose, audience, offers, tone, and conversion goal..."
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="style">Writing Style/Tone</label>
            <input
              id="style"
              className="w-full border rounded px-3 py-2 text-sm"
              value={style}
              onChange={e=>setStyle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="wordCount">Target Word Count</label>
            <input
              id="wordCount"
              type="number"
              className="w-full border rounded px-3 py-2 text-sm"
              value={wordCount}
              onChange={e=>setWordCount(Number(e.target.value)||600)}
              min={300}
              max={1500}
            />
          </div>
          <div className="flex flex-col justify-end text-xs text-gray-600">
            <p>Guide: Include audience, primary offer, differentiation, desired actions, location context.</p>
          </div>
        </div>
        {error && (
          <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded text-sm">
            <AlertCircle className="h-4 w-4"/> {error}
          </div>
        )}
      </div>

      {data && (
        <div className="space-y-4">
          {/* Page Configuration Section */}
          <div className="bg-white p-4 rounded shadow space-y-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-primary-600" />
              Page Configuration
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Page Title */}
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="pageTitle">
                  Page Title
                </label>
                <input
                  id="pageTitle"
                  type="text"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  placeholder="Professional Photography in Pinehurst, TX"
                />
              </div>

              {/* URL Slug */}
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="customSlug">
                  URL Slug
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center border rounded overflow-hidden">
                    <span className="px-3 py-2 bg-gray-50 text-gray-600 text-sm border-r">/</span>
                    <input
                      id="customSlug"
                      type="text"
                      className="flex-1 px-3 py-2 text-sm border-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={customSlug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder="photography-services"
                      disabled={!isEditingSlug}
                    />
                  </div>
                  <button
                    onClick={() => setIsEditingSlug(!isEditingSlug)}
                    className="px-3 py-2 text-sm border rounded hover:bg-gray-50"
                    title={isEditingSlug ? 'Lock slug' : 'Edit slug'}
                  >
                    {isEditingSlug ? '🔓' : '🔒'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This will be the page URL: <span className="font-mono">/{customSlug}</span>
                </p>
              </div>

              {/* Meta Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1" htmlFor="metaDescription">
                  Meta Description (SEO)
                </label>
                <textarea
                  id="metaDescription"
                  className="w-full border rounded px-3 py-2 text-sm"
                  rows={2}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="A brief description of this page for search engines (150-160 characters)"
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {metaDescription.length}/160 characters
                </p>
              </div>
            </div>

            {/* Publish Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-gray-600">
                <p><strong>Components:</strong> {data.components.length}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePublish(false)}
                  disabled={publishing || !customSlug}
                  className="px-4 py-2 rounded border border-gray-300 text-gray-700 flex items-center gap-2 hover:bg-gray-50 disabled:opacity-50"
                >
                  {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save as Draft
                </button>
                <button
                  onClick={() => handlePublish(true)}
                  disabled={publishing || !customSlug}
                  className="px-4 py-2 rounded bg-green-600 text-white flex items-center gap-2 hover:bg-green-700 disabled:opacity-50"
                >
                  {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
                  Publish Live
                </button>
              </div>
            </div>

            {publishSuccess && (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded text-sm">
                <CheckCircle className="h-4 w-4" /> Page published successfully! View it at <a href={`/${customSlug}`} target="_blank" rel="noopener noreferrer" className="underline font-medium">/{customSlug}</a>
              </div>
            )}
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Page Layout (Editable)</h2>
            <VisualEditor
              initialComponents={data.components as any}
              onSave={() => { /* future persistence hook */ }}
              onChange={(components)=>setData(d=>d ? { ...d, components } : d)}
              slug={customSlug}
            />
          </div>
        </div>
      )}
    </div>
  )
}
