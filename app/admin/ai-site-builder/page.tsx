'use client'

import React, { useState } from 'react'
import VisualEditor from '@/components/VisualEditor'
import { Loader2, Sparkles, RefreshCw, AlertCircle } from 'lucide-react'

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

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
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
      }
    } catch (e: any) {
      setError(e?.message || 'Unexpected error')
    } finally {
      setLoading(false)
    }
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
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Generated Metadata</h2>
            <div className="text-sm space-y-1">
              <p><span className="font-medium">Title:</span> {data.title}</p>
              <p><span className="font-medium">Suggested Slug:</span> /{data.suggestedSlug}</p>
              {data.notes && <p><span className="font-medium">Notes:</span> {data.notes}</p>}
              <p><span className="font-medium">Components:</span> {data.components.length}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Page Layout (Editable)</h2>
            <VisualEditor
              initialComponents={data.components as any}
              onSave={() => { /* future persistence hook */ }}
              onChange={(components)=>setData(d=>d ? { ...d, components } : d)}
              slug={data.suggestedSlug}
            />
          </div>
        </div>
      )}
    </div>
  )
}
