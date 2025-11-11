'use client'

import React, { useState, useEffect } from 'react'
import { 
  Loader2, Plus, Trash2, Edit, Settings, X, ExternalLink, FileText,
  Grid, List, Calendar, Tag, Folder, Copy, Eye, Clock, BarChart3,
  Image as ImageIcon, Download, Upload, Filter, Search, CheckSquare,
  AlertCircle, TrendingUp, MessageSquare, History, Wand2
} from 'lucide-react'
import MarkdownEditor from '@/components/MarkdownEditor'
import { revalidateContent } from '@/lib/revalidate'
import CloudinaryMediaSelector from '@/components/CloudinaryMediaSelector'
import SEOScoreIndicator from '@/components/SEOScoreIndicator'
import PagePreviewModal from '@/components/PagePreviewModal'

interface ContentPage {
  id: string
  title: string
  slug: string
  content: string
  meta_description?: string
  published: boolean
  created_at: string
  updated_at: string
  category?: string
  tags?: string[]
  featured_image?: string
  open_graph_image?: string
  open_graph_description?: string
  scheduled_publish_at?: string
  scheduled_unpublish_at?: string
  status?: 'draft' | 'review' | 'in_progress' | 'published' | 'archived'
  seo_score?: number
  readability_score?: number
  view_count?: number
  last_viewed_at?: string
  parent_id?: string
  is_template?: boolean
  template_name?: string
  sort_order?: number
  author_id?: string
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

type ViewMode = 'list' | 'grid'

export default function EnhancedContentManagement() {
  const [pages, setPages] = useState<ContentPage[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPage, setSelectedPage] = useState<ContentPage | null>(null)
  const [showPageModal, setShowPageModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showMediaSelector, setShowMediaSelector] = useState(false)
  const [mediaFieldTarget, setMediaFieldTarget] = useState<'featured' | 'og'>('featured')
  
  const [pageForm, setPageForm] = useState<Partial<ContentPage>>({
    title: '',
    slug: '',
    content: '',
    meta_description: '',
    published: false,
    status: 'draft',
    category: '',
    tags: [],
    featured_image: '',
    open_graph_image: '',
    open_graph_description: '',
  })
  
  const [isNewPage, setIsNewPage] = useState(false)
  const [savingPage, setSavingPage] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Filters and view options
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterTags, setFilterTags] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set())
  const [showBulkActions, setShowBulkActions] = useState(false)
  
  // Date range filter
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  
  // Activity and comments
  const [showActivityLog, setShowActivityLog] = useState(false)
  const [showComments, setShowComments] = useState(false)

  useEffect(() => {
    fetchPages()
    fetchCategories()
  }, [])

  const fetchPages = async () => {
    setLoading(true)
    setError(null)
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data, error } = await supabase
        .from('content_pages')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('updated_at', { ascending: false })

      if (error) throw error
      setPages(data || [])
    } catch (error: any) {
      console.error('Error fetching pages:', error)
      setError(error.message || 'Failed to load content pages')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data, error } = await supabase
        .from('content_categories')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      setCategories(data || [])
    } catch (error: any) {
      console.error('Error fetching categories:', error)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setPageForm({
      ...pageForm,
      title,
      slug: isNewPage ? generateSlug(title) : pageForm.slug
    })
  }

  const calculateSEOScore = (form: Partial<ContentPage>): number => {
    let score = 0
    
    // Title (30 points)
    if (form.title && form.title.length >= 30 && form.title.length <= 60) score += 30
    else if (form.title && form.title.length > 0) score += 15
    
    // Meta description (25 points)
    if (form.meta_description && form.meta_description.length >= 120 && form.meta_description.length <= 160) score += 25
    else if (form.meta_description && form.meta_description.length > 0) score += 12
    
    // Content length (20 points)
    const contentLength = form.content?.length || 0
    if (contentLength >= 1000) score += 20
    else if (contentLength >= 500) score += 10
    else if (contentLength >= 200) score += 5
    
    // Featured image (10 points)
    if (form.featured_image) score += 10
    
    // Open graph (10 points)
    if (form.open_graph_image && form.open_graph_description) score += 10
    else if (form.open_graph_image || form.open_graph_description) score += 5
    
    // Slug (5 points)
    if (form.slug && form.slug.length > 0 && form.slug.length <= 60) score += 5
    
    return Math.min(score, 100)
  }

  const savePage = async () => {
    if (!pageForm.title || !pageForm.slug) {
      alert('Title and slug are required')
      return
    }

    setSavingPage(true)
    setError(null)
    
    try {
      const { supabase } = await import('@/lib/supabase')
      
      // Calculate SEO score before saving
      const seoScore = calculateSEOScore(pageForm)
      const pageData = {
        ...pageForm,
        seo_score: seoScore,
        updated_at: new Date().toISOString()
      }
      
      if (isNewPage) {
        const { data, error } = await supabase
          .from('content_pages')
          .insert([pageData])
          .select()

        if (error) throw error
        if (data) {
          setPages([data[0], ...pages])
          // Log activity
          await logActivity(data[0].id, 'created', { title: pageData.title })
        }
      } else {
        const { error } = await supabase
          .from('content_pages')
          .update(pageData)
          .eq('id', selectedPage!.id)

        if (error) throw error
        
        setPages(pages.map(page => 
          page.id === selectedPage!.id 
            ? { ...page, ...pageData } 
            : page
        ))
        
        // Create revision
        await createRevision(selectedPage!.id, pageData)
        // Log activity
        await logActivity(selectedPage!.id, 'updated', { changes: pageData })
      }
      
      setShowPageModal(false)
      setSelectedPage(null)

      // Revalidate
      try {
        await revalidateContent(`/${pageForm.slug}`)
      } catch (revalError) {
        console.warn("Revalidation failed (non-critical):", revalError)
      }
    } catch (error: any) {
      console.error('Error saving page:', error)
      if (error?.message?.includes('duplicate') || error?.message?.includes('unique')) {
        setError('That URL slug is already in use. Please choose a different slug.')
      } else {
        setError(error?.message || 'Failed to save page')
      }
    } finally {
      setSavingPage(false)
    }
  }

  const createRevision = async (pageId: string, pageData: Partial<ContentPage>) => {
    try {
      const { supabase } = await import('@/lib/supabase')
      
      // Get current version number
      const { data: revisions } = await supabase
        .from('content_revisions')
        .select('version_number')
        .eq('page_id', pageId)
        .order('version_number', { ascending: false })
        .limit(1)
      
      const versionNumber = revisions && revisions.length > 0 ? revisions[0].version_number + 1 : 1
      
      await supabase.from('content_revisions').insert([{
        page_id: pageId,
        title: pageData.title,
        slug: pageData.slug,
        content: pageData.content,
        meta_description: pageData.meta_description,
        version_number: versionNumber,
        revision_note: 'Auto-saved revision'
      }])
    } catch (error) {
      console.error('Failed to create revision:', error)
    }
  }

  const logActivity = async (pageId: string, action: string, changes: any) => {
    try {
      const { supabase } = await import('@/lib/supabase')
      await supabase.from('content_activity_log').insert([{
        page_id: pageId,
        action,
        changes
      }])
    } catch (error) {
      console.error('Failed to log activity:', error)
    }
  }

  const duplicatePage = async (page: ContentPage) => {
    const newSlug = `${page.slug}-copy-${Date.now()}`
    const newPage = {
      ...page,
      id: undefined,
      title: `${page.title} (Copy)`,
      slug: newSlug,
      published: false,
      status: 'draft' as const,
      created_at: undefined,
      updated_at: undefined,
    }
    
    setPageForm(newPage)
    setIsNewPage(true)
    setShowPageModal(true)
  }

  const saveAsTemplate = async (page: ContentPage) => {
    const templateName = prompt('Enter a name for this template:')
    if (!templateName) return
    
    try {
      const { supabase } = await import('@/lib/supabase')
      await supabase.from('content_pages').insert([{
        ...page,
        id: undefined,
        title: `Template: ${templateName}`,
        slug: `template-${generateSlug(templateName)}`,
        published: false,
        is_template: true,
        template_name: templateName,
      }])
      
      alert('Template saved successfully!')
      fetchPages()
    } catch (error: any) {
      alert('Failed to save template: ' + error.message)
    }
  }

  const bulkPublish = async (publish: boolean) => {
    try {
      const { supabase } = await import('@/lib/supabase')
      const ids = Array.from(selectedPages)
      
      await supabase
        .from('content_pages')
        .update({ published: publish, status: publish ? 'published' : 'draft' })
        .in('id', ids)
      
      setPages(pages.map(p => 
        selectedPages.has(p.id) 
          ? { ...p, published: publish, status: publish ? 'published' as const : 'draft' as const }
          : p
      ))
      
      setSelectedPages(new Set())
      setShowBulkActions(false)
    } catch (error: any) {
      alert('Bulk action failed: ' + error.message)
    }
  }

  const bulkDelete = async () => {
    if (!confirm(`Delete ${selectedPages.size} pages? This cannot be undone.`)) return
    
    try {
      const { supabase } = await import('@/lib/supabase')
      const ids = Array.from(selectedPages)
      
      await supabase
        .from('content_pages')
        .delete()
        .in('id', ids)
      
      setPages(pages.filter(p => !selectedPages.has(p.id)))
      setSelectedPages(new Set())
      setShowBulkActions(false)
    } catch (error: any) {
      alert('Bulk delete failed: ' + error.message)
    }
  }

  const exportPages = () => {
    const dataStr = JSON.stringify(pages, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `content-pages-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const filteredPages = pages
    .filter(page => {
      if (filterCategory !== 'all' && page.category !== filterCategory) return false
      if (filterStatus !== 'all' && page.status !== filterStatus) return false
      if (filterTags.length > 0 && !filterTags.every(tag => page.tags?.includes(tag))) return false
      if (dateFrom && new Date(page.created_at) < new Date(dateFrom)) return false
      if (dateTo && new Date(page.created_at) > new Date(dateTo)) return false
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        return page.title.toLowerCase().includes(term) || 
               page.slug.toLowerCase().includes(term) ||
               (page.meta_description && page.meta_description.toLowerCase().includes(term))
      }
      return true
    })

  const allTags = Array.from(new Set(pages.flatMap(p => p.tags || [])))

  const togglePageSelection = (id: string) => {
    const newSet = new Set(selectedPages)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedPages(newSet)
    setShowBulkActions(newSet.size > 0)
  }

  const selectAllFiltered = () => {
    const allIds = new Set(filteredPages.map(p => p.id))
    setSelectedPages(allIds)
    setShowBulkActions(allIds.size > 0)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Enhanced Content Management</h1>
        <div className="flex gap-2">
          <button 
            onClick={exportPages}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
            title="Export all pages"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button 
            onClick={() => {
              setPageForm({
                title: '',
                slug: '',
                content: '',
                meta_description: '',
                published: false,
                status: 'draft',
                category: '',
                tags: [],
              })
              setIsNewPage(true)
              setShowPageModal(true)
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Page
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review Needed</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
              title={`Switch to ${viewMode === 'list' ? 'grid' : 'list'} view`}
            >
              {viewMode === 'list' ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
            </button>
            {selectedPages.size > 0 && (
              <button
                onClick={selectAllFiltered}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <CheckSquare className="h-4 w-4" />
                Select All ({filteredPages.length})
              </button>
            )}
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">To Date</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">Filter by Tags</label>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    if (filterTags.includes(tag)) {
                      setFilterTags(filterTags.filter(t => t !== tag))
                    } else {
                      setFilterTags([...filterTags, tag])
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterTags.includes(tag)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-between items-center">
          <span className="text-sm font-medium">{selectedPages.size} page(s) selected</span>
          <div className="flex gap-2">
            <button
              onClick={() => bulkPublish(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              Publish Selected
            </button>
            <button
              onClick={() => bulkPublish(false)}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
            >
              Unpublish Selected
            </button>
            <button
              onClick={bulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Delete Selected
            </button>
            <button
              onClick={() => {
                setSelectedPages(new Set())
                setShowBulkActions(false)
              }}
              className="px-4 py-2 border rounded hover:bg-gray-50 text-sm"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Content Display */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      ) : filteredPages.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No pages found</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPages.map((page) => (
            <div 
              key={page.id} 
              className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow border-2 ${
                selectedPages.has(page.id) ? 'border-primary-500' : 'border-transparent'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <input
                    type="checkbox"
                    checked={selectedPages.has(page.id)}
                    onChange={() => togglePageSelection(page.id)}
                    className="mt-1"
                  />
                  <div className="flex gap-2">
                    {page.seo_score !== undefined && (
                      <SEOScoreIndicator score={page.seo_score} size="sm" />
                    )}
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      page.status === 'published' ? 'bg-green-100 text-green-800' :
                      page.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                      page.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {page.status || 'draft'}
                    </span>
                  </div>
                </div>
                
                {page.featured_image && (
                  <img 
                    src={page.featured_image} 
                    alt={page.title}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                )}
                
                <h3 className="font-semibold text-lg mb-1 line-clamp-2">{page.title}</h3>
                <p className="text-sm text-gray-500 font-mono mb-2">/{page.slug}</p>
                
                {page.meta_description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{page.meta_description}</p>
                )}
                
                {page.tags && page.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {page.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {page.view_count !== undefined && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Eye className="h-3 w-3" />
                    {page.view_count} views
                  </div>
                )}
                
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      setSelectedPage(page)
                      setPageForm(page)
                      setIsNewPage(false)
                      setShowPageModal(true)
                    }}
                    className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => duplicatePage(page)}
                    className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
                    title="Duplicate"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  {page.published && (
                    <a
                      href={`/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
                      title="View"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        selectAllFiltered()
                      } else {
                        setSelectedPages(new Set())
                        setShowBulkActions(false)
                      }
                    }}
                    checked={selectedPages.size === filteredPages.length && filteredPages.length > 0}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SEO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedPages.has(page.id)}
                      onChange={() => togglePageSelection(page.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {page.featured_image && (
                        <img src={page.featured_image} alt="" className="w-10 h-10 rounded object-cover" />
                      )}
                      <div>
                        <div className="font-medium">{page.title}</div>
                        <div className="text-sm text-gray-500 font-mono">/{page.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      page.status === 'published' ? 'bg-green-100 text-green-800' :
                      page.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                      page.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {page.status || 'draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {page.seo_score !== undefined && (
                      <SEOScoreIndicator score={page.seo_score} size="sm" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {page.view_count || 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(page.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedPage(page)
                          setPageForm(page)
                          setIsNewPage(false)
                          setShowPageModal(true)
                        }}
                        className="text-primary-600 hover:text-primary-900"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => duplicatePage(page)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      {page.published && (
                        <a
                          href={`/${page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-900"
                          title="View"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Page Edit Modal - Continued in next message due to length */}
      {showPageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">{isNewPage ? 'Create New Page' : 'Edit Page'}</h2>
              <button onClick={() => setShowPageModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    value={pageForm.title}
                    onChange={handleTitleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL Slug *</label>
                  <input
                    type="text"
                    value={pageForm.slug}
                    onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Category and Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={pageForm.category || ''}
                    onChange={(e) => setPageForm({ ...pageForm, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">No Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={pageForm.status || 'draft'}
                    onChange={(e) => setPageForm({ ...pageForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review Needed</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">SEO Score</label>
                  <SEOScoreIndicator score={calculateSEOScore(pageForm)} size="md" />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={pageForm.tags?.join(', ') || ''}
                  onChange={(e) => setPageForm({ 
                    ...pageForm, 
                    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) 
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="photography, portrait, wedding"
                />
              </div>

              {/* Meta Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Meta Description</label>
                <textarea
                  value={pageForm.meta_description || ''}
                  onChange={(e) => setPageForm({ ...pageForm, meta_description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={2}
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">{pageForm.meta_description?.length || 0}/160</p>
              </div>

              {/* Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Featured Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pageForm.featured_image || ''}
                      onChange={(e) => setPageForm({ ...pageForm, featured_image: e.target.value })}
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Image URL"
                    />
                    <button
                      onClick={() => {
                        setMediaFieldTarget('featured')
                        setShowMediaSelector(true)
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </button>
                  </div>
                  {pageForm.featured_image && (
                    <img src={pageForm.featured_image} alt="Featured" className="mt-2 h-32 w-auto rounded" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Open Graph Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pageForm.open_graph_image || ''}
                      onChange={(e) => setPageForm({ ...pageForm, open_graph_image: e.target.value })}
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="OG Image URL"
                    />
                    <button
                      onClick={() => {
                        setMediaFieldTarget('og')
                        setShowMediaSelector(true)
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </button>
                  </div>
                  {pageForm.open_graph_image && (
                    <img src={pageForm.open_graph_image} alt="OG" className="mt-2 h-32 w-auto rounded" />
                  )}
                </div>
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium mb-1">Content *</label>
                <MarkdownEditor
                  value={pageForm.content || ''}
                  onChange={(value) => setPageForm({ ...pageForm, content: value })}
                  minHeight="400px"
                />
              </div>

              {/* Scheduling */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Schedule Publish</label>
                  <input
                    type="datetime-local"
                    value={pageForm.scheduled_publish_at?.slice(0, 16) || ''}
                    onChange={(e) => setPageForm({ ...pageForm, scheduled_publish_at: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Schedule Unpublish</label>
                  <input
                    type="datetime-local"
                    value={pageForm.scheduled_unpublish_at?.slice(0, 16) || ''}
                    onChange={(e) => setPageForm({ ...pageForm, scheduled_unpublish_at: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex gap-2">
                  <button
                    onClick={() => saveAsTemplate(pageForm as ContentPage)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Save as Template
                  </button>
                  <a
                    href={`/admin/page-builder?slug=${pageForm.slug}`}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Wand2 className="h-4 w-4" />
                    Open in Visual Builder
                  </a>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPageModal(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={savePage}
                    disabled={savingPage || !pageForm.title || !pageForm.slug}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    {savingPage ? 'Saving...' : 'Save Page'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cloudinary Media Selector Modal */}
      {showMediaSelector && (
        <CloudinaryMediaSelector
          onSelect={(url) => {
            if (mediaFieldTarget === 'featured') {
              setPageForm({ ...pageForm, featured_image: url })
            } else {
              setPageForm({ ...pageForm, open_graph_image: url })
            }
            setShowMediaSelector(false)
          }}
          onClose={() => setShowMediaSelector(false)}
        />
      )}
    </div>
  )
}
