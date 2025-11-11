'use client'

import React, { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Loader2, Eye, EyeOff, Save, AlertTriangle, RotateCcw, FileEdit, Globe, Menu, Settings as Cog, Image as ImageIcon, Calendar, Plus, Trash2, GripVertical, ChevronDown, ChevronRight } from 'lucide-react'
import VisualEditor from '@/components/VisualEditor'
import type { PageComponent } from '@/types/page-builder'
import { revalidateContent } from '@/lib/revalidate'
import dynamic from 'next/dynamic'

interface NavigationItem {
  id: string
  label: string
  href: string
  order: number
  visible: boolean
  highlighted?: boolean
  children?: NavigationItem[]
}

function NavigationEditor({ onClose }: { onClose: () => void }) {
  const [navItems, setNavItems] = useState<NavigationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const supabase = createClientComponentClient()

  useEffect(() => {
    loadNavigation()
  }, [])

  const loadNavigation = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('settings').select('navigation_items').single()
      if (error) throw error
      const items = (data?.navigation_items || []) as NavigationItem[]
      setNavItems(items.sort((a, b) => a.order - b.order))
    } catch (e) {
      console.error('Failed to load navigation:', e)
      setNavItems([
        { id: 'home', label: 'Home', href: '/', order: 1, visible: true },
        { id: 'gallery', label: 'Gallery', href: '/gallery', order: 2, visible: true },
        { id: 'services', label: 'Services', href: '/services', order: 3, visible: true },
        { id: 'blog', label: 'Blog', href: '/blog', order: 4, visible: true },
        { id: 'about', label: 'About', href: '/about', order: 5, visible: true },
        { id: 'contact', label: 'Contact', href: '/contact', order: 6, visible: true },
        { id: 'book', label: 'Book a Session', href: '/book-a-session', order: 7, visible: true, highlighted: true },
      ])
    } finally {
      setLoading(false)
    }
  }

  const saveNavigation = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const payload = { 
        navigation_items: navItems, 
        updated_at: new Date().toISOString() 
      }
      
      // Settings is a singleton - get the actual row ID and update it
      const { data: existing } = await supabase
        .from('settings')
        .select('id')
        .limit(1)
        .maybeSingle()
      
      if (existing) {
        const { error } = await supabase
          .from('settings')
          .update(payload)
          .match({ id: existing.id })
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('settings')
          .insert([payload])
        if (error) throw error
      }
      
      setMessage({ type: 'success', text: 'Navigation saved successfully!' })
      setTimeout(() => window.location.reload(), 1000)
    } catch (e: any) {
      console.error('Save navigation error:', e)
      setMessage({ type: 'error', text: e?.message || 'Failed to save navigation' })
    } finally {
      setSaving(false)
    }
  }

  const addItem = (parentId?: string) => {
    const newItem: NavigationItem = {
      id: `nav-${Date.now()}`,
      label: 'New Link',
      href: '#',
      order: navItems.length + 1,
      visible: true,
    }
    
    if (parentId) {
      setNavItems(navItems.map(item => {
        if (item.id === parentId) {
          return {
            ...item,
            children: [...(item.children || []), newItem]
          }
        }
        return item
      }))
    } else {
      setNavItems([...navItems, newItem])
    }
  }

  const updateItem = (id: string, updates: Partial<NavigationItem>, parentId?: string) => {
    if (parentId) {
      setNavItems(navItems.map(item => {
        if (item.id === parentId) {
          return {
            ...item,
            children: (item.children || []).map(child =>
              child.id === id ? { ...child, ...updates } : child
            )
          }
        }
        return item
      }))
    } else {
      setNavItems(navItems.map(item => item.id === id ? { ...item, ...updates } : item))
    }
  }

  const deleteItem = (id: string, parentId?: string) => {
    if (parentId) {
      setNavItems(navItems.map(item => {
        if (item.id === parentId) {
          return {
            ...item,
            children: (item.children || []).filter(child => child.id !== id)
          }
        }
        return item
      }))
    } else {
      setNavItems(navItems.filter(item => item.id !== id))
    }
  }

  const moveItem = (id: string, direction: 'up' | 'down', parentId?: string) => {
    const items = parentId 
      ? (navItems.find(i => i.id === parentId)?.children || [])
      : navItems
    
    const index = items.findIndex(item => item.id === id)
    if (index === -1) return
    
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= items.length) return
    
    const reordered = [...items]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(newIndex, 0, moved)
    
    const updated = reordered.map((item, i) => ({ ...item, order: i + 1 }))
    
    if (parentId) {
      setNavItems(navItems.map(item => 
        item.id === parentId ? { ...item, children: updated } : item
      ))
    } else {
      setNavItems(updated)
    }
  }

  const renderItem = (item: NavigationItem, parentId?: string) => {
    const isExpanded = expandedItems[item.id] || false
    const hasChildren = item.children && item.children.length > 0
    
    return (
      <div key={item.id} className="border rounded mb-2 bg-white">
        <div className="flex items-center gap-2 p-3 flex-wrap">
          <button
            type="button"
            onClick={() => moveItem(item.id, 'up', parentId)}
            className="p-1 hover:bg-gray-100 rounded shrink-0"
            title="Move up"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </button>
          
          {!parentId && (
            <button
              type="button"
              onClick={() => setExpandedItems(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
              className={`p-1 rounded shrink-0 ${hasChildren ? 'hover:bg-gray-100' : 'opacity-30'}`}
              disabled={!hasChildren}
            >
              {hasChildren && isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          )}
          
          <input
            type="text"
            value={item.label}
            onChange={(e) => updateItem(item.id, { label: e.target.value }, parentId)}
            className="flex-1 min-w-[120px] border rounded px-2 py-1 text-sm"
            placeholder="Label"
          />
          
          <input
            type="text"
            value={item.href}
            onChange={(e) => updateItem(item.id, { href: e.target.value }, parentId)}
            className="flex-1 min-w-[120px] border rounded px-2 py-1 text-sm font-mono"
            placeholder="/path"
          />
          
          <label className="flex items-center gap-1 text-xs whitespace-nowrap shrink-0">
            <input
              type="checkbox"
              checked={item.visible}
              onChange={(e) => updateItem(item.id, { visible: e.target.checked }, parentId)}
              className="h-3 w-3"
            />
            Visible
          </label>
          
          <label className="flex items-center gap-1 text-xs whitespace-nowrap shrink-0">
            <input
              type="checkbox"
              checked={item.highlighted || false}
              onChange={(e) => updateItem(item.id, { highlighted: e.target.checked }, parentId)}
              className="h-3 w-3"
            />
            Highlight
          </label>
          
          {!parentId && (
            <button
              type="button"
              onClick={() => addItem(item.id)}
              className="px-3 py-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 shrink-0 font-medium"
              title="Add dropdown menu item"
            >
              + Dropdown
            </button>
          )}
          
          <button
            type="button"
            onClick={() => deleteItem(item.id, parentId)}
            className="p-1 hover:bg-red-50 text-red-600 rounded shrink-0"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        
        {isExpanded && hasChildren && (
          <div className="pl-8 pr-3 pb-3 space-y-2">
            {item.children!.map(child => renderItem(child, item.id))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Navigation Editor</h2>
          <button onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-50">
            Back to Editor
          </button>
        </div>
        
        {message && (
          <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <>
            <div className="mb-4">
              <button
                onClick={() => addItem()}
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add Link
              </button>
            </div>
            
            <div className="space-y-2">
              {navItems.map(item => renderItem(item))}
            </div>
            
            <div className="mt-6 flex gap-3">
              <button
                onClick={saveNavigation}
                disabled={saving}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? 'Saving...' : 'Save Navigation'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

interface PageConfig {
  slug: string
  data: {
    components?: PageComponent[]
    navigation?: any
    [key: string]: any
  }
  created_at?: string
  updated_at?: string
}

export default function LiveEditorPage() {
  const [pages, setPages] = useState<PageConfig[]>([])
  const [selectedSlug, setSelectedSlug] = useState<string>('')
  const [components, setComponents] = useState<PageComponent[]>([])
  const [originalComponents, setOriginalComponents] = useState<PageComponent[]>([])
  const [navigation, setNavigation] = useState<any>(null)
  const [originalNavigation, setOriginalNavigation] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showNavEditor, setShowNavEditor] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [pageTitle, setPageTitle] = useState('')
  const [importing, setImporting] = useState(false)
  const [availablePublishedPages, setAvailablePublishedPages] = useState<string[]>([])
  const [publishing, setPublishing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showCloudinary, setShowCloudinary] = useState(false)
  const [pageMeta, setPageMeta] = useState({
    title: '',
    meta_description: '',
    featured_image: '',
    category: '',
    tags: '' as string, // comma separated in UI
    show_navbar: true,
    status: 'draft' as 'draft' | 'in_progress' | 'review' | 'published' | 'archived',
    publish_at: '' as string | null,
    unpublish_at: '' as string | null,
  })
  const CloudinaryMediaLibrary = dynamic(() => import('@/components/CloudinaryMediaLibrary'), { ssr: false, loading: () => null })
  
  const supabase = createClientComponentClient()

  // List of core pages that should be available
  const CORE_PAGES = [
    { slug: 'home', title: 'Homepage' },
    { slug: 'about', title: 'About Us' },
    { slug: 'services', title: 'Services' },
    { slug: 'gallery', title: 'Gallery' },
    { slug: 'blog', title: 'Blog' },
    { slug: 'contact', title: 'Contact' },
    { slug: 'book-a-session', title: 'Book a Session' },
  ]

  useEffect(() => {
    loadPages()
    checkAvailablePublishedPages()
  }, [])

  useEffect(() => {
    if (selectedSlug) {
      loadPageContent(selectedSlug)
      loadContentPageMeta(selectedSlug)
    }
  }, [selectedSlug])

  // Autosave draft to content_pages with debounce
  useEffect(() => {
    if (!selectedSlug) return
    const t = setTimeout(() => {
      // Only autosave when there is at least one component or metadata present
      if (components.length > 0 || pageMeta.title || pageMeta.meta_description || pageMeta.featured_image) {
        saveDraftContent()
      }
    }, 1500)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSlug, components, pageMeta])

  useEffect(() => {
    // Detect changes in components or navigation
    const componentsChanged = JSON.stringify(components) !== JSON.stringify(originalComponents)
    const navChanged = JSON.stringify(navigation) !== JSON.stringify(originalNavigation)
    setHasChanges(componentsChanged || navChanged)
  }, [components, originalComponents, navigation, originalNavigation])

  const loadPages = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('page_configs')
        .select('slug, data, created_at, updated_at')
        .order('slug', { ascending: true })

      if (error) throw error

      console.log('Raw page_configs data:', data)

      // Combine existing pages with core pages that might not exist yet
      const existingSlugs = new Set((data || []).map(p => p.slug))
      const allPages: PageConfig[] = [
        ...(data || []),
        ...CORE_PAGES.filter(cp => !existingSlugs.has(cp.slug)).map(cp => ({
          slug: cp.slug,
          data: { components: [] }
        }))
      ]

      setPages(allPages)
      
      // Auto-select first page or 'home' if available
      if (allPages.length > 0 && !selectedSlug) {
        const homePage = allPages.find(p => p.slug === 'home')
        setSelectedSlug(homePage?.slug || allPages[0].slug)
      }
    } catch (e) {
      console.error('Load pages error:', e)
      setMessage({ type: 'error', text: 'Failed to load pages' })
    } finally {
      setLoading(false)
    }
  }

  const checkAvailablePublishedPages = async () => {
    try {
      const { data, error } = await supabase
        .from('content_pages')
        .select('slug')
        .eq('published', true)
        .order('slug', { ascending: true })

      if (!error && data) {
        const slugs = data.map(p => p.slug)
        setAvailablePublishedPages(slugs)
        console.log('Available published pages:', slugs)
      }
    } catch (e) {
      console.error('Failed to check published pages:', e)
    }
  }

  const loadPageContent = async (slug: string) => {
    setLoading(true)
    setMessage(null)
    try {
      const { data, error } = await supabase
        .from('page_configs')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      // Load existing data or start with empty
      // Structure is: { slug: string, data: { components: [], navigation: {} } }
      const pageData = data?.data || {}
      const comps = Array.isArray(pageData.components) ? pageData.components : []
      const nav = pageData.navigation || null
      
      console.log('Loaded page:', slug, 'Components:', comps.length, 'Data:', pageData)
      
      setComponents(comps)
      setOriginalComponents(JSON.parse(JSON.stringify(comps)))
      setNavigation(nav)
      setOriginalNavigation(JSON.parse(JSON.stringify(nav)))
      
      // Set page title from CORE_PAGES or use slug
      const corePageInfo = CORE_PAGES.find(p => p.slug === slug)
      setPageTitle(corePageInfo?.title || slug)
      
      if (comps.length === 0) {
        setMessage({ 
          type: 'warning', 
          text: `No components found for ${slug}. Start by adding components or using a template.` 
        })
      }
    } catch (e) {
      console.error('Load page content error:', e)
      setMessage({ type: 'error', text: 'Failed to load page content' })
      setComponents([])
      setOriginalComponents([])
      setNavigation(null)
      setOriginalNavigation(null)
    } finally {
      setLoading(false)
    }
  }

  // Load existing content_pages metadata to unify editing/publishing
  const loadContentPageMeta = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('content_pages')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()

      if (error && (error as any).code !== 'PGRST116') return

      if (data) {
        setPageMeta({
          title: data.title || '',
          meta_description: data.meta_description || '',
          featured_image: data.featured_image || '',
          category: data.category || '',
          tags: Array.isArray(data.tags) ? (data.tags as string[]).join(', ') : (data.tags || ''),
          show_navbar: data.show_navbar !== false,
          status: (data.status as any) || (data.published ? 'published' : 'draft'),
          publish_at: data.publish_at || '',
          unpublish_at: data.unpublish_at || '',
        })
        // Also keep pageTitle in sync for header display
        setPageTitle(data.title || slug)
      } else {
        setPageMeta((prev) => ({
          ...prev,
          title: slug,
          show_navbar: true, // Default navbar to visible for new pages
        }))
      }
    } catch (e) {
      // non-blocking
    }
  }

  // Reusable: convert builder components -> MDX (mirrors page-builder logic)
  const componentsToMDX = (list: PageComponent[]): string => {
    const md: string[] = []

    const escapeAttr = (v: string) =>
      String(v ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')

    const toB64 = (s: string) => {
      try { return btoa(unescape(encodeURIComponent(s))) } catch { return '' }
    }

    list.forEach((c) => {
      const d: any = c.data || {}
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
          md.push(`<LogoBlock mode="${escapeAttr(d.mode || 'svg')}" text="${escapeAttr(d.text || 'Studio 37')}" subtext="${escapeAttr(d.subtext || '')}" showCamera="${(d.showCamera ?? true) ? 'true' : 'false'}" color="${escapeAttr(d.color || '#111827')}" accentColor="${escapeAttr(d.accentColor || '#b46e14')}" imageUrl="${escapeAttr(d.imageUrl || '')}" size="${escapeAttr(d.size || 'xl')}" imageHeightPx="${Number(d.imageHeightPx ?? 64)}" fontSizePx="${Number(d.fontSizePx ?? 0)}" alignment="${escapeAttr(d.alignment || 'left')}" link="${escapeAttr(d.link || '')}" animation="${escapeAttr(d.animation || 'none')}" />`)
          break
        }
        case 'hero': {
          md.push(`<HeroBlock title="${escapeAttr(d.title)}" subtitle="${escapeAttr(d.subtitle)}" backgroundImage="${escapeAttr(d.backgroundImage || '')}" buttonText="${escapeAttr(d.buttonText)}" buttonLink="${escapeAttr(d.buttonLink)}" secondaryButtonText="${escapeAttr(d.secondaryButtonText || '')}" secondaryButtonLink="${escapeAttr(d.secondaryButtonLink || '')}" alignment="${escapeAttr(d.alignment || 'center')}" overlay="${Number.isFinite(d.overlay) ? d.overlay : 50}" titleColor="${escapeAttr(d.titleColor || 'text-white')}" subtitleColor="${escapeAttr(d.subtitleColor || 'text-amber-50')}" buttonStyle="${escapeAttr(d.buttonStyle || 'primary')}" animation="${escapeAttr(d.animation || 'none')}" buttonAnimation="${escapeAttr(d.buttonAnimation || 'none')}" fullBleed="${(d.fullBleed ?? true) ? 'true' : 'false'}" />`)
          break
        }
        case 'slideshowHero': {
          const slidesB64 = toB64(JSON.stringify(d.slides || []))
          md.push(`<SlideshowHeroBlock slidesB64="${slidesB64}" intervalMs="${Number(d.intervalMs || 5000)}" overlay="${Number(d.overlay || 60)}" title="${escapeAttr(d.title || '')}" subtitle="${escapeAttr(d.subtitle || '')}" buttonText="${escapeAttr(d.buttonText || '')}" buttonLink="${escapeAttr(d.buttonLink || '/book-a-session')}" alignment="${escapeAttr(d.alignment || 'center')}" titleColor="${escapeAttr(d.titleColor || 'text-white')}" subtitleColor="${escapeAttr(d.subtitleColor || 'text-amber-50')}" buttonStyle="${escapeAttr(d.buttonStyle || 'primary')}" buttonAnimation="${escapeAttr(d.buttonAnimation || 'hover-zoom')}" fullBleed="${(d.fullBleed ?? true) ? 'true' : 'false'}" />`)
          break
        }
        case 'text': {
          const contentB64 = toB64(String(d.content || ''))
          md.push(`<TextBlock contentB64="${contentB64}" alignment="${escapeAttr(d.alignment || 'left')}" size="${escapeAttr(d.size || 'md')}" animation="${escapeAttr(d.animation || 'none')}" />`)
          break
        }
        case 'image': {
          md.push(`<ImageBlock url="${escapeAttr(d.url || '')}" alt="${escapeAttr(d.alt || '')}" caption="${escapeAttr(d.caption || '')}" width="${escapeAttr(d.width || 'full')}" link="${escapeAttr(d.link || '')}" animation="${escapeAttr(d.animation || 'none')}" />`)
          break
        }
        case 'button': {
          md.push(`<ButtonBlock text="${escapeAttr(d.text || '')}" link="${escapeAttr(d.link || '#')}" style="${escapeAttr(d.style || 'primary')}" alignment="${escapeAttr(d.alignment || 'center')}" animation="${escapeAttr(d.animation || 'none')}" />`)
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
        default:
          break
      }
    })

    return md.join('\n\n')
  }

  const saveChanges = async () => {
    if (!selectedSlug) return
    setSaving(true)
    setMessage(null)

    try {
      // Create backup before saving
      const backupKey = `backup_${selectedSlug}_${Date.now()}`
      localStorage.setItem(
        backupKey,
        JSON.stringify({
          slug: selectedSlug,
          components: originalComponents,
          navigation: originalNavigation,
          timestamp: new Date().toISOString(),
        })
      )

      // Keep only last 10 backups per page
      const allBackupKeys = Object.keys(localStorage).filter(k => k.startsWith(`backup_${selectedSlug}_`))
      if (allBackupKeys.length > 10) {
        allBackupKeys.sort().slice(0, -10).forEach(k => localStorage.removeItem(k))
      }

      // Save to database
      const { error: updateError } = await supabase
        .from('page_configs')
        .upsert({
          slug: selectedSlug,
          data: {
            components,
            navigation,
          }
        }, { onConflict: 'slug' })

      if (updateError) throw updateError

      setOriginalComponents(JSON.parse(JSON.stringify(components)))
      setOriginalNavigation(JSON.parse(JSON.stringify(navigation)))
      setMessage({ type: 'success', text: 'Changes saved successfully!' })

      // Trigger revalidation
      try {
        await revalidateContent(selectedSlug === 'home' ? '/' : `/${selectedSlug}`)
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

  // Save content_pages draft (convert components to MDX and save metadata)
  const saveDraftContent = async () => {
    if (!selectedSlug) return
    setSaving(true)
    setMessage(null)
    try {
      const mdxContent = componentsToMDX(components)
      const { error } = await supabase
        .from('content_pages')
        .upsert({
          slug: selectedSlug,
          title: pageMeta.title || pageTitle || selectedSlug,
          content: mdxContent,
          meta_description: pageMeta.meta_description || null,
          featured_image: pageMeta.featured_image || null,
          category: pageMeta.category || null,
          tags: pageMeta.tags ? pageMeta.tags.split(',').map(t => t.trim()).filter(Boolean) : null,
          show_navbar: pageMeta.show_navbar,
          status: pageMeta.status || 'draft',
          publish_at: pageMeta.publish_at || null,
          unpublish_at: pageMeta.unpublish_at || null,
          published: false,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'slug' })

      if (error) throw error
      setMessage({ type: 'success', text: 'Draft saved to CMS.' })
    } catch (e: any) {
      console.error('Save draft error:', e)
      setMessage({ type: 'error', text: e?.message || 'Failed to save draft' })
    } finally {
      setSaving(false)
    }
  }

  // Publish to live site (convert components to MDX and save to content_pages)
  const publishToLive = async () => {
    if (!selectedSlug || components.length === 0) {
      setMessage({ type: 'warning', text: 'No components to publish' })
      return
    }

    const confirmed = window.confirm(
      `Publish "${selectedSlug}" to the live site?\n\nThis will make these changes visible to all visitors immediately.`
    )
    if (!confirmed) return

    setPublishing(true)
    setMessage(null)

    try {
      // Convert components to MDX (shared logic)
      const mdxContent = componentsToMDX(components)

      // Save to content_pages with metadata
      const { error } = await supabase
        .from('content_pages')
        .upsert({
          slug: selectedSlug,
          title: pageMeta.title || pageTitle || selectedSlug,
          content: mdxContent,
          meta_description: pageMeta.meta_description || null,
          featured_image: pageMeta.featured_image || null,
          category: pageMeta.category || null,
          tags: pageMeta.tags ? pageMeta.tags.split(',').map(t => t.trim()).filter(Boolean) : null,
          show_navbar: pageMeta.show_navbar,
          status: 'published',
          publish_at: pageMeta.publish_at || null,
          unpublish_at: pageMeta.unpublish_at || null,
          published: true,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'slug' })

      if (error) throw error

  setMessage({ type: 'success', text: '🎉 Published to live site! Changes are now visible to visitors.' })

      // Trigger revalidation
      try {
        await revalidateContent(selectedSlug === 'home' ? '/' : `/${selectedSlug}`)
      } catch (revalError) {
        console.warn('Revalidation failed:', revalError)
      }
    } catch (e: any) {
      console.error('Publish error:', e)
      setMessage({ type: 'error', text: e?.message || 'Failed to publish to live site' })
    } finally {
      setPublishing(false)
    }
  }

  const revertChanges = () => {
    setComponents(JSON.parse(JSON.stringify(originalComponents)))
    setNavigation(JSON.parse(JSON.stringify(originalNavigation)))
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
    setComponents(JSON.parse(JSON.stringify(latest.components || [])))
    setNavigation(JSON.parse(JSON.stringify(latest.navigation || null)))
    setMessage({
      type: 'success',
      text: `Restored backup from ${new Date(latest.timestamp).toLocaleString()}`,
    })
  }

  // Import from published MDX content
  const unescapeHtml = (s: string) =>
    String(s)
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')

  const parseAttrs = (tag: string) => {
    const attrs: Record<string, string> = {}
    const attrRe = /(\w+)="([^"]*)"/g
    let m: RegExpExecArray | null
    while ((m = attrRe.exec(tag))) {
      attrs[m[1]] = unescapeHtml(m[2])
    }
    return attrs
  }

  const mdxToComponents = (mdx: string): PageComponent[] => {
    const comps: PageComponent[] = []
    const lines = mdx.split(/\n+/).map(l => l.trim()).filter(Boolean)
    
    for (const line of lines) {
      const id = `component-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      
      if (line.startsWith('<HeroBlock')) {
        const a = parseAttrs(line)
        comps.push({
          id,
          type: 'hero',
          data: {
            title: a.title || '',
            subtitle: a.subtitle || '',
            backgroundImage: a.backgroundImage || '',
            buttonText: a.buttonText || '',
            buttonLink: a.buttonLink || '',
            secondaryButtonText: a.secondaryButtonText || '',
            secondaryButtonLink: a.secondaryButtonLink || '',
            alignment: a.alignment || 'center',
            overlay: Number(a.overlay) || 50,
            titleColor: a.titleColor || 'text-white',
            subtitleColor: a.subtitleColor || 'text-amber-50',
            buttonStyle: a.buttonStyle || 'primary',
            animation: a.animation || 'none',
            buttonAnimation: a.buttonAnimation || 'none',
            fullBleed: String(a.fullBleed) !== 'false',
          }
        })
      } else if (line.startsWith('<TextBlock')) {
        const a = parseAttrs(line)
        let content = ''
        try {
          content = a.contentB64 ? decodeURIComponent(escape(atob(a.contentB64))) : ''
        } catch { content = '' }
        comps.push({
          id,
          type: 'text',
          data: {
            content,
            alignment: a.alignment || 'left',
            size: a.size || 'md',
            animation: a.animation || 'none',
          }
        })
      } else if (line.startsWith('<ImageBlock')) {
        const a = parseAttrs(line)
        comps.push({
          id,
          type: 'image',
          data: {
            url: a.url || '',
            alt: a.alt || '',
            caption: a.caption || '',
            width: a.width || 'full',
            link: a.link || '',
            animation: a.animation || 'none',
          }
        })
      } else if (line.startsWith('<GalleryHighlightsBlock')) {
        const a = parseAttrs(line)
        let categories: string[] = []
        let collections: string[] = []
        let tags: string[] = []
        try {
          categories = a.categoriesB64 ? JSON.parse(decodeURIComponent(escape(atob(a.categoriesB64)))) : []
        } catch { categories = [] }
        try {
          collections = a.collectionsB64 ? JSON.parse(decodeURIComponent(escape(atob(a.collectionsB64)))) : []
        } catch { collections = [] }
        try {
          tags = a.tagsB64 ? JSON.parse(decodeURIComponent(escape(atob(a.tagsB64)))) : []
        } catch { tags = [] }
        comps.push({
          id,
          type: 'galleryHighlights',
          data: {
            categories,
            collections,
            tags,
            group: a.group || '',
            featuredOnly: String(a.featuredOnly) !== 'false',
            limit: Number(a.limit || 6),
            limitPerCategory: Number(a.limitPerCategory || 0) || undefined,
            sortBy: a.sortBy || 'display_order',
            sortDir: a.sortDir || 'asc',
            animation: a.animation || 'fade-in',
          }
        })
      } else if (line.startsWith('<FAQBlock')) {
        const a = parseAttrs(line)
        let items: any[] = []
        try {
          items = a.itemsB64 ? JSON.parse(decodeURIComponent(escape(atob(a.itemsB64)))) : []
        } catch { items = [] }
        comps.push({
          id,
          type: 'faq',
          data: {
            heading: a.heading || '',
            items,
            columns: Number(a.columns) || 1,
            animation: a.animation || 'fade-in',
          }
        })
      } else if (line.startsWith('<PricingTableBlock')) {
        const a = parseAttrs(line)
        let plans: any[] = []
        try {
          plans = a.plansB64 ? JSON.parse(decodeURIComponent(escape(atob(a.plansB64)))) : []
        } catch { plans = [] }
        comps.push({
          id,
          type: 'pricingTable',
          data: {
            heading: a.heading || '',
            subheading: a.subheading || '',
            plans,
            columns: Number(a.columns) || 3,
            animation: a.animation || 'fade-in',
            style: a.style || 'light',
            variant: a.variant || 'card',
            showFeatureChecks: String(a.showFeatureChecks) !== 'false',
          }
        })
      } else if (line.startsWith('<CTABannerBlock')) {
        const a = parseAttrs(line)
        comps.push({
          id,
          type: 'ctaBanner',
          data: {
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
            animation: a.animation || 'fade-in',
          }
        })
      } else if (line.startsWith('<ContactFormBlock')) {
        const a = parseAttrs(line)
        comps.push({
          id,
          type: 'contactForm',
          data: {
            heading: a.heading || '',
            subheading: a.subheading || '',
            animation: a.animation || 'fade-in',
          }
        })
      } else if (line.startsWith('<NewsletterBlock')) {
        const a = parseAttrs(line)
        comps.push({
          id,
          type: 'newsletterSignup',
          data: {
            heading: a.heading || '',
            subheading: a.subheading || '',
            disclaimer: a.disclaimer || '',
            style: a.style || 'card',
            animation: a.animation || 'fade-in',
          }
        })
      }
      // Add more block types as needed
    }
    
    return comps
  }

  const importFromPublished = async () => {
    if (!selectedSlug) return
    
    setImporting(true)
    setMessage(null)
    
    try {
      console.log('Importing from published:', selectedSlug)
      
      const { data, error } = await supabase
        .from('content_pages')
        .select('content')
        .eq('slug', selectedSlug)
        .eq('published', true)
        .maybeSingle()

      console.log('Published content fetch result:', { data, error, hasContent: !!data?.content })

      if (error) throw error
      if (!data?.content) {
        // No published content found - offer to use a template instead
        const useTemplate = confirm(
          `No published content found for "${selectedSlug}".\n\n` +
          `Would you like to load a template instead?\n\n` +
          `Click OK to browse templates, or Cancel to start with an empty canvas.`
        )
        
        if (useTemplate) {
          setMessage({ 
            type: 'warning', 
            text: 'No published content found. Please select a template from the "Quick Start Templates" dropdown in the left sidebar.' 
          })
        } else {
          setMessage({ 
            type: 'warning', 
            text: 'No published content found. Start by adding components from the left sidebar or use a template.' 
          })
        }
        return
      }

      console.log('MDX content length:', data.content.length, 'First 500 chars:', data.content.substring(0, 500))

      const imported = mdxToComponents(data.content)
      
      console.log('Parsed components:', imported.length, 'Sample:', imported[0])

      if (imported.length === 0) {
        setMessage({ type: 'warning', text: 'Could not parse any components from published content. The page might be using a different format.' })
        return
      }

      // Ask for confirmation
      if (!confirm(`Import ${imported.length} component${imported.length === 1 ? '' : 's'} from published page? This will replace your current unsaved changes.`)) {
        return
      }

      setComponents(imported)
      setOriginalComponents(JSON.parse(JSON.stringify(imported)))
      setMessage({ 
        type: 'success', 
        text: `Imported ${imported.length} component${imported.length === 1 ? '' : 's'} from published page. Click Save to persist these changes.` 
      })
    } catch (e: any) {
      console.error('Import error:', e)
      setMessage({ type: 'error', text: e?.message || 'Failed to import from published content' })
    } finally {
      setImporting(false)
    }
  }

  const getPageDisplayName = (slug: string) => {
    const corePageInfo = CORE_PAGES.find(p => p.slug === slug)
    return corePageInfo?.title || slug
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary-600" />
            Live Page Editor
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Edit your site pages with the visual builder
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
            className="border rounded px-4 py-2 bg-white shadow-sm focus:ring-2 focus:ring-primary-500"
            disabled={loading}
          >
            <option value="">Select a page...</option>
            {pages.map(page => (
              <option key={page.slug} value={page.slug}>
                /{page.slug === 'home' ? '' : page.slug} - {getPageDisplayName(page.slug)}
              </option>
            ))}
          </select>

          {selectedSlug && (
            <button
              onClick={() => setShowNavEditor(!showNavEditor)}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2"
              title="Edit navigation menu"
            >
              <Menu className="h-4 w-4" />
              Navigation
            </button>
          )}

          {selectedSlug && (
            <button
              onClick={() => setShowSettings(true)}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2"
              title="Page settings (SEO, featured image, visibility)"
            >
              <Cog className="h-4 w-4" />
              Page Settings
            </button>
          )}

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

          {selectedSlug && (
            <button
              onClick={importFromPublished}
              disabled={importing}
              className="px-4 py-2 border border-blue-300 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 flex items-center gap-2 disabled:opacity-50"
              title={
                availablePublishedPages.includes(selectedSlug)
                  ? 'Import components from published page'
                  : `No published content for ${selectedSlug}. Available: ${availablePublishedPages.join(', ') || 'none'}`
              }
            >
              {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileEdit className="h-4 w-4" />}
              {importing ? 'Importing...' : 'Import Published'}
              {!availablePublishedPages.includes(selectedSlug) && (
                <span className="text-xs opacity-70">(N/A)</span>
              )}
            </button>
          )}

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

          <button
            onClick={saveDraftContent}
            disabled={saving}
            className="px-6 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow"
            title="Save as CMS draft (with SEO/meta)"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </button>

          <button
            onClick={publishToLive}
            disabled={publishing || components.length === 0}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow"
            title="Publish to live site (visible to all visitors)"
          >
            {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
            {publishing ? 'Publishing...' : 'Publish to Live Site'}
          </button>
        </div>
      </div>

      {/* Warning Banner */}
      {selectedSlug && hasChanges && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Warning:</strong> You have unsaved changes. Click "Save Changes" to apply them.
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
              <p className="font-medium">Select a page to start editing</p>
              <p className="text-sm mt-2">Choose from your existing pages or core site pages</p>
            </div>
          </div>
        ) : showNavEditor ? (
          <NavigationEditor onClose={() => setShowNavEditor(false)} />
        ) : (
          <>
            {/* Visual Editor */}
            <div className={showPreview ? 'flex-1 border-r' : 'flex-1'}>
              <VisualEditor
                initialComponents={components}
                onSave={(comps) => {
                  setComponents(comps)
                  setHasChanges(true)
                }}
                onChange={setComponents}
                slug={selectedSlug}
              />
            </div>

            {/* Live Preview */}
            {showPreview && (
              <div className="w-1/2 bg-white flex flex-col">
                <div className="px-4 py-3 border-b bg-gray-50">
                  <h3 className="font-medium text-sm">Live Preview</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Shows current published version (save and wait a moment for updates)
                  </p>
                </div>
                <div className="flex-1 overflow-auto">
                  <iframe
                    src={selectedSlug === 'home' ? '/' : `/${selectedSlug}`}
                    className="w-full h-full border-0"
                    title="Page Preview"
                    key={selectedSlug} // Force reload on page change
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" onClick={() => setShowSettings(false)}>
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex items-center justify-between">
              <h2 className="text-xl font-bold">Page Settings</h2>
              <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-100 rounded" aria-label="Close settings">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={pageMeta.title}
                  onChange={(e) => { setPageMeta({ ...pageMeta, title: e.target.value }); setPageTitle(e.target.value) }}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Page title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Meta Description</label>
                <textarea
                  value={pageMeta.meta_description}
                  onChange={(e) => setPageMeta({ ...pageMeta, meta_description: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                  maxLength={160}
                  placeholder="Up to 160 characters"
                />
                <p className="text-xs text-gray-500 mt-1">{(pageMeta.meta_description || '').length}/160</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Featured Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pageMeta.featured_image}
                    onChange={(e) => setPageMeta({ ...pageMeta, featured_image: e.target.value })}
                    className="flex-1 border rounded px-3 py-2"
                    placeholder="https://..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowCloudinary(true)}
                    className="px-3 py-2 border rounded bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-2"
                  >
                    <ImageIcon className="h-4 w-4" /> Browse
                  </button>
                </div>
                {pageMeta.featured_image && (
                  <img src={pageMeta.featured_image} alt="Featured" className="mt-2 h-28 rounded border object-cover" />
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={pageMeta.tags}
                    onChange={(e) => setPageMeta({ ...pageMeta, tags: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="portrait, wedding"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={pageMeta.status}
                    onChange={(e) => setPageMeta({ ...pageMeta, status: e.target.value as any })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="draft">Draft</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Publish At (optional)</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <input
                      type="datetime-local"
                      value={pageMeta.publish_at || ''}
                      onChange={(e) => setPageMeta({ ...pageMeta, publish_at: e.target.value || '' })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unpublish At (optional)</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <input
                      type="datetime-local"
                      value={pageMeta.unpublish_at || ''}
                      onChange={(e) => setPageMeta({ ...pageMeta, unpublish_at: e.target.value || '' })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="show-navbar"
                  type="checkbox"
                  checked={pageMeta.show_navbar}
                  onChange={(e) => setPageMeta({ ...pageMeta, show_navbar: e.target.checked })}
                  className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor="show-navbar" className="text-sm text-gray-700">Show navigation bar on this page</label>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-2">
              <button onClick={() => setShowSettings(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Close</button>
              <button onClick={saveDraftContent} className="px-4 py-2 border rounded hover:bg-gray-100">Save Draft</button>
              <button onClick={publishToLive} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Publish</button>
            </div>
          </div>
        </div>
      )}

      {/* Cloudinary Media Library */}
      {showCloudinary && (
        <CloudinaryMediaLibrary
          onSelect={(result: any) => { setPageMeta({ ...pageMeta, featured_image: result.url }); setShowCloudinary(false) }}
          onClose={() => setShowCloudinary(false)}
        />
      )}
    </div>
  )
}
