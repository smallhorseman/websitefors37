"use client"

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type LayoutBlock = { id: string; type: string; props?: Record<string, any> }

const BUILDER_BLOCK_TYPES = [
  'LogoBlock','HeroBlock','TextBlock','ImageBlock','ButtonBlock','ColumnsBlock','SpacerBlock','SeoFooterBlock','BadgesBlock','SlideshowHeroBlock','TestimonialsBlock','GalleryHighlightsBlock','WidgetEmbedBlock','ServicesGridBlock','StatsBlock','CTABannerBlock','IconFeaturesBlock','ContactFormBlock','NewsletterBlock','FAQBlock','PricingTableBlock','PricingCalculatorBlock'
]

export default function BlockLayoutClient({ path }: { path: string }) {
  const router = useRouter()
  const params = useSearchParams()
  const useDraft = params.get('edit') === '1'

  const [loading, setLoading] = React.useState(true)
  const [blocks, setBlocks] = React.useState<LayoutBlock[]>([])
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string| null>(null)

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/editor/layout?path=${encodeURIComponent(path)}${useDraft ? '&draft=1' : ''}`, { cache: 'no-store' })
        if (res.ok) {
          const json = await res.json()
          setBlocks(Array.isArray(json?.blocks) ? json.blocks : [])
        } else if (res.status === 404) {
          setBlocks([])
        } else {
          setError('Failed to load layout')
        }
      } catch {
        setError('Failed to load layout')
      } finally {
        setLoading(false)
      }
    })()
  }, [path, useDraft])

  function addBlock(type = 'TextBlock') {
    const id = prompt('Enter a unique anchor id (e.g., hero, section-1):') || ''
    if (!id) return
    if (blocks.some(b => b.id === id)) {
      alert('A block with that id already exists.')
      return
    }
    setBlocks(prev => [...prev, { id, type, props: {} }])
  }

  function removeBlock(id: string) {
    if (!confirm('Remove this block from layout?')) return
    setBlocks(prev => prev.filter(b => b.id !== id))
  }

  function move(id: string, dir: -1 | 1) {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id)
      if (idx < 0) return prev
      const ni = idx + dir
      if (ni < 0 || ni >= prev.length) return prev
      const copy = prev.slice()
      const [item] = copy.splice(idx, 1)
      copy.splice(ni, 0, item)
      return copy
    })
  }

  function cloneBlock(id: string) {
    const blk = blocks.find(b => b.id === id)
    if (!blk) return
    const newId = prompt('Enter a unique id for the cloned block:', `${id}-copy`) || ''
    if (!newId) return
    if (blocks.some(b => b.id === newId)) {
      alert('A block with that id already exists.')
      return
    }
    setBlocks(prev => [...prev, { ...blk, id: newId }])
  }

  const [draggedId, setDraggedId] = React.useState<string | null>(null)

  function handleDragStart(e: React.DragEvent, id: string) {
    setDraggedId(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function handleDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault()
    if (!draggedId || draggedId === targetId) return
    setBlocks(prev => {
      const fromIdx = prev.findIndex(b => b.id === draggedId)
      const toIdx = prev.findIndex(b => b.id === targetId)
      if (fromIdx < 0 || toIdx < 0) return prev
      const copy = prev.slice()
      const [item] = copy.splice(fromIdx, 1)
      copy.splice(toIdx, 0, item)
      return copy
    })
    setDraggedId(null)
  }

  function handleDragEnd() {
    setDraggedId(null)
  }

  function updateProps(id: string) {
    const blk = blocks.find(b => b.id === id)
    if (!blk) return
    const curr = JSON.stringify(blk.props || {}, null, 2)
    const next = prompt('Edit JSON props for this block', curr)
    if (!next) return
    try {
      const obj = JSON.parse(next)
      setBlocks(prev => prev.map(b => b.id === id ? { ...b, props: obj } : b))
    } catch (e) {
      alert('Invalid JSON')
    }
  }

  function changeType(id: string, type: string) {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, type } : b))
  }

  async function save(draftOnly = true) {
    setSaving(true)
    setError(null)
    try {
      if (draftOnly) {
        const res = await fetch('/api/editor/draft', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path, block_id: '__layout__', block_type: 'layout', draft_props: { blocks } })
        })
        if (!res.ok) throw new Error('Save draft failed')
      } else {
        // Save and publish
        const res = await fetch('/api/editor/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path, block_id: '__layout__', block_type: 'layout', props: { blocks } })
        })
        if (!res.ok) throw new Error('Save failed')
        const pub = await fetch('/api/editor/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path, block_id: '__layout__' })
        })
        if (!pub.ok) throw new Error('Publish failed')
      }
      router.refresh()
    } catch (e: any) {
      setError(e?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow border">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <div className="font-semibold">Layout for {path}</div>
          <div className="text-xs text-gray-500">Blocks render in this order when a layout is present for the page.</div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => save(true)} disabled={saving} className="px-3 py-1.5 text-sm rounded bg-gray-100 hover:bg-gray-200">Save Draft</button>
          <button onClick={() => save(false)} disabled={saving} className="px-3 py-1.5 text-sm rounded bg-primary-600 text-white hover:bg-primary-700">Publish</button>
        </div>
      </div>
      <div className="p-4">
        {loading ? (
          <div className="text-gray-500">Loading…</div>
        ) : (
          <>
            {blocks.length === 0 && (
              <div className="text-gray-500 text-sm mb-3">No layout yet. Add blocks to start.</div>
            )}
            <ul className="space-y-2">
              {blocks.map((b, idx) => (
                <li 
                  key={b.id} 
                  className={`border rounded p-3 flex items-center justify-between cursor-move ${draggedId === b.id ? 'opacity-50' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, b.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, b.id)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-6">{idx+1}</span>
                    <input value={b.id} readOnly className="text-sm bg-gray-50 border rounded px-2 py-1 w-40" />
                    <select value={b.type} onChange={e => changeType(b.id, e.target.value)} className="text-sm border rounded px-2 py-1">
                      {BUILDER_BLOCK_TYPES.map(t => <option key={t} value={t}>{t.replace(/Block$/, '')}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateProps(b.id)} className="px-2 py-1 text-xs rounded border">Props</button>
                    <button onClick={() => cloneBlock(b.id)} className="px-2 py-1 text-xs rounded border text-blue-600">Clone</button>
                    <button onClick={() => move(b.id, -1)} disabled={idx===0} className="px-2 py-1 text-xs rounded border">Up</button>
                    <button onClick={() => move(b.id, 1)} disabled={idx===blocks.length-1} className="px-2 py-1 text-xs rounded border">Down</button>
                    <button onClick={() => removeBlock(b.id)} className="px-2 py-1 text-xs rounded border text-red-600">Remove</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <label className="text-sm mr-2">Add block:</label>
              <select id="new-type" className="text-sm border rounded px-2 py-1 mr-2">
                {BUILDER_BLOCK_TYPES.map(t => <option key={t} value={t}>{t.replace(/Block$/, '')}</option>)}
              </select>
              <button onClick={() => {
                const el = document.getElementById('new-type') as HTMLSelectElement | null
                const type = el?.value || 'TextBlock'
                addBlock(type)
              }} className="px-3 py-1.5 text-sm rounded bg-gray-100 hover:bg-gray-200">Add</button>
            </div>
            {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
          </>
        )}
      </div>
    </div>
  )
}
