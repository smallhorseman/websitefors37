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
      if (allPages.length > 0 && !selectedSlug) {
        setSelectedSlug(allPages[0].slug)
      }
    } catch (e) {
      console.error('Load pages error:', e)
      setMessage({ type: 'error', text: 'Failed to load pages' })
    } finally {
      setLoading(false)
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
      const pageData = data?.data || { components: [] }
      const comps = pageData.components || []
      const nav = pageData.navigation || null
      
      setComponents(comps)
      setOriginalComponents(JSON.parse(JSON.stringify(comps)))
      setNavigation(nav)
      setOriginalNavigation(JSON.parse(JSON.stringify(nav)))
      
      // Set page title from CORE_PAGES or use slug
      const corePageInfo = CORE_PAGES.find(p => p.slug === slug)
      setPageTitle(corePageInfo?.title || slug)
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
                components={components}
                onChange={setComponents}
                slug={selectedSlug}
                title={pageTitle}
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
