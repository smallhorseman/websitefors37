"use client"

import React, { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  ColorPicker, 
  FontPicker, 
  TextSizePicker, 
  TextColorPicker,
  ButtonStylePicker,
  SpacingPicker,
  AnimationPicker 
} from '@/components/editor/ThemeControls'

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
    backgroundColor: '',
    textColor: 'text-white',
    titleFont: 'font-serif',
    subtitleFont: 'font-sans',
    buttonStyle: 'btn-primary',
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
    backgroundColor: '',
    textColor: 'text-gray-900',
    fontFamily: 'font-sans',
    padding: '16',
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

  const [servicesGrid, setServicesGrid] = useState({
    heading: '',
    subheading: '',
    servicesJson: '[]',
    columns: '3',
    animation: 'fade-in',
  })

  const [stats, setStats] = useState({
    heading: '',
    statsJson: '[]',
    columns: '3',
    style: 'default',
    animation: 'fade-in',
  })

  const [ctaBanner, setCtaBanner] = useState({
    heading: '',
    subheading: '',
    primaryButtonText: '',
    primaryButtonLink: '',
    secondaryButtonText: '',
    secondaryButtonLink: '',
    backgroundImage: '',
    backgroundColor: 'bg-gray-800',
    overlay: '60',
    textColor: 'text-white',
    headingFont: 'font-serif',
    buttonStyle: 'btn-primary',
    fullBleed: 'true',
    animation: 'fade-in',
  })

  const [iconFeatures, setIconFeatures] = useState({
    heading: '',
    subheading: '',
    featuresJson: '[]',
    columns: '4',
    animation: 'fade-in',
  })

  const [newsletter, setNewsletter] = useState({
    heading: 'Subscribe to our newsletter',
    subheading: '',
    disclaimer: '',
    style: 'card',
    animation: 'fade-in',
  })

  const [pricingTable, setPricingTable] = useState({
    heading: '',
    subheading: '',
    plansJson: '[]',
    columns: '3',
    animation: 'fade-in',
    style: 'light',
    variant: 'card',
    showFeatureChecks: 'true',
  })

  const isHero = block === 'HeroBlock'
  const isCalc = block === 'PricingCalculatorBlock'
  const isText = block === 'TextBlock'
  const isImage = block === 'ImageBlock'
  const isFaq = block === 'FAQBlock'
  const isServicesGrid = block === 'ServicesGridBlock'
  const isStats = block === 'StatsBlock'
  const isCtaBanner = block === 'CTABannerBlock'
  const isIconFeatures = block === 'IconFeaturesBlock'
  const isNewsletter = block === 'NewsletterBlock'
  const isPricingTable = block === 'PricingTableBlock'

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
    if (isServicesGrid) {
      let safeJson = '[]'
      try { JSON.parse(servicesGrid.servicesJson || '[]'); safeJson = servicesGrid.servicesJson || '[]' } catch {}
      const servicesB64 = typeof window !== 'undefined' ? btoa(unescape(encodeURIComponent(safeJson))) : ''
      return { heading: servicesGrid.heading, subheading: servicesGrid.subheading, servicesB64, columns: servicesGrid.columns, animation: servicesGrid.animation }
    }
    if (isStats) {
      let safeJson = '[]'
      try { JSON.parse(stats.statsJson || '[]'); safeJson = stats.statsJson || '[]' } catch {}
      const statsB64 = typeof window !== 'undefined' ? btoa(unescape(encodeURIComponent(safeJson))) : ''
      return { heading: stats.heading, statsB64, columns: stats.columns, style: stats.style, animation: stats.animation }
    }
    if (isCtaBanner) return { ...ctaBanner }
    if (isIconFeatures) {
      let safeJson = '[]'
      try { JSON.parse(iconFeatures.featuresJson || '[]'); safeJson = iconFeatures.featuresJson || '[]' } catch {}
      const featuresB64 = typeof window !== 'undefined' ? btoa(unescape(encodeURIComponent(safeJson))) : ''
      return { heading: iconFeatures.heading, subheading: iconFeatures.subheading, featuresB64, columns: iconFeatures.columns, animation: iconFeatures.animation }
    }
    if (isNewsletter) return { ...newsletter }
    if (isPricingTable) {
      let safeJson = '[]'
      try { JSON.parse(pricingTable.plansJson || '[]'); safeJson = pricingTable.plansJson || '[]' } catch {}
      const plansB64 = typeof window !== 'undefined' ? btoa(unescape(encodeURIComponent(safeJson))) : ''
      return { heading: pricingTable.heading, subheading: pricingTable.subheading, plansB64, columns: pricingTable.columns, animation: pricingTable.animation, style: pricingTable.style, variant: pricingTable.variant, showFeatureChecks: pricingTable.showFeatureChecks }
    }
    return {}
  }, [isHero, isCalc, isText, isImage, isFaq, isServicesGrid, isStats, isCtaBanner, isIconFeatures, isNewsletter, isPricingTable, hero, calc, textBlock, imageBlock, faqBlock, servicesGrid, stats, ctaBanner, iconFeatures, newsletter, pricingTable])

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
        <>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Content</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <TextInput label="Title (HTML ok)" value={hero.title} onChange={(v:any)=>setHero({...hero, title: v})} />
              <TextArea label="Subtitle (HTML ok)" value={hero.subtitle} onChange={(v:any)=>setHero({...hero, subtitle: v})} />
              <TextInput label="Button Text" value={hero.buttonText} onChange={(v:any)=>setHero({...hero, buttonText: v})} />
              <TextInput label="Button Link" value={hero.buttonLink} onChange={(v:any)=>setHero({...hero, buttonLink: v})} />
              <TextInput label="Background Image URL" value={hero.backgroundImage} onChange={(v:any)=>setHero({...hero, backgroundImage: v})} />
              <TextInput label="Alignment (left|center|right)" value={hero.alignment} onChange={(v:any)=>setHero({...hero, alignment: v})} />
              <NumberInput label="Overlay (0-100)" value={hero.overlay} onChange={(v:any)=>setHero({...hero, overlay: v})} min={0} max={100} />
            </div>
          </div>

          <div className="mb-6 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Theme & Styling</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <ColorPicker 
                label="Background Color" 
                value={hero.backgroundColor} 
                onChange={(v)=>setHero({...hero, backgroundColor: v})}
                allowTransparent
              />
              <TextColorPicker 
                label="Text Color" 
                value={hero.textColor} 
                onChange={(v)=>setHero({...hero, textColor: v})}
                background="dark"
              />
              <FontPicker 
                label="Title Font" 
                value={hero.titleFont} 
                onChange={(v)=>setHero({...hero, titleFont: v})}
                type="heading"
              />
              <FontPicker 
                label="Subtitle Font" 
                value={hero.subtitleFont} 
                onChange={(v)=>setHero({...hero, subtitleFont: v})}
                type="body"
              />
              <ButtonStylePicker 
                label="Button Style" 
                value={hero.buttonStyle} 
                onChange={(v)=>setHero({...hero, buttonStyle: v})}
              />
            </div>
          </div>
        </>
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
        <>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Content</h3>
            <TextArea label="HTML Content" value={textBlock.html} onChange={(v:any)=>setTextBlock({...textBlock, html: v})} placeholder="Enter HTML content; will be base64-encoded." />
            <div className="grid md:grid-cols-3 gap-3 mt-4">
              <TextInput label="Alignment (left|center|right)" value={textBlock.alignment} onChange={(v:any)=>setTextBlock({...textBlock, alignment: v})} />
              <TextInput label="Size (sm|md|lg|xl)" value={textBlock.size} onChange={(v:any)=>setTextBlock({...textBlock, size: v})} />
            </div>
          </div>

          <div className="mb-6 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Theme & Styling</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <ColorPicker 
                label="Background Color" 
                value={textBlock.backgroundColor} 
                onChange={(v)=>setTextBlock({...textBlock, backgroundColor: v})}
                allowTransparent
              />
              <TextColorPicker 
                label="Text Color" 
                value={textBlock.textColor} 
                onChange={(v)=>setTextBlock({...textBlock, textColor: v})}
                background="light"
              />
              <FontPicker 
                label="Font Family" 
                value={textBlock.fontFamily} 
                onChange={(v)=>setTextBlock({...textBlock, fontFamily: v})}
                type="all"
              />
              <SpacingPicker 
                label="Padding" 
                value={textBlock.padding} 
                onChange={(v)=>setTextBlock({...textBlock, padding: v})}
                type="padding"
              />
              <AnimationPicker 
                label="Animation" 
                value={textBlock.animation} 
                onChange={(v)=>setTextBlock({...textBlock, animation: v})}
              />
            </div>
            <div className="text-xs text-gray-500 mt-2">Tip: Paste simple HTML; it will be stored as base64 in contentB64.</div>
          </div>
        </>
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

      {isServicesGrid && (
        <div className="grid gap-4">
          <TextInput label="Heading" value={servicesGrid.heading} onChange={(v:any)=>setServicesGrid({...servicesGrid, heading: v})} placeholder="Our Services" />
          <TextInput label="Subheading" value={servicesGrid.subheading} onChange={(v:any)=>setServicesGrid({...servicesGrid, subheading: v})} placeholder="Optional subheading" />
          <TextArea label="Services JSON (array of {image, title, description, features[], link?})" value={servicesGrid.servicesJson} onChange={(v:any)=>setServicesGrid({...servicesGrid, servicesJson: v})} placeholder='[{"image":"...","title":"...","description":"...","features":["..."],"link":"/..."}]' />
          <TextInput label="Columns (2|3|4)" value={servicesGrid.columns} onChange={(v:any)=>setServicesGrid({...servicesGrid, columns: v})} placeholder="3" />
          <TextInput label="Animation" value={servicesGrid.animation} onChange={(v:any)=>setServicesGrid({...servicesGrid, animation: v})} />
        </div>
      )}

      {isStats && (
        <div className="grid gap-4">
          <TextInput label="Heading" value={stats.heading} onChange={(v:any)=>setStats({...stats, heading: v})} placeholder="By the Numbers" />
          <TextArea label="Stats JSON (array of {icon, number, label, suffix?})" value={stats.statsJson} onChange={(v:any)=>setStats({...stats, statsJson: v})} placeholder='[{"icon":"📷","number":"1000","label":"Happy Clients","suffix":"+"}]' />
          <TextInput label="Columns (2|3|4)" value={stats.columns} onChange={(v:any)=>setStats({...stats, columns: v})} placeholder="3" />
          <TextInput label="Style (default|cards|minimal)" value={stats.style} onChange={(v:any)=>setStats({...stats, style: v})} />
          <TextInput label="Animation" value={stats.animation} onChange={(v:any)=>setStats({...stats, animation: v})} />
        </div>
      )}

      {isCtaBanner && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Content</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <TextInput label="Heading" value={ctaBanner.heading} onChange={(v:any)=>setCtaBanner({...ctaBanner, heading: v})} placeholder="Ready to get started?" />
              <TextInput label="Subheading" value={ctaBanner.subheading} onChange={(v:any)=>setCtaBanner({...ctaBanner, subheading: v})} placeholder="Optional subheading" />
              <TextInput label="Primary Button Text" value={ctaBanner.primaryButtonText} onChange={(v:any)=>setCtaBanner({...ctaBanner, primaryButtonText: v})} placeholder="Book Now" />
              <TextInput label="Primary Button Link" value={ctaBanner.primaryButtonLink} onChange={(v:any)=>setCtaBanner({...ctaBanner, primaryButtonLink: v})} placeholder="/book" />
              <TextInput label="Secondary Button Text" value={ctaBanner.secondaryButtonText} onChange={(v:any)=>setCtaBanner({...ctaBanner, secondaryButtonText: v})} placeholder="Learn More" />
              <TextInput label="Secondary Button Link" value={ctaBanner.secondaryButtonLink} onChange={(v:any)=>setCtaBanner({...ctaBanner, secondaryButtonLink: v})} placeholder="/services" />
              <TextInput label="Background Image URL" value={ctaBanner.backgroundImage} onChange={(v:any)=>setCtaBanner({...ctaBanner, backgroundImage: v})} />
              <NumberInput label="Overlay (0-100)" value={Number(ctaBanner.overlay)} onChange={(v:any)=>setCtaBanner({...ctaBanner, overlay: String(v)})} min={0} max={100} />
              <TextInput label="Full Bleed (true|false)" value={ctaBanner.fullBleed} onChange={(v:any)=>setCtaBanner({...ctaBanner, fullBleed: v})} />
            </div>
          </div>

          <div className="mb-6 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Theme & Styling</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <ColorPicker 
                label="Background Color" 
                value={ctaBanner.backgroundColor} 
                onChange={(v)=>setCtaBanner({...ctaBanner, backgroundColor: v})}
              />
              <TextColorPicker 
                label="Text Color" 
                value={ctaBanner.textColor} 
                onChange={(v)=>setCtaBanner({...ctaBanner, textColor: v})}
                background="dark"
              />
              <FontPicker 
                label="Heading Font" 
                value={ctaBanner.headingFont} 
                onChange={(v)=>setCtaBanner({...ctaBanner, headingFont: v})}
                type="heading"
              />
              <ButtonStylePicker 
                label="Button Style" 
                value={ctaBanner.buttonStyle} 
                onChange={(v)=>setCtaBanner({...ctaBanner, buttonStyle: v})}
              />
              <AnimationPicker 
                label="Animation" 
                value={ctaBanner.animation} 
                onChange={(v)=>setCtaBanner({...ctaBanner, animation: v})}
              />
            </div>
          </div>
        </>
      )}

      {isIconFeatures && (
        <div className="grid gap-4">
          <TextInput label="Heading" value={iconFeatures.heading} onChange={(v:any)=>setIconFeatures({...iconFeatures, heading: v})} placeholder="Why Choose Us" />
          <TextInput label="Subheading" value={iconFeatures.subheading} onChange={(v:any)=>setIconFeatures({...iconFeatures, subheading: v})} placeholder="Optional subheading" />
          <TextArea label="Features JSON (array of {icon, title, description})" value={iconFeatures.featuresJson} onChange={(v:any)=>setIconFeatures({...iconFeatures, featuresJson: v})} placeholder='[{"icon":"📷","title":"Professional","description":"High-quality results"}]' />
          <TextInput label="Columns (2|3|4)" value={iconFeatures.columns} onChange={(v:any)=>setIconFeatures({...iconFeatures, columns: v})} placeholder="4" />
          <TextInput label="Animation" value={iconFeatures.animation} onChange={(v:any)=>setIconFeatures({...iconFeatures, animation: v})} />
        </div>
      )}

      {isNewsletter && (
        <div className="grid gap-4">
          <TextInput label="Heading" value={newsletter.heading} onChange={(v:any)=>setNewsletter({...newsletter, heading: v})} placeholder="Subscribe to our newsletter" />
          <TextInput label="Subheading" value={newsletter.subheading} onChange={(v:any)=>setNewsletter({...newsletter, subheading: v})} placeholder="Optional subheading" />
          <TextArea label="Disclaimer" value={newsletter.disclaimer} onChange={(v:any)=>setNewsletter({...newsletter, disclaimer: v})} placeholder="We respect your privacy." />
          <TextInput label="Style (card|banner)" value={newsletter.style} onChange={(v:any)=>setNewsletter({...newsletter, style: v})} />
          <TextInput label="Animation" value={newsletter.animation} onChange={(v:any)=>setNewsletter({...newsletter, animation: v})} />
        </div>
      )}

      {isPricingTable && (
        <div className="grid gap-4">
          <TextInput label="Heading" value={pricingTable.heading} onChange={(v:any)=>setPricingTable({...pricingTable, heading: v})} placeholder="Pricing Plans" />
          <TextInput label="Subheading" value={pricingTable.subheading} onChange={(v:any)=>setPricingTable({...pricingTable, subheading: v})} placeholder="Choose the right plan for you" />
          <TextArea label="Plans JSON (array of {title, price, period?, features[], ctaText?, ctaLink?, highlight?})" value={pricingTable.plansJson} onChange={(v:any)=>setPricingTable({...pricingTable, plansJson: v})} placeholder='[{"title":"Basic","price":"$99","period":"month","features":["..."],"ctaText":"Get Started","ctaLink":"/book","highlight":false}]' />
          <TextInput label="Columns (2|3|4)" value={pricingTable.columns} onChange={(v:any)=>setPricingTable({...pricingTable, columns: v})} placeholder="3" />
          <TextInput label="Style (light|dark)" value={pricingTable.style} onChange={(v:any)=>setPricingTable({...pricingTable, style: v})} />
          <TextInput label="Variant (card|flat)" value={pricingTable.variant} onChange={(v:any)=>setPricingTable({...pricingTable, variant: v})} />
          <TextInput label="Show Feature Checks (true|false)" value={pricingTable.showFeatureChecks} onChange={(v:any)=>setPricingTable({...pricingTable, showFeatureChecks: v})} />
          <TextInput label="Animation" value={pricingTable.animation} onChange={(v:any)=>setPricingTable({...pricingTable, animation: v})} />
        </div>
      )}

      {!isHero && !isCalc && !isText && !isImage && !isFaq && !isServicesGrid && !isStats && !isCtaBanner && !isIconFeatures && !isNewsletter && !isPricingTable && (
        <div className="text-gray-600 text-sm">No editor schema for this block yet. Use the layout editor to configure props as JSON.</div>
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
