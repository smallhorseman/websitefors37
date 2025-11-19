"use client"

import React, { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function TextInput({ label, value, onChange, placeholder }: any) {
  return (
    <label className="block mb-3">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <input
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        value={value || ''}
        onChange={(e)=>onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  )
}

function TextArea({ label, value, onChange, placeholder }: any) {
  return (
    <label className="block mb-3">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <textarea
        className="w-full rounded-md border border-gray-300 px-3 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary-500"
        value={value || ''}
        onChange={(e)=>onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  )
}

function NumberInput({ label, value, onChange, min, max, step = 1 }: any) {
  return (
    <label className="block mb-3">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <input
        type="number"
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        value={value ?? ''}
        onChange={(e)=>onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
      />
    </label>
  )
}

export default function EditorFormClient() {
  const params = useSearchParams()
  const router = useRouter()

  const block = params.get('block') || 'HeroBlock'
  const id = params.get('id') || 'auto'
  const path = params.get('path') || '/' // allow deep links to specify path

  // Basic per-block state
  const [hero, setHero] = useState({
    title: '',
    subtitle: '',
    buttonText: '',
    buttonLink: '',
    backgroundImage: '',
    alignment: 'center',
    overlay: 60,
  })

  const [calc, setCalc] = useState({
    category: 'solo',
    minutes: 60,
    people: 1,
    showBookCta: true,
  })

  const [textBlock, setTextBlock] = useState({
    html: '',
    alignment: 'left',
    size: 'md',
    animation: 'none',
  })

  const [imageBlock, setImageBlock] = useState({
    url: '',
    alt: '',
    caption: '',
    width: 'full',
    link: '',
    animation: 'none',
  })

  const [faqBlock, setFaqBlock] = useState({
    heading: '',
    itemsJson: '[]',
    columns: 1,
    animation: 'fade-in',
  })

  const isHero = block === 'HeroBlock'
  const isCalc = block === 'PricingCalculatorBlock'
  const isText = block === 'TextBlock'
  const isImage = block === 'ImageBlock'
  const isFaq = block === 'FAQBlock'

  const payload = useMemo(() => {
    if (isHero) return hero
    if (isCalc) return calc
    if (isText) return {
      contentB64: typeof window !== 'undefined' ? btoa(unescape(encodeURIComponent(textBlock.html || ''))) : '',
      alignment: textBlock.alignment,
      size: textBlock.size,
      animation: textBlock.animation,
    }
    if (isImage) return { ...imageBlock }
    if (isFaq) {
      let safeJson = '[]'
      try { JSON.parse(faqBlock.itemsJson || '[]'); safeJson = faqBlock.itemsJson || '[]' } catch {}
      const itemsB64 = typeof window !== 'undefined' ? btoa(unescape(encodeURIComponent(safeJson))) : ''
      return { heading: faqBlock.heading, itemsB64, columns: faqBlock.columns, animation: faqBlock.animation }
    }
    return {}
  }, [isHero, isCalc, isText, isImage, isFaq, hero, calc, textBlock, imageBlock, faqBlock])

  async function save() {
    const res = await fetch('/api/editor/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, block, id, props: payload }),
    })
    if (!res.ok) {
      const msg = await res.json().catch(()=>({error:'Error'}))
      alert(`Save failed: ${msg.error || res.statusText}`)
      return
    }
    // Return to page with overlay
    router.push(`${path}?edit=1`)
  }

  async function saveDraft() {
    const res = await fetch('/api/editor/draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, block, id, props: payload }),
    })
    if (!res.ok) {
      const msg = await res.json().catch(()=>({error:'Error'}))
      alert(`Draft save failed: ${msg.error || res.statusText}`)
      return
    }
    alert('Draft saved')
  }

  async function publish() {
    const res = await fetch('/api/editor/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, id }),
    })
    if (!res.ok) {
      const msg = await res.json().catch(()=>({error:'Error'}))
      alert(`Publish failed: ${msg.error || res.statusText}`)
      return
    }
    router.push(`${path}?edit=1`)
  }

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="mb-4">
        <div className="text-sm text-gray-500">Editing</div>
        <div className="text-lg font-semibold">{block}{id ? ` · ${id}` : ''}</div>
        <div className="text-xs text-gray-500 mt-1">Path: {path}</div>
        <div className="mt-2">
          <a href={`/admin/editor/layout?path=${encodeURIComponent(path)}${(typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('edit')==='1') ? '&edit=1' : ''}`} className="text-sm text-primary-700 underline">Open layout editor</a>
        </div>
      </div>

      {isHero && (
        <div className="grid md:grid-cols-2 gap-4">
          <TextInput label="Title (HTML ok)" value={hero.title} onChange={(v:any)=>setHero({...hero, title: v})} />
          <TextArea label="Subtitle (HTML ok)" value={hero.subtitle} onChange={(v:any)=>setHero({...hero, subtitle: v})} />
          <TextInput label="Button Text" value={hero.buttonText} onChange={(v:any)=>setHero({...hero, buttonText: v})} />
          <TextInput label="Button Link" value={hero.buttonLink} onChange={(v:any)=>setHero({...hero, buttonLink: v})} />
          <TextInput label="Background Image URL" value={hero.backgroundImage} onChange={(v:any)=>setHero({...hero, backgroundImage: v})} />
          <TextInput label="Alignment (left|center|right)" value={hero.alignment} onChange={(v:any)=>setHero({...hero, alignment: v})} />
          <NumberInput label="Overlay (0-100)" value={hero.overlay} onChange={(v:any)=>setHero({...hero, overlay: v})} min={0} max={100} />
        </div>
      )}

      {isCalc && (
        <div className="grid md:grid-cols-2 gap-4">
          <TextInput label="Category (solo|couple|family)" value={calc.category} onChange={(v:any)=>setCalc({...calc, category: v})} />
          <NumberInput label="Minutes" value={calc.minutes} onChange={(v:any)=>setCalc({...calc, minutes: v})} min={15} max={300} step={15} />
          <NumberInput label="People" value={calc.people} onChange={(v:any)=>setCalc({...calc, people: v})} min={1} max={50} />
          <label className="flex items-center gap-2 mt-2">
            <input type="checkbox" checked={calc.showBookCta} onChange={(e)=>setCalc({...calc, showBookCta: e.target.checked})} />
            <span className="text-sm text-gray-700">Show Book CTA</span>
          </label>
        </div>
      )}

      {isText && (
        <div className="grid gap-4">
          <TextArea label="HTML Content" value={textBlock.html} onChange={(v:any)=>setTextBlock({...textBlock, html: v})} placeholder="Enter HTML content; will be base64-encoded." />
          <div className="grid md:grid-cols-3 gap-3">
            <TextInput label="Alignment (left|center|right)" value={textBlock.alignment} onChange={(v:any)=>setTextBlock({...textBlock, alignment: v})} />
            <TextInput label="Size (sm|md|lg|xl)" value={textBlock.size} onChange={(v:any)=>setTextBlock({...textBlock, size: v})} />
            <TextInput label="Animation (none|fade-in|slide-up|zoom)" value={textBlock.animation} onChange={(v:any)=>setTextBlock({...textBlock, animation: v})} />
          </div>
          <div className="text-xs text-gray-500 -mt-2">Tip: Paste simple HTML; it will be stored as base64 in contentB64.</div>
        </div>
      )}

      {isImage && (
        <div className="grid md:grid-cols-2 gap-4">
          <TextInput label="Image URL" value={imageBlock.url} onChange={(v:any)=>setImageBlock({...imageBlock, url: v})} placeholder="https://..." />
          <TextInput label="Alt text" value={imageBlock.alt} onChange={(v:any)=>setImageBlock({...imageBlock, alt: v})} placeholder="Descriptive alt" />
          <TextInput label="Caption" value={imageBlock.caption} onChange={(v:any)=>setImageBlock({...imageBlock, caption: v})} placeholder="Optional caption" />
          <TextInput label="Width (full|large|medium|small)" value={imageBlock.width} onChange={(v:any)=>setImageBlock({...imageBlock, width: v})} />
          <TextInput label="Link (optional)" value={imageBlock.link} onChange={(v:any)=>setImageBlock({...imageBlock, link: v})} placeholder="https://... or /path" />
          <TextInput label="Animation" value={imageBlock.animation} onChange={(v:any)=>setImageBlock({...imageBlock, animation: v})} />
        </div>
      )}

      {isFaq && (
        <div className="grid gap-4">
          <TextInput label="Heading" value={faqBlock.heading} onChange={(v:any)=>setFaqBlock({...faqBlock, heading: v})} placeholder="Frequently Asked Questions" />
          <TextArea label="Items JSON (array of {question, answer})" value={faqBlock.itemsJson} onChange={(v:any)=>setFaqBlock({...faqBlock, itemsJson: v})} placeholder='[{"question":"...","answer":"..."}]' />
          <NumberInput label="Columns (1-2)" value={faqBlock.columns} onChange={(v:any)=>setFaqBlock({...faqBlock, columns: v})} min={1} max={2} />
          <TextInput label="Animation" value={faqBlock.animation} onChange={(v:any)=>setFaqBlock({...faqBlock, animation: v})} />
        </div>
      )}

      {!isHero && !isCalc && (
        <div className="text-gray-600 text-sm">No editor schema for this block yet. I can add it next.</div>
      )}

      <div className="mt-6 flex gap-3">
        <button onClick={saveDraft} className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Save Draft</button>
        <button onClick={publish} className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700">Publish</button>
        <button onClick={save} className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900">Quick Save (Live)</button>
        <button onClick={()=>router.back()} className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
      </div>
    </div>
  )
}
