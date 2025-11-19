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

  const isHero = block === 'HeroBlock'
  const isCalc = block === 'PricingCalculatorBlock'

  const payload = useMemo(() => {
    if (isHero) return hero
    if (isCalc) return calc
    return {}
  }, [isHero, isCalc, hero, calc])

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

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="mb-4">
        <div className="text-sm text-gray-500">Editing</div>
        <div className="text-lg font-semibold">{block}{id ? ` · ${id}` : ''}</div>
        <div className="text-xs text-gray-500 mt-1">Path: {path}</div>
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

      {!isHero && !isCalc && (
        <div className="text-gray-600 text-sm">No editor schema for this block yet. I can add it next.</div>
      )}

      <div className="mt-6 flex gap-3">
        <button onClick={save} className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700">Save</button>
        <button onClick={()=>router.back()} className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
      </div>
    </div>
  )
}
