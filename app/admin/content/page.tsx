'use client'

import React, { useState, useEffect } from 'react'
import { Loader2, Plus, Trash2, Edit, Settings, X, ExternalLink, FileText } from 'lucide-react'
import MarkdownEditor from '@/components/MarkdownEditor'
import { revalidateContent } from '@/lib/revalidate'
import dynamic from 'next/dynamic'

const CloudinaryMediaLibrary = dynamic(() => import('@/components/CloudinaryMediaLibrary'), {
  ssr: false,
  loading: () => null
})

interface ContentPage {
  id: string
  title: string
  slug: string
  content: string
  meta_description?: string
  published: boolean
  created_at: string
  updated_at: string
  category: string
  tags: string[]
  featured_image: string
  status: 'draft' | 'in_progress' | 'review' | 'published' | 'archived'
  seo_score: number
  view_count: number
  publish_at: string | null
  unpublish_at: string | null
  show_navbar: boolean
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

export default function ContentManagementPage() {
  const [pages, setPages] = useState<ContentPage[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPage, setSelectedPage] = useState<ContentPage | null>(null)
  const [showPageModal, setShowPageModal] = useState(false)
  const [pageForm, setPageForm] = useState({
    title: '',
    slug: '',
    content: '',
    meta_description: '',
    published: false,
    category: '',
    tags: [] as string[],
    featured_image: '',
    status: 'draft' as 'draft' | 'review' | 'in_progress' | 'published' | 'archived',
    seo_score: 0,
    view_count: 0,
    publish_at: null as string | null,
    unpublish_at: null as string | null,
    show_navbar: true,
  })
  const [isNewPage, setIsNewPage] = useState(false)
  const [savingPage, setSavingPage] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showCloudinary, setShowCloudinary] = useState(false)
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set())

  // Booking background image URL setting
  const [bookingBgUrl, setBookingBgUrl] = useState('')
  const [savingBgUrl, setSavingBgUrl] = useState(false)
  const [settingsError, setSettingsError] = useState<string | null>(null)

  // Fetch booking background image URL from settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { supabase } = await import('@/lib/supabase')
        const { data, error } = await supabase.from('settings').select('id, book_session_bg_url').maybeSingle()
        if (error) throw error
        setBookingBgUrl(data?.book_session_bg_url || '')
      } catch (err: any) {
        setSettingsError(err.message || 'Failed to load settings')
      }
    }
    fetchSettings()
  }, [])

  const saveBookingBgUrl = async () => {
    setSavingBgUrl(true)
    setSettingsError(null)
    try {
      const { supabase } = await import('@/lib/supabase')
      // Find existing settings row (if any)
      const { data: existing, error: fetchErr } = await supabase
        .from('settings')
        .select('id')
        .maybeSingle()
      if (fetchErr) throw fetchErr

      let err: any = null
      if (existing?.id) {
        const { error } = await supabase
          .from('settings')
          .update({ book_session_bg_url: bookingBgUrl, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
        err = error
      } else {
        const { error } = await supabase
          .from('settings')
          .insert([{ book_session_bg_url: bookingBgUrl }])
        err = error
      }
      if (err) throw err
    } catch (err: any) {
      setSettingsError(err.message || 'Failed to save background image URL')
    } finally {
      setSavingBgUrl(false)
    }
  }

  // Fetch categories
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

  // Fetch content pages
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

  useEffect(() => {
    fetchPages()
    fetchCategories()
  }, [])

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }

  // Handle title change and auto-generate slug for new pages
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setPageForm({
      ...pageForm,
      title,
      slug: isNewPage ? generateSlug(title) : pageForm.slug
    })
  }

  // Calculate SEO score
  const calculateSEOScore = (form: typeof pageForm): number => {
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
    
    // Category (10 points)
    if (form.category) score += 10
    
    // Slug (5 points)
    if (form.slug && form.slug.length > 0 && form.slug.length <= 60) score += 5
    
    return Math.min(score, 100)
  }

  // Create or update a page
  const savePage = async () => {
    if (!pageForm.title || !pageForm.slug) {
      alert('Title and slug are required')
      return
    }

    setSavingPage(true)
    setError(null)
    
    try {
      const { supabase } = await import('@/lib/supabase')
      
      // Calculate SEO score
      const seoScore = calculateSEOScore(pageForm)
      const pageData = {
        title: pageForm.title,
        slug: pageForm.slug,
        content: pageForm.content,
        meta_description: pageForm.meta_description,
        published: pageForm.published,
        category: pageForm.category || null,
        tags: pageForm.tags.length > 0 ? pageForm.tags : null,
        featured_image: pageForm.featured_image || null,
        status: pageForm.status,
        seo_score: seoScore,
        publish_at: pageForm.publish_at || null,
        unpublish_at: pageForm.unpublish_at || null,
        show_navbar: pageForm.show_navbar,
        updated_at: new Date().toISOString()
      }
      
      if (isNewPage) {
        // Create new page
        const { data, error } = await supabase
          .from('content_pages')
          .insert([pageData])
          .select()

        if (error) throw error
        
        // Add to local state
        if (data) setPages([data[0], ...pages])
      } else {
        // Update existing page
        const { error } = await supabase
          .from('content_pages')
          .update(pageData)
          .eq('id', selectedPage!.id)

        if (error) throw error
        
        // Update local state
        setPages(pages.map(page => 
          page.id === selectedPage!.id 
            ? { ...page, ...pageData } 
            : page
        ))
      }
      
      // Close modal and reset form
      setShowPageModal(false)
      setSelectedPage(null)

      // Trigger on-demand revalidation for content page
      const revalidatePath = `/${pageForm.slug}`;
      try {
        await revalidateContent(revalidatePath);
      } catch (revalError) {
        console.warn("Revalidation failed (non-critical):", revalError);
      }
    } catch (error: any) {
      console.error('Error saving page:', error)
      const code = error?.code || error?.details || ''
      if (typeof code === 'string' && code.includes('23505') || (error?.message && /duplicate key|unique constraint/i.test(error.message))) {
        setError('That URL slug is already in use. Please choose a different slug.')
      } else {
        setError(error?.message || 'Failed to save page')
      }
    } finally {
      setSavingPage(false)
    }
  }

  // Delete a page
  const deletePage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      return
    }
    
    try {
      const { supabase } = await import('@/lib/supabase')

      const { error } = await supabase
        .from('content_pages')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Update local state
      setPages(pages.filter(page => page.id !== id))
    } catch (error: any) {
      console.error('Error deleting page:', error)
      alert('Failed to delete page: ' + error.message)
    }
  }

  // Open edit modal for a page
  const editPage = (page: ContentPage) => {
    setEditingPage(page.id)
    setPageForm({
      title: page.title,
      slug: page.slug,
      content: page.content,
      meta_description: page.meta_description || '',
      published: page.published,
      category: page.category || '',
      tags: page.tags || [],
      featured_image: page.featured_image || '',
      status: page.status || 'draft',
      seo_score: page.seo_score || 0,
      view_count: page.view_count || 0,
      publish_at: page.publish_at || null,
      unpublish_at: page.unpublish_at || null,
      show_navbar: page.show_navbar ?? true,
    })
    setShowModal(true)
  }

  // Open modal to create a new page
  const createNewPage = () => {
    setSelectedPage(null)
    setPageForm({
      title: '',
      slug: '',
      content: '',
      meta_description: '',
      published: false,
      category: '',
      tags: [],
      featured_image: '',
      status: 'draft',
      seo_score: 0,
      view_count: 0,
      publish_at: null,
      unpublish_at: null,
      show_navbar: true,
    })
    setIsNewPage(true)
    setShowPageModal(true)
  }

  // Toggle page publish status
  const togglePublish = async (page: ContentPage) => {
    try {
      const { supabase } = await import('@/lib/supabase')

      const { error } = await supabase
        .from('content_pages')
        .update({ published: !page.published })
        .eq('id', page.id)

      if (error) throw error
      
      // Update local state
      setPages(pages.map(p => 
        p.id === page.id ? { ...p, published: !page.published } : p
      ))
    } catch (error: any) {
      console.error('Error toggling publish status:', error)
      alert('Failed to update publish status: ' + error.message)
    }
  }

  // Filter and search pages
  const filteredPages = pages
    .filter(page => {
      // Apply published filter
      if (filter === 'published') return page.published
      if (filter === 'draft') return !page.published
      return true
    })
    .filter(page => {
      // Apply category filter
      if (filterCategory !== 'all' && page.category !== filterCategory) return false
      return true
    })
    .filter(page => {
      // Apply status filter
      if (filterStatus !== 'all' && page.status !== filterStatus) return false
      return true
    })
    .filter(page => {
      // Apply search term
      if (!searchTerm) return true
      const term = searchTerm.toLowerCase()
      return page.title.toLowerCase().includes(term) || 
             page.slug.toLowerCase().includes(term) ||
             (page.meta_description && page.meta_description.toLowerCase().includes(term))
    })

  return (
    <div className="p-6">
      {/* Booking Page Background Image Section */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-2">Book a Session Background Image</h2>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input
          type="text"
          value={bookingBgUrl}
          onChange={e => setBookingBgUrl(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
          placeholder="Paste image URL here"
        />
        <button
          onClick={saveBookingBgUrl}
          disabled={savingBgUrl}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {savingBgUrl ? 'Saving...' : 'Save Image URL'}
        </button>
        {settingsError && (
          <div className="mt-2 text-red-600 text-sm">{settingsError}</div>
        )}
        {bookingBgUrl && (
          <div className="mt-4">
            <span className="block text-xs text-gray-500 mb-1">Preview:</span>
            <img src={bookingBgUrl} alt="Booking background preview" className="rounded-lg max-h-48 border" />
          </div>
        )}
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Content Management</h1>
        <button 
          onClick={createNewPage}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Page
        </button>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Pages</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <button
            onClick={fetchPages}
            className="flex-shrink-0 px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
            title="Refresh pages"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
          <button onClick={fetchPages} className="text-red-600 underline mt-2">
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2">Loading content pages...</span>
        </div>
      ) : filteredPages.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">
            {searchTerm || filter !== 'all' 
              ? 'No pages match your search criteria.' 
              : 'No content pages yet.'}
          </p>
          {searchTerm || filter !== 'all' ? (
            <button
              onClick={() => { setSearchTerm(''); setFilter('all'); }}
              className="px-4 py-2 text-primary-600 underline"
            >
              Clear filters
            </button>
          ) : (
            <button
              onClick={createNewPage} 
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Create Your First Page
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SEO
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPages.map((page) => {
                  const seoColor = (page.seo_score || 0) >= 80 ? 'text-green-600' :
                                   (page.seo_score || 0) >= 60 ? 'text-yellow-600' :
                                   (page.seo_score || 0) >= 40 ? 'text-orange-600' : 'text-red-600'
                  
                  return (
                  <tr key={page.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        {page.featured_image && (
                          <img src={page.featured_image} alt="" className="w-8 h-8 rounded object-cover" />
                        )}
                        <div>
                          <div>{page.title}</div>
                          {page.tags && page.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {page.tags.map(tag => (
                                <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      /{page.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {page.category ? (
                        categories.find(c => c.slug === page.category)?.name || page.category
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          (page.status || (page.published ? 'published' : 'draft')) === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : (page.status || 'draft') === 'review'
                            ? 'bg-yellow-100 text-yellow-800'
                            : (page.status || 'draft') === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {page.status || (page.published ? 'Published' : 'Draft')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {page.seo_score !== undefined ? (
                        <div className={`text-sm font-semibold ${seoColor}`}>
                          {page.seo_score}/100
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(page.updated_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => editPage(page)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit page"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => togglePublish(page)}
                          className={`${
                            page.published 
                              ? 'text-green-600 hover:text-green-900' 
                              : 'text-yellow-600 hover:text-yellow-900'
                          }`}
                          title={page.published ? 'Unpublish' : 'Publish'}
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deletePage(page.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete page"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {page.published && (
                          <>
                            <a
                              href={`/${page.slug}`}
                              target="_blank"
                              className="text-blue-600 hover:text-blue-900"
                              title="View page"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                            <a
                              href={`/admin/page-builder?slug=${encodeURIComponent(page.slug)}`}
                              className="text-primary-600 hover:text-primary-900"
                              title="Edit in Visual Builder"
                            >
                              <Edit className="h-4 w-4" />
                            </a>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content Page Modal */}
      {showPageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                {isNewPage ? 'Create New Page' : 'Edit Page'}
              </h3>
              <button
                onClick={() => setShowPageModal(false)}
                className="text-gray-400 hover:text-gray-500"
                aria-label="Close modal"
                title="Close"
              >
                <X className="h-5 w-5" aria-hidden="true" focusable="false" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    value={pageForm.title}
                    onChange={handleTitleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Page Title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SEO Score
                  </label>
                  <div className={`text-2xl font-bold ${
                    calculateSEOScore(pageForm) >= 80 ? 'text-green-600' :
                    calculateSEOScore(pageForm) >= 60 ? 'text-yellow-600' :
                    calculateSEOScore(pageForm) >= 40 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {calculateSEOScore(pageForm)}/100
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {calculateSEOScore(pageForm) >= 80 ? 'Excellent' :
                     calculateSEOScore(pageForm) >= 60 ? 'Good' :
                     calculateSEOScore(pageForm) >= 40 ? 'Fair' : 'Needs Work'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Slug *
                  </label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-1">/</span>
                    <input
                      type="text"
                      value={pageForm.slug}
                      onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value })}
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                      placeholder="page-url-slug"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={pageForm.category}
                    onChange={(e) => setPageForm({ ...pageForm, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">No Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={pageForm.tags.join(', ')}
                    onChange={(e) => setPageForm({ 
                      ...pageForm, 
                      tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="photography, portrait, wedding"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={pageForm.status}
                    onChange={(e) => setPageForm({ ...pageForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review Needed</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Featured Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pageForm.featured_image}
                    onChange={(e) => setPageForm({ ...pageForm, featured_image: e.target.value })}
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCloudinary(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
                  >
                    📷 Browse Cloudinary
                  </button>
                </div>
                {pageForm.featured_image && (
                  <img src={pageForm.featured_image} alt="Featured" className="mt-2 h-32 w-auto rounded border" />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Publish At (optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={pageForm.publish_at || ''}
                    onChange={(e) => setPageForm({ ...pageForm, publish_at: e.target.value || null })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">Schedule when this page should be published</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unpublish At (optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={pageForm.unpublish_at || ''}
                    onChange={(e) => setPageForm({ ...pageForm, unpublish_at: e.target.value || null })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">Automatically hide this page after this date</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <input
                  type="text"
                  value={pageForm.meta_description}
                  onChange={(e) => setPageForm({ ...pageForm, meta_description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Brief description for search engines"
                  maxLength={160}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {pageForm.meta_description.length}/160 characters
                  {pageForm.meta_description.length >= 120 && pageForm.meta_description.length <= 160 && 
                    <span className="text-green-600 ml-2">✓ Optimal length</span>
                  }
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page Content *
                </label>
                <MarkdownEditor 
                  value={pageForm.content}
                  onChange={(value) => setPageForm({ ...pageForm, content: value })}
                  minHeight="400px"
                  placeholder="Write your page content using Markdown..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  {pageForm.content.length} characters
                  {pageForm.content.length >= 1000 && 
                    <span className="text-green-600 ml-2">✓ Good length for SEO</span>
                  }
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="show_navbar"
                    checked={pageForm.show_navbar}
                    onChange={(e) => setPageForm({ ...pageForm, show_navbar: e.target.checked })}
                    className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                  />
                  <label htmlFor="show_navbar" className="ml-2 text-sm text-gray-700">
                    Show navigation bar on this page
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="published"
                    checked={pageForm.published}
                    onChange={(e) => setPageForm({ ...pageForm, published: e.target.checked })}
                    className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                  />
                  <label htmlFor="published" className="ml-2 text-sm text-gray-700">
                    Publish this page (will be visible to visitors)
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowPageModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={savePage}
                disabled={!pageForm.title || !pageForm.slug || savingPage}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingPage ? 'Saving...' : isNewPage ? 'Create Page' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cloudinary Media Library */}
      {showCloudinary && (
        <CloudinaryMediaLibrary
          onSelect={(result) => {
            setPageForm({ ...pageForm, featured_image: result.url })
            setShowCloudinary(false)
          }}
          onClose={() => setShowCloudinary(false)}
        />
      )}
    </div>
  )
}
