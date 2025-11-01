'use client'

import { useState, useEffect } from 'react'
import VisualEditor from '@/components/VisualEditor'
import { supabase } from '@/lib/supabase'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function PageBuilderPage() {
  const [components, setComponents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const searchParams = useSearchParams()
  const [slug, setSlug] = useState('new-landing-page')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [lastPublishedSlug, setLastPublishedSlug] = useState<string | null>(null)

  useEffect(() => {
    // Initialize slug from query string if provided
    const initialSlug = searchParams?.get('slug')
    if (initialSlug) {
      setSlug(initialSlug)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  // Import from published MDX content and convert to builder components
  const unescapeHtml = (s: string) =>
    String(s)
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')

  const parseAttrs = (tag: string) => {
    const attrs: Record<string,string> = {}
    const attrRe = /(\w+)="([^"]*)"/g
    let m: RegExpExecArray | null
    while ((m = attrRe.exec(tag))) {
      attrs[m[1]] = unescapeHtml(m[2])
    }
    return attrs
  }

  const mdxToComponents = (mdx: string): any[] => {
    const comps: any[] = []
    const lines = mdx.split(/\n+/).map(l => l.trim()).filter(Boolean)
    for (const line of lines) {
      if (line.startsWith('<GalleryHighlightsBlock')) {
        const a = parseAttrs(line)
        let categories: any[] = []
        let collections: any[] = []
        let tags: any[] = []
        try { const json = a.categoriesB64 ? decodeURIComponent(escape(atob(a.categoriesB64))) : '[]'; categories = JSON.parse(json || '[]') } catch { categories = [] }
        try { const json = a.collectionsB64 ? decodeURIComponent(escape(atob(a.collectionsB64))) : '[]'; collections = JSON.parse(json || '[]') } catch { collections = [] }
        try { const json = a.tagsB64 ? decodeURIComponent(escape(atob(a.tagsB64))) : '[]'; tags = JSON.parse(json || '[]') } catch { tags = [] }
        comps.push({ id: `component-${Date.now()}-${comps.length}`, type: 'galleryHighlights', data: {
          categories: categories as string[],
          collections: collections as string[],
          tags: tags as string[],
          group: a.group || '',
          featuredOnly: String(a.featuredOnly) !== 'false',
          limit: Number(a.limit || 6),
          limitPerCategory: Number(a.limitPerCategory || 0) || undefined,
          sortBy: (a.sortBy as any) || 'display_order',
          sortDir: (a.sortDir as any) || 'asc',
          animation: a.animation || 'fade-in'
        }})
      }
      if (line.startsWith('<LogoBlock')) {
        const a = parseAttrs(line)
        comps.push({
          id: `component-${Date.now()}-${comps.length}`,
          type: 'logo',
          data: {
            mode: (a.mode as any) || 'svg',
            text: a.text || 'Studio 37',
            subtext: a.subtext || '',
            showCamera: String(a.showCamera) !== 'false',
            color: a.color || '#111827',
            accentColor: a.accentColor || '#b46e14',
            imageUrl: a.imageUrl || '',
            size: (a.size as any) || 'md',
            alignment: (a.alignment as any) || 'left',
            link: a.link || '',
            animation: (a.animation as any) || 'none'
          }
        })
  } else if (line.startsWith('<HeroBlock')) {
        const a = parseAttrs(line)
        comps.push({
          id: `component-${Date.now()}-${comps.length}`,
          type: 'hero',
          data: {
            title: a.title || '',
            subtitle: a.subtitle || '',
            backgroundImage: a.backgroundImage || '',
            buttonText: a.buttonText || '',
            buttonLink: a.buttonLink || '#',
            secondaryButtonText: a.secondaryButtonText || '',
            secondaryButtonLink: a.secondaryButtonLink || '',
            alignment: (a.alignment as any) || 'center',
            overlay: Number(a.overlay ?? 50),
            titleColor: a.titleColor || 'text-white',
            subtitleColor: a.subtitleColor || 'text-amber-50',
            buttonStyle: (a.buttonStyle as any) || 'primary',
            animation: (a.animation as any) || 'none',
            buttonAnimation: (a.buttonAnimation as any) || 'none',
            fullBleed: String(a.fullBleed) === 'true'
          }
        })
      } else if (line.startsWith('<TextBlock')) {
        const a = parseAttrs(line)
        const content = a.contentB64 ? decodeURIComponent(escape(atob(a.contentB64))) : ''
        comps.push({ id: `component-${Date.now()}-${comps.length}`, type: 'text', data: {
          content,
          alignment: (a.alignment as any) || 'left',
          size: (a.size as any) || 'md',
          animation: (a.animation as any) || 'none'
        }})
      } else if (line.startsWith('<ImageBlock')) {
        const a = parseAttrs(line)
        comps.push({ id: `component-${Date.now()}-${comps.length}`, type: 'image', data: {
          url: a.url || '',
          alt: a.alt || '',
          caption: a.caption || '',
          width: (a.width as any) || 'full',
          link: a.link || '',
          animation: (a.animation as any) || 'none'
        }})
      } else if (line.startsWith('<ButtonBlock')) {
        const a = parseAttrs(line)
        comps.push({ id: `component-${Date.now()}-${comps.length}`, type: 'button', data: {
          text: a.text || '',
          link: a.link || '#',
          style: (a.style as any) || 'primary',
          alignment: (a.alignment as any) || 'center',
          animation: (a.animation as any) || 'none'
        }})
      } else if (line.startsWith('<ColumnsBlock')) {
        const a = parseAttrs(line)
        let columns: any[] = []
        try {
          const json = a.columnsB64 ? decodeURIComponent(escape(atob(a.columnsB64))) : '[]'
          columns = JSON.parse(json || '[]')
        } catch { columns = [] }
        comps.push({ id: `component-${Date.now()}-${comps.length}`, type: 'columns', data: {
          columns: columns.map((c: any) => ({ content: c.content || '', image: c.image || '' })),
          animation: (a.animation as any) || 'none'
        }})
      } else if (line.startsWith('<SpacerBlock')) {
        const a = parseAttrs(line)
        comps.push({ id: `component-${Date.now()}-${comps.length}`, type: 'spacer', data: { height: (a.height as any) || 'md' }})
      } else if (line.startsWith('<SeoFooterBlock')) {
        const a = parseAttrs(line)
        const content = a.contentB64 ? decodeURIComponent(escape(atob(a.contentB64))) : ''
        comps.push({ id: `component-${Date.now()}-${comps.length}`, type: 'seoFooter', data: {
          content,
          includeSchema: String(a.includeSchema) !== 'false'
        }})
      } else if (line.startsWith('<SlideshowHeroBlock')) {
        const a = parseAttrs(line)
        let slides: any[] = []
        try {
          const json = a.slidesB64 ? decodeURIComponent(escape(atob(a.slidesB64))) : '[]'
          slides = JSON.parse(json || '[]')
        } catch { slides = [] }
        comps.push({ id: `component-${Date.now()}-${comps.length}`, type: 'slideshowHero', data: {
          slides: slides.map((s:any)=>({ image:s.image||'', category:s.category||'', title:s.title||'' })),
          intervalMs: Number(a.intervalMs || 5000),
          overlay: Number(a.overlay || 60),
          title: a.title || '',
          subtitle: a.subtitle || '',
          buttonText: a.buttonText || '',
          buttonLink: a.buttonLink || '/book-a-session',
          alignment: (a.alignment as any) || 'center',
          titleColor: a.titleColor || 'text-white',
          subtitleColor: a.subtitleColor || 'text-amber-50',
          buttonStyle: (a.buttonStyle as any) || 'primary',
          buttonAnimation: (a.buttonAnimation as any) || 'hover-zoom',
          fullBleed: String(a.fullBleed) !== 'false'
        }})
      } else if (line.startsWith('<TestimonialsBlock')) {
        const a = parseAttrs(line)
        let testimonials: any[] = []
        try {
          const json = a.testimonialsB64 ? decodeURIComponent(escape(atob(a.testimonialsB64))) : '[]'
          testimonials = JSON.parse(json || '[]')
        } catch { testimonials = [] }
        comps.push({ id: `component-${Date.now()}-${comps.length}`, type: 'testimonials', data: {
          testimonials: testimonials.map((t:any)=>({ quote:t.quote||'', author:t.author||'', subtext:t.subtext||'', avatar:t.avatar||'' })),
          animation: (a.animation as any) || 'fade-in'
        }})
      } else if (line.startsWith('<GalleryHighlightsBlock')) {
        const a = parseAttrs(line)
        let categories: string[] = []
        try {
          const json = a.categoriesB64 ? decodeURIComponent(escape(atob(a.categoriesB64))) : '[]'
          categories = JSON.parse(json || '[]')
        } catch { categories = [] }
        comps.push({ id: `component-${Date.now()}-${comps.length}`, type: 'galleryHighlights', data: {
          categories,
          featuredOnly: String(a.featuredOnly) !== 'false',
          limit: Number(a.limit || 6),
          animation: (a.animation as any) || 'fade-in'
        }})
      } else if (line.startsWith('<BadgesBlock')) {
        const a = parseAttrs(line)
        let badges: any[] = []
        try {
          const json = a.badgesB64 ? decodeURIComponent(escape(atob(a.badgesB64))) : '[]'
          badges = JSON.parse(json || '[]')
        } catch { badges = [] }
        comps.push({ id: `component-${Date.now()}-${comps.length}`, type: 'badges', data: {
          badges: badges.map((b:any)=>({ icon: b.icon || 'star', label: b.label || '', sublabel: b.sublabel || '', href: b.href || '', color: b.color || '' })),
          alignment: (a.alignment as any) || 'center',
          size: (a.size as any) || 'md',
          style: (a.style as any) || 'pill',
          animation: (a.animation as any) || 'fade-in'
        }})
      } else if (line.startsWith('<WidgetEmbedBlock')) {
        const a = parseAttrs(line)
        let html = ''
        if (a.htmlB64) {
          try { html = decodeURIComponent(escape(atob(a.htmlB64))) } catch { html = '' }
        }
        let scriptSrcs: string[] = []
        if (a.scriptSrcsB64) {
          try { scriptSrcs = JSON.parse(decodeURIComponent(escape(atob(a.scriptSrcsB64))) || '[]') } catch { scriptSrcs = [] }
        }
        comps.push({ id: `component-${Date.now()}-${comps.length}`, type: 'widgetEmbed', data: {
          provider: a.provider || 'custom',
          html,
          scriptSrcs,
          styleReset: String(a.styleReset) !== 'false'
        }})
      } else if (line.startsWith('<ServicesGridBlock')) {
        const a = parseAttrs(line)
        let services: any[] = []
        try {
          const json = a.servicesB64 ? decodeURIComponent(escape(atob(a.servicesB64))) : '[]'
          services = JSON.parse(json || '[]')
        } catch { services = [] }
        comps.push({ id: `component-${Date.now()}-${comps.length}`, type: 'servicesGrid', data: {
          heading: a.heading || '',
          subheading: a.subheading || '',
          services: services.map((s:any)=>({ image: s.image || '', title: s.title || '', description: s.description || '', features: s.features || [], link: s.link || '' })),
          columns: Number(a.columns) || 3,
          animation: a.animation || 'fade-in'
        }})
      } else if (line.startsWith('<StatsBlock')) {
        const a = parseAttrs(line)
        let stats: any[] = []
        try {
          const json = a.statsB64 ? decodeURIComponent(escape(atob(a.statsB64))) : '[]'
          stats = JSON.parse(json || '[]')
        } catch { stats = [] }
        comps.push({ id: `component-${Date.now()}-${comps.length}`, type: 'stats', data: {
          heading: a.heading || '',
          stats: stats.map((s:any)=>({ icon: s.icon || '', number: s.number || '', label: s.label || '', suffix: s.suffix || '' })),
          columns: Number(a.columns) || 3,
          style: a.style || 'default',
          animation: a.animation || 'fade-in'
        }})
      } else if (line.startsWith('<CTABannerBlock')) {
        const a = parseAttrs(line)
        comps.push({ id: `component-${Date.now()}-${comps.length}`, type: 'ctaBanner', data: {
          heading: a.heading || '',
          subheading: a.subheading || '',
          primaryButtonText: a.primaryButtonText || '',
          primaryButtonLink: a.primaryButtonLink || '',
          secondaryButtonText: a.secondaryButtonText || '',
          secondaryButtonLink: a.secondaryButtonLink || '',
          backgroundImage: a.backgroundImage || '',
          backgroundColor: a.backgroundColor || '#0f172a',
          overlay: Number(a.overlay) || 60,
          textColor: a.textColor || 'text-white',
          fullBleed: String(a.fullBleed) !== 'false',
          animation: a.animation || 'fade-in'
        }})
      } else if (line.startsWith('<IconFeaturesBlock')) {
        const a = parseAttrs(line)
        let features: any[] = []
        try {
          const json = a.featuresB64 ? decodeURIComponent(escape(atob(a.featuresB64))) : '[]'
          features = JSON.parse(json || '[]')
        } catch { features = [] }
        comps.push({ id: `component-${Date.now()}-${comps.length}`, type: 'iconFeatures', data: {
          heading: a.heading || '',
          subheading: a.subheading || '',
          features: features.map((f:any)=>({ icon: f.icon || '', title: f.title || '', description: f.description || '' })),
          columns: Number(a.columns) || 4,
          animation: a.animation || 'fade-in'
        }})
      } else if (line.startsWith('<ContactFormBlock')) {
        const a = parseAttrs(line)
        comps.push({ id: `component-${Date.now()}-${comps.length}`, type: 'contactForm', data: {
          heading: a.heading || '',
          subheading: a.subheading || '',
          animation: a.animation || 'fade-in'
        }})
      } else if (line.startsWith('<NewsletterBlock')) {
        const a = parseAttrs(line)
        comps.push({ id: `component-${Date.now()}-${comps.length}`, type: 'newsletterSignup', data: {
          heading: a.heading || '',
          subheading: a.subheading || '',
          disclaimer: a.disclaimer || '',
          style: (a.style as any) || 'card',
          animation: a.animation || 'fade-in'
        }})
      } else if (line.startsWith('<FAQBlock')) {
        const a = parseAttrs(line)
        let items: any[] = []
        try {
          const json = a.itemsB64 ? decodeURIComponent(escape(atob(a.itemsB64))) : '[]'
          items = JSON.parse(json || '[]')
        } catch { items = [] }
        comps.push({ id: `component-${Date.now()}-${comps.length}`, type: 'faq', data: {
          heading: a.heading || '',
          items: items.map((it:any)=>({ question: it.question || '', answer: it.answer || '' })),
          columns: Number(a.columns) || 1,
          animation: a.animation || 'fade-in'
        }})
      } else if (line.startsWith('<PricingTableBlock')) {
        const a = parseAttrs(line)
        let plans: any[] = []
        try {
          const json = a.plansB64 ? decodeURIComponent(escape(atob(a.plansB64))) : '[]'
          plans = JSON.parse(json || '[]')
        } catch { plans = [] }
        comps.push({ id: `component-${Date.now()}-${comps.length}`, type: 'pricingTable', data: {
          heading: a.heading || '',
          subheading: a.subheading || '',
          plans: plans.map((p:any)=>({ title:p.title||'', price:p.price||'', period:p.period||'', features:p.features||[], ctaText:p.ctaText||'', ctaLink:p.ctaLink||'', highlight: !!p.highlight })),
          columns: Number(a.columns) || 3,
          animation: a.animation || 'fade-in',
          // New styling props (default to editor defaults if missing)
          style: (a.style as any) || 'light',
          variant: (a.variant as any) || 'card',
          showFeatureChecks: String(a.showFeatureChecks) !== 'false'
        }})
      }
    }
    return comps
  }

  const importFromPublished = async () => {
    try {
      const cleanSlugRaw = slug
        .toLowerCase()
        .replace(/[^a-z0-9-\s]/g, '')
        .replace(/\s+/g, '-')
        .trim()
      const cleanSlug = cleanSlugRaw || 'home'
      const { data, error } = await supabase
        .from('content_pages')
        .select('content')
        .eq('slug', cleanSlug)
        .eq('published', true)
        .maybeSingle()
      if (error) throw error
      if (!data?.content) {
        alert('No published content found for this slug.')
        return
      }
      const imported = mdxToComponents(data.content)
      if (!imported.length) {
        alert('Could not parse any components from the published content.')
        return
      }
      // Save as draft for this slug
      await supabase
        .from('page_configs')
        .upsert({ slug: cleanSlug, data: { components: imported } }, { onConflict: 'slug' })
      setMessage({ type: 'success', text: 'Imported from published content and saved as draft.' })
    } catch (e: any) {
      console.error('Import failed:', e)
      setMessage({ type: 'error', text: e?.message || 'Failed to import from published content.' })
    }
  }

  // Convert builder components to MDX with custom JSX components for faithful rendering
  const componentsToMDX = (list: any[]): string => {
    const md: string[] = []

    const escapeAttr = (v: string) =>
      String(v ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')

    const toB64 = (s: string) => {
      try {
        return btoa(unescape(encodeURIComponent(s)))
      } catch {
        return ''
      }
    }

    list.forEach((c) => {
      const d = c.data || {}
      switch (c.type) {
        case 'faq': {
          const itemsB64 = toB64(JSON.stringify(d.items || []))
          md.push(`<FAQBlock itemsB64="${itemsB64}" heading="${escapeAttr(d.heading || '')}" columns="${Number(d.columns || 1)}" animation="${escapeAttr(d.animation || 'fade-in')}" />`)
          break
        }
        case 'pricingTable': {
          const plansB64 = toB64(JSON.stringify(d.plans || []))
          md.push(`<PricingTableBlock plansB64="${plansB64}" heading="${escapeAttr(d.heading || '')}" subheading="${escapeAttr(d.subheading || '')}" columns="${Number(d.columns || 3)}" animation="${escapeAttr(d.animation || 'fade-in')}" style="${escapeAttr(d.style || 'light')}" variant="${escapeAttr(d.variant || 'card')}" showFeatureChecks="${(d.showFeatureChecks ?? true) ? 'true' : 'false'}" />`)
          break
        }
        case 'contactForm': {
          md.push(`<ContactFormBlock heading="${escapeAttr(d.heading || '')}" subheading="${escapeAttr(d.subheading || '')}" animation="${escapeAttr(d.animation || 'fade-in')}" />`)
          break
        }
        case 'newsletterSignup': {
          md.push(`<NewsletterBlock heading="${escapeAttr(d.heading || '')}" subheading="${escapeAttr(d.subheading || '')}" disclaimer="${escapeAttr(d.disclaimer || '')}" style="${escapeAttr(d.style || 'card')}" animation="${escapeAttr(d.animation || 'fade-in')}" />`)
          break
        }
        case 'logo': {
          md.push(
            `<LogoBlock mode="${escapeAttr(d.mode || 'svg')}" text="${escapeAttr(d.text || 'Studio 37')}" subtext="${escapeAttr(d.subtext || '')}" showCamera="${(d.showCamera ?? true) ? 'true' : 'false'}" color="${escapeAttr(d.color || '#111827')}" accentColor="${escapeAttr(d.accentColor || '#b46e14')}" imageUrl="${escapeAttr(d.imageUrl || '')}" size="${escapeAttr(d.size || 'md')}" alignment="${escapeAttr(d.alignment || 'left')}" link="${escapeAttr(d.link || '')}" animation="${escapeAttr(d.animation || 'none')}" />`
          )
          break
        }
        case 'hero': {
          md.push(
            `<HeroBlock title="${escapeAttr(d.title)}" subtitle="${escapeAttr(d.subtitle)}" backgroundImage="${escapeAttr(
              d.backgroundImage || ''
            )}" buttonText="${escapeAttr(d.buttonText)}" buttonLink="${escapeAttr(d.buttonLink)}" secondaryButtonText="${escapeAttr(d.secondaryButtonText || '')}" secondaryButtonLink="${escapeAttr(d.secondaryButtonLink || '')}" alignment="${escapeAttr(
              d.alignment || 'center'
            )}" overlay="${Number.isFinite(d.overlay) ? d.overlay : 50}" titleColor="${escapeAttr(
              d.titleColor || 'text-white'
            )}" subtitleColor="${escapeAttr(d.subtitleColor || 'text-amber-50')}" buttonStyle="${escapeAttr(
              d.buttonStyle || 'primary'
            )}" animation="${escapeAttr(d.animation || 'none')}" buttonAnimation="${escapeAttr(d.buttonAnimation || 'none')}" fullBleed="${(d.fullBleed ?? true) ? 'true' : 'false'}" />`
          )
          break
        }
        case 'slideshowHero': {
          const slidesB64 = toB64(JSON.stringify(d.slides || []))
          md.push(
            `<SlideshowHeroBlock slidesB64="${slidesB64}" intervalMs="${Number(d.intervalMs || 5000)}" overlay="${Number(d.overlay || 60)}" title="${escapeAttr(d.title || '')}" subtitle="${escapeAttr(d.subtitle || '')}" buttonText="${escapeAttr(d.buttonText || '')}" buttonLink="${escapeAttr(d.buttonLink || '/book-a-session')}" alignment="${escapeAttr(d.alignment || 'center')}" titleColor="${escapeAttr(d.titleColor || 'text-white')}" subtitleColor="${escapeAttr(d.subtitleColor || 'text-amber-50')}" buttonStyle="${escapeAttr(d.buttonStyle || 'primary')}" buttonAnimation="${escapeAttr(d.buttonAnimation || 'hover-zoom')}" fullBleed="${(d.fullBleed ?? true) ? 'true' : 'false'}" />`
          )
          break
        }
        case 'text': {
          const contentB64 = toB64(String(d.content || ''))
          md.push(
            `<TextBlock contentB64="${contentB64}" alignment="${escapeAttr(
              d.alignment || 'left'
            )}" size="${escapeAttr(d.size || 'md')}" animation="${escapeAttr(d.animation || 'none')}" />`
          )
          break
        }
        case 'image': {
          md.push(
            `<ImageBlock url="${escapeAttr(d.url || '')}" alt="${escapeAttr(d.alt || '')}" caption="${escapeAttr(
              d.caption || ''
            )}" width="${escapeAttr(d.width || 'full')}" link="${escapeAttr(d.link || '')}" animation="${escapeAttr(
              d.animation || 'none'
            )}" />`
          )
          break
        }
        case 'button': {
          md.push(
            `<ButtonBlock text="${escapeAttr(d.text || '')}" link="${escapeAttr(d.link || '#')}" style="${escapeAttr(
              d.style || 'primary'
            )}" alignment="${escapeAttr(d.alignment || 'center')}" animation="${escapeAttr(d.animation || 'none')}" />`
          )
          break
        }
        case 'columns': {
          const columnsB64 = toB64(JSON.stringify(d.columns || []))
          md.push(`<ColumnsBlock columnsB64="${columnsB64}" animation="${escapeAttr(d.animation || 'none')}" />`)
          break
        }
        case 'spacer': {
          md.push(`<SpacerBlock height="${escapeAttr(d.height || 'md')}" />`)
          break
        }
        case 'seoFooter': {
          const contentB64 = toB64(String(d.content || ''))
          md.push(`<SeoFooterBlock contentB64="${contentB64}" includeSchema="${(d.includeSchema ?? true) ? 'true' : 'false'}" />`)
          break
        }
        case 'testimonials': {
          const testimonialsB64 = toB64(JSON.stringify(d.testimonials || []))
          md.push(`<TestimonialsBlock testimonialsB64="${testimonialsB64}" animation="${escapeAttr(d.animation || 'fade-in')}" />`)
          break
        }
        case 'galleryHighlights': {
          const categoriesB64 = toB64(JSON.stringify(d.categories || []))
          const collectionsB64 = toB64(JSON.stringify(d.collections || []))
          const tagsB64 = toB64(JSON.stringify(d.tags || []))
          md.push(`<GalleryHighlightsBlock categoriesB64="${categoriesB64}" collectionsB64="${collectionsB64}" tagsB64="${tagsB64}" group="${escapeAttr(d.group || '')}" featuredOnly="${(d.featuredOnly ?? true) ? 'true' : 'false'}" limit="${Number(d.limit || 6)}" limitPerCategory="${Number(d.limitPerCategory || 0)}" sortBy="${escapeAttr(d.sortBy || 'display_order')}" sortDir="${escapeAttr(d.sortDir || 'asc')}" animation="${escapeAttr(d.animation || 'fade-in')}" />`)
          break
        }
        case 'badges': {
          const badgesB64 = toB64(JSON.stringify(d.badges || []))
          md.push(`<BadgesBlock badgesB64="${badgesB64}" alignment="${escapeAttr(d.alignment || 'center')}" size="${escapeAttr(d.size || 'md')}" style="${escapeAttr(d.style || 'pill')}" animation="${escapeAttr(d.animation || 'fade-in')}" />`)
          break
        }
        case 'widgetEmbed': {
          const htmlB64 = toB64(String(d.html || ''))
          const scriptSrcsB64 = toB64(JSON.stringify(d.scriptSrcs || []))
          md.push(`<WidgetEmbedBlock provider="${escapeAttr(d.provider || 'custom')}" htmlB64="${htmlB64}" scriptSrcsB64="${scriptSrcsB64}" styleReset="${(d.styleReset ?? true) ? 'true' : 'false'}" />`)
          break
        }
        case 'servicesGrid': {
          const servicesB64 = toB64(JSON.stringify(d.services || []))
          md.push(`<ServicesGridBlock servicesB64="${servicesB64}" heading="${escapeAttr(d.heading || '')}" subheading="${escapeAttr(d.subheading || '')}" columns="${Number(d.columns || 3)}" animation="${escapeAttr(d.animation || 'fade-in')}" />`)
          break
        }
        case 'stats': {
          const statsB64 = toB64(JSON.stringify(d.stats || []))
          md.push(`<StatsBlock statsB64="${statsB64}" heading="${escapeAttr(d.heading || '')}" columns="${Number(d.columns || 3)}" style="${escapeAttr(d.style || 'default')}" animation="${escapeAttr(d.animation || 'fade-in')}" />`)
          break
        }
        case 'ctaBanner': {
          md.push(`<CTABannerBlock heading="${escapeAttr(d.heading || '')}" subheading="${escapeAttr(d.subheading || '')}" primaryButtonText="${escapeAttr(d.primaryButtonText || '')}" primaryButtonLink="${escapeAttr(d.primaryButtonLink || '')}" secondaryButtonText="${escapeAttr(d.secondaryButtonText || '')}" secondaryButtonLink="${escapeAttr(d.secondaryButtonLink || '')}" backgroundImage="${escapeAttr(d.backgroundImage || '')}" backgroundColor="${escapeAttr(d.backgroundColor || '#0f172a')}" overlay="${Number(d.overlay || 60)}" textColor="${escapeAttr(d.textColor || 'text-white')}" fullBleed="${(d.fullBleed ?? true) ? 'true' : 'false'}" animation="${escapeAttr(d.animation || 'fade-in')}" />`)
          break
        }
        case 'iconFeatures': {
          const featuresB64 = toB64(JSON.stringify(d.features || []))
          md.push(`<IconFeaturesBlock featuresB64="${featuresB64}" heading="${escapeAttr(d.heading || '')}" subheading="${escapeAttr(d.subheading || '')}" columns="${Number(d.columns || 4)}" animation="${escapeAttr(d.animation || 'fade-in')}" />`)
          break
        }
      }
    })

    return md.join('\n\n')
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
      
      // Log MDX for debugging
      console.log('Generated MDX:', mdx)

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
          onChange={(next) => setComponents(next)}
          slug={slug}
          onImportFromPublished={importFromPublished}
        />
        <div className="p-4 flex justify-end gap-2">
          <Link
            href={(function(){
              const s = slug.replace(/[^a-z0-9-\s]/gi, '').toLowerCase().replace(/\s+/g, '-').trim()
              return s === 'home' ? '/' : `/${s || ''}`
            })()}
            target="_blank"
            className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
            aria-disabled={!slug}
          >
            View /{(() => { const s = slug.replace(/[^a-z0-9-\s]/gi, '').toLowerCase().replace(/\s+/g, '-').trim(); return s === 'home' ? '' : s || '…' })()}
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
            Publish to /{(() => { const s = slug.replace(/[^a-z0-9-\s]/gi, '').toLowerCase().replace(/\s+/g, '-').trim(); return s === 'home' ? '' : s || '…' })()}
          </button>
        </div>
      </div>
    </div>
  )
}
