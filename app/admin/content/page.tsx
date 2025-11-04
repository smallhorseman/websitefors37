'use client'

import React, { useState, useEffect } from 'react'
import { Loader2, Plus, Trash2, Edit, Settings, X, ExternalLink, FileText } from 'lucide-react'
import MarkdownEditor from '@/components/MarkdownEditor'
import { revalidateContent } from '@/lib/revalidate'

interface ContentPage {
  id: string
  title: string
  slug: string
  content: string
  meta_description?: string
  published: boolean
  created_at: string
  updated_at: string
}

export default function ContentManagementPage() {
  const [pages, setPages] = useState<ContentPage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPage, setSelectedPage] = useState<ContentPage | null>(null)
  const [showPageModal, setShowPageModal] = useState(false)
  const [pageForm, setPageForm] = useState({
    title: '',
    slug: '',
    content: '',
    meta_description: '',
    published: false
  })
  const [isNewPage, setIsNewPage] = useState(false)
  const [savingPage, setSavingPage] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

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

  // Fetch content pages
  const fetchPages = async () => {
    setLoading(true)
    setError(null)
    try {
      const { supabase } = await import('@/lib/supabase')

      const { data, error } = await supabase
        .from('content_pages')
        .select('*')
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
      
      if (isNewPage) {
        // Create new page
        const { data, error } = await supabase
          .from('content_pages')
          .insert([{
            title: pageForm.title,
            slug: pageForm.slug,
            content: pageForm.content,
            meta_description: pageForm.meta_description,
            published: pageForm.published
          }])
          .select()

        if (error) throw error
        
        // Add to local state
        if (data) setPages([data[0], ...pages])
      } else {
        // Update existing page
        const { error } = await supabase
          .from('content_pages')
          .update({
            title: pageForm.title,
            slug: pageForm.slug,
            content: pageForm.content,
            meta_description: pageForm.meta_description,
            published: pageForm.published,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedPage!.id)

        if (error) throw error
        
        // Update local state
        setPages(pages.map(page => 
          page.id === selectedPage!.id 
            ? { ...page, ...pageForm, updated_at: new Date().toISOString() } 
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
    setSelectedPage(page)
    setPageForm({
      title: page.title,
      slug: page.slug,
      content: page.content || '',
      meta_description: page.meta_description || '',
      published: page.published
    })
    setIsNewPage(false)
    setShowPageModal(true)
  }

  // Open modal to create a new page
  const createNewPage = () => {
    setSelectedPage(null)
    setPageForm({
      title: '',
      slug: '',
      content: '',
      meta_description: '',
      published: false
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
      // Apply status filter
      if (filter === 'published') return page.published
      if (filter === 'draft') return !page.published
      return true // 'all' filter
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
        <div className="flex-shrink-0">
          <label htmlFor="page-filter" className="sr-only">Filter pages</label>
          <select
            id="page-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Filter pages"
          >
            <option value="all">All Pages</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <button
          onClick={fetchPages}
          className="flex-shrink-0 px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
          title="Refresh pages"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>
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
                    Status
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
                {filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {page.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      /{page.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          page.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {page.published ? 'Published' : 'Draft'}
                      </span>
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
                ))}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
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
    </div>
  )
}
