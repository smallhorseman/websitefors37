'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { getPageConfig, upsertPageConfig } from '@/lib/pageConfig'
import { Loader2, Save, Eye, Image as ImageIcon } from 'lucide-react'
import ImageUploader from '@/components/ImageUploader'

type Field = { key: string; label: string; type: 'text' | 'textarea' | 'image' }

// Define common editable fields per page slug
const FIELDS: Record<string, Field[]> = {
  home: [
    { key: 'hero_title', label: 'Hero Title', type: 'text' },
    { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'textarea' },
    { key: 'hero_image', label: 'Hero Background Image', type: 'image' },
  ],
  services: [
    { key: 'intro_title', label: 'Intro Title', type: 'text' },
    { key: 'intro_text', label: 'Intro Text', type: 'textarea' },
  ],
  contact: [
    { key: 'intro_title', label: 'Intro Title', type: 'text' },
    { key: 'intro_text', label: 'Intro Text', type: 'textarea' },
  ],
}

export default function SiteEditorPage() {
  const [slug, setSlug] = useState<string>('home')
  const [data, setData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fields = useMemo(() => FIELDS[slug] || [], [slug])

  const load = async () => {
    setLoading(true)
    const cfg = await getPageConfig(slug)
    setData(cfg?.data || {})
    setLoading(false)
  }

  useEffect(() => { load() }, [slug])

  const save = async () => {
    setSaving(true)
    await upsertPageConfig(slug, data)
    setSaving(false)
  }

  return (
    <div className="p-6">
      {/* Sticky header for page select and Save button */}
      <div className="sticky top-0 z-30 bg-gray-50 pb-2 mb-4 flex items-center justify-between" style={{paddingTop: '1rem'}}>
        <h1 className="text-xl font-semibold">Site Editor</h1>
        <div className="flex gap-2 items-center">
          <label htmlFor="page-slug" className="sr-only">Select page to edit</label>
          <select
            id="page-slug"
            aria-label="Select page to edit"
            className="border rounded px-3 py-2 bg-white shadow focus:ring-2 focus:ring-primary-500"
            value={slug}
            onChange={(e)=>setSlug(e.target.value)}
            style={{ minWidth: 120 }}
          >
            <option value="home">Home</option>
            <option value="services">Services</option>
            <option value="contact">Contact</option>
          </select>
          <button onClick={save} disabled={saving} className="btn-primary px-4 py-2 flex items-center gap-2 shadow">
            {saving ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4"/>}
            Save
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-600 flex items-center"><Loader2 className="h-4 w-4 animate-spin mr-2"/> Loading…</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-medium mb-4">Fields</h2>
            <div className="space-y-4">
              {fields.map(f => {
                const id = `field-${slug}-${f.key}`
                return (
                  <div key={f.key}>
                    <label htmlFor={id} className="block text-sm text-gray-700 mb-1">{f.label}</label>
                    {f.type === 'text' && (
                      <input
                        id={id}
                        className="w-full border rounded px-3 py-2"
                        value={data[f.key] || ''}
                        onChange={e=>setData({...data, [f.key]: e.target.value})}
                        placeholder={f.label}
                      />
                    )}
                    {f.type === 'textarea' && (
                      <textarea
                        id={id}
                        className="w-full border rounded px-3 py-2"
                        rows={4}
                        value={data[f.key] || ''}
                        onChange={e=>setData({...data, [f.key]: e.target.value})}
                        placeholder={f.label}
                      />
                    )}
                    {f.type === 'image' && (
                      <div className="space-y-2" aria-labelledby={id}>
                        <ImageUploader onImageUrl={(url)=>setData({...data, [f.key]: url})} />
                        {data[f.key] && (
                          <img src={data[f.key]} alt="Preview" className="h-32 w-full object-cover rounded" />
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-medium mb-4 flex items-center gap-2"><Eye className="h-4 w-4"/> Live Preview</h2>
            {slug === 'home' && (
              <div className="border rounded overflow-hidden">
                <div className="relative h-48">
                  {data.hero_image ? (
                    <img src={data.hero_image} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                      <ImageIcon className="h-10 w-10"/>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-2xl font-bold">{data.hero_title || 'Your Hero Title'}</div>
                    <div className="text-sm opacity-90">{data.hero_subtitle || 'Subtitle goes here'}</div>
                  </div>
                </div>
              </div>
            )}
            {slug !== 'home' && (
              <div className="text-gray-600">Preview coming soon for this page.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
