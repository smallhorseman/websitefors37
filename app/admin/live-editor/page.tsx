'use client'

import React, { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Loader2, Eye, EyeOff, Save, AlertTriangle, RotateCcw, FileEdit, Globe, Menu } from 'lucide-react'
import VisualEditor from '@/components/VisualEditor'
import type { PageComponent } from '@/types/page-builder'
import { revalidateContent } from '@/lib/revalidate'

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
    }
  }, [selectedSlug])

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
      // Convert components to MDX (same logic as page-builder)
      const mdxContent = components.map(comp => {
        const { type, data } = comp
        const attrs = Object.entries(data)
          .map(([k, v]) => {
            if (typeof v === 'object') {
              return `${k}="${Buffer.from(JSON.stringify(v)).toString('base64')}"`
            }
            return `${k}="${String(v).replace(/"/g, '&quot;')}"`
          })
          .join(' ')
        
        const blockName = type.charAt(0).toUpperCase() + type.slice(1) + 'Block'
        return `<${blockName} ${attrs} />`
      }).join('\n\n')

      // Save to content_pages
      const { error } = await supabase
        .from('content_pages')
        .upsert({
          slug: selectedSlug,
          title: pageTitle,
          content: mdxContent,
          published: true,
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
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Navigation Editor</h2>
              <p className="text-gray-600 mb-4">
                Edit site navigation menu items (coming soon - for now, edit via Settings)
              </p>
              <div className="border rounded p-4 bg-gray-50">
                <p className="text-sm text-gray-600">
                  Navigation structure is currently managed via the Settings page.
                  This feature will allow you to visually edit menu items, links, and structure.
                </p>
              </div>
              <button
                onClick={() => setShowNavEditor(false)}
                className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Back to Page Editor
              </button>
            </div>
          </div>
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
    </div>
  )
}
