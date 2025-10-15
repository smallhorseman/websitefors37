'use client'

import React, { useState, useEffect } from 'react'
import { Users, FileText, Settings as SettingsIcon, X, Mail, Phone, Calendar, DollarSign, MessageSquare, Trash2, Edit, PhoneCall, MessageCircle, Loader2, Plus, Clock, Image as ImageIcon, Eye } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { BlogPost, CommunicationLog, ContentPage, GalleryImage, Settings as SiteSettings } from '@/lib/supabase'
import MarkdownEditor from '@/components/MarkdownEditor'
import ImageUploader from '@/components/ImageUploader'

const Images = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  service_interest: string
  budget_range?: string
  event_date?: string
  status: 'new' | 'contacted' | 'qualified' | 'converted'
  created_at: string
  notes?: string
}

// Using imported types from @/lib/supabase

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('leads')
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [notes, setNotes] = useState('')
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [showLogModal, setShowLogModal] = useState(false)
  const [logs, setLogs] = useState<CommunicationLog[]>([])
  const [newLog, setNewLog] = useState({
    type: 'note' as CommunicationLog['type'],
    subject: '',
    content: '',
    direction: 'outbound' as CommunicationLog['direction']
  })
  const [pages, setPages] = useState<ContentPage[]>([])
  const [loadingPages, setLoadingPages] = useState(false)
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
  const [pageError, setPageError] = useState<string | null>(null)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [showPostModal, setShowPostModal] = useState(false)
  const [postForm, setPostForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    meta_description: '',
    published: false
  })
  const [isNewPost, setIsNewPost] = useState(false)
  const [savingPost, setSavingPost] = useState(false)
  const [postError, setPostError] = useState<string | null>(null)

  const fetchLeads = async () => {
    try {
      setError(null)
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      console.log('Fetched leads:', data)
      setLeads(data || [])
    } catch (error: any) {
      console.error('Error fetching leads:', error)
      setError(error.message || 'Failed to load leads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const updateLeadStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', id)

      if (error) throw error
      
      // Update local state
      setLeads(prev => prev.map(lead => 
        lead.id === id ? { ...lead, status: status as Lead['status'] } : lead
      ))
    } catch (error) {
      console.error('Error updating lead:', error)
      alert('Failed to update lead status')
    }
  }

  const deleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return
    
    setIsDeleting(id)
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setLeads(prev => prev.filter(lead => lead.id !== id))
      setShowLeadModal(false)
    } catch (error) {
      console.error('Error deleting lead:', error)
      alert('Failed to delete lead')
    } finally {
      setIsDeleting(null)
    }
  }

  const updateLeadNotes = async () => {
    if (!selectedLead) return
    
    try {
      const { error } = await supabase
        .from('leads')
        .update({ notes })
        .eq('id', selectedLead.id)

      if (error) throw error
      
      setLeads(prev => prev.map(lead => 
        lead.id === selectedLead.id ? { ...lead, notes } : lead
      ))
      setSelectedLead({ ...selectedLead, notes })
      setShowNotesModal(false)
      setNotes('')
    } catch (error) {
      console.error('Error updating notes:', error)
      alert('Failed to update notes')
    }
  }

  const fetchCommunicationLogs = async (leadId: string) => {
    try {
      const { data, error } = await supabase
        .from('communication_logs')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setLogs(data || [])
    } catch (error) {
      console.error('Error fetching logs:', error)
    }
  }

  const addCommunicationLog = async () => {
    if (!selectedLead || !newLog.content.trim()) return

    try {
      const { error } = await supabase
        .from('communication_logs')
        .insert([{
          lead_id: selectedLead.id,
          type: newLog.type,
          subject: newLog.subject,
          content: newLog.content,
          direction: newLog.direction,
          created_by: 'admin'
        }])

      if (error) throw error

      // Refresh logs
      await fetchCommunicationLogs(selectedLead.id)
      
      // Reset form
      setNewLog({
        type: 'note',
        subject: '',
        content: '',
        direction: 'outbound'
      })
      setShowLogModal(false)

      // Update lead status if it's new
      if (selectedLead.status === 'new') {
        await updateLeadStatus(selectedLead.id, 'contacted')
      }
    } catch (error) {
      console.error('Error adding log:', error)
      alert('Failed to add communication log')
    }
  }

  const logCommunication = async (lead: Lead, type: CommunicationLog['type'], content: string) => {
    try {
      await supabase
        .from('communication_logs')
        .insert([{
          lead_id: lead.id,
          type,
          content,
          direction: 'outbound',
          created_by: 'admin'
        }])

      if (lead.status === 'new') {
        await updateLeadStatus(lead.id, 'contacted')
      }
    } catch (error) {
      console.error('Error logging communication:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'contacted': return 'bg-yellow-100 text-yellow-800'
      case 'qualified': return 'bg-green-100 text-green-800'
      case 'converted': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const viewLeadDetails = async (lead: Lead) => {
    setSelectedLead(lead)
    setShowLeadModal(true)
    await fetchCommunicationLogs(lead.id)
  }

  const openNotesModal = (lead: Lead) => {
    setSelectedLead(lead)
    setNotes(lead.notes || '')
    setShowNotesModal(true)
  }

  const getLogIcon = (type: CommunicationLog['type']) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />
      case 'phone': return <Phone className="h-4 w-4" />
      case 'sms': return <MessageCircle className="h-4 w-4" />
      case 'meeting': return <Calendar className="h-4 w-4" />
      case 'note': return <MessageSquare className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getLogColor = (type: CommunicationLog['type']) => {
    switch (type) {
      case 'email': return 'text-blue-600'
      case 'phone': return 'text-green-600'
      case 'sms': return 'text-purple-600'
      case 'meeting': return 'text-orange-600'
      case 'note': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const tabs = [
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'gallery', label: 'Gallery', icon: Images },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ]

  // Fetch content pages
  const fetchPages = async () => {
    if (activeTab !== 'content') return;
    
    setLoadingPages(true)
    setPageError(null)
    try {
      const { data, error } = await supabase
        .from('content_pages')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setPages(data || [])
    } catch (error: any) {
      console.error('Error fetching pages:', error)
      setPageError(error.message || 'Failed to load content pages')
    } finally {
      setLoadingPages(false)
    }
  }

  // Effect for fetching pages when tab changes
  useEffect(() => {
    if (activeTab === 'content') {
      fetchPages()
    }
  }, [activeTab])

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
    setSavingPage(true)
    setPageError(null)
    
    try {
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
    } catch (error: any) {
      console.error('Error saving page:', error)
      setPageError(error.message || 'Failed to save page')
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
      const { error } = await supabase
        .from('content_pages')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Update local state
      setPages(pages.filter(page => page.id !== id))
    } catch (error) {
      console.error('Error deleting page:', error)
      alert('Failed to delete page')
    }
  }

  // Open edit modal for a page
  const editPage = (page: ContentPage) => {
    setSelectedPage(page)
    setPageForm({
      title: page.title,
      slug: page.slug,
      content: page.content,
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
      const { error } = await supabase
        .from('content_pages')
        .update({ published: !page.published })
        .eq('id', page.id)

      if (error) throw error
      
      // Update local state
      setPages(pages.map(p => 
        p.id === page.id ? { ...p, published: !page.published } : p
      ))
    } catch (error) {
      console.error('Error toggling publish status:', error)
      alert('Failed to update publish status')
    }
  }

  // Fetch blog posts
  const fetchBlogPosts = async () => {
    if (activeTab !== 'blog') return;
    
    setLoadingPosts(true)
    setPostError(null)
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setBlogPosts(data || [])
    } catch (error: any) {
      console.error('Error fetching blog posts:', error)
      setPostError(error.message || 'Failed to load blog posts')
    } finally {
      setLoadingPosts(false)
    }
  }

  // Effect for fetching blog posts when tab changes
  useEffect(() => {
    if (activeTab === 'blog') {
      fetchBlogPosts()
    }
  }, [activeTab])

  // -------------------- Gallery --------------------
  const [gallery, setGallery] = useState<GalleryImage[]>([])
  const [loadingGallery, setLoadingGallery] = useState(false)
  const [galleryError, setGalleryError] = useState<string | null>(null)
  const [showGalleryModal, setShowGalleryModal] = useState(false)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    description: '',
    image_url: '',
    category: 'general',
    featured: false,
    display_order: 0,
  })

  const fetchGallery = async () => {
    if (activeTab !== 'gallery') return
    setLoadingGallery(true)
    setGalleryError(null)
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })
      if (error) throw error
      setGallery(data || [])
    } catch (e: any) {
      console.error(e)
      setGalleryError(e.message || 'Failed to load gallery')
    } finally {
      setLoadingGallery(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'gallery') fetchGallery()
  }, [activeTab])

  const openNewGalleryModal = () => {
    setEditingImage(null)
    setGalleryForm({ title: '', description: '', image_url: '', category: 'general', featured: false, display_order: gallery.length })
    setShowGalleryModal(true)
  }

  const openEditGalleryModal = (img: GalleryImage) => {
    setEditingImage(img)
    setGalleryForm({
      title: img.title,
      description: img.description || '',
      image_url: img.image_url,
      category: img.category,
      featured: img.featured,
      display_order: img.display_order ?? 0,
    })
    setShowGalleryModal(true)
  }

  const saveGalleryItem = async () => {
    try {
      if (editingImage) {
        const { error } = await supabase
          .from('gallery_images')
          .update({ ...galleryForm, updated_at: new Date().toISOString() })
          .eq('id', editingImage.id)
        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('gallery_images')
          .insert([{ ...galleryForm }])
          .select('*')
        if (error) throw error
        if (data) setGallery([...(gallery || []), data[0] as GalleryImage])
      }
      setShowGalleryModal(false)
      fetchGallery()
    } catch (e) {
      alert('Failed to save image')
    }
  }

  const deleteGalleryItem = async (id: string) => {
    if (!confirm('Delete this image?')) return
    try {
      const { error } = await supabase.from('gallery_images').delete().eq('id', id)
      if (error) throw error
      setGallery(gallery.filter(g => g.id !== id))
    } catch (e) {
      alert('Failed to delete image')
    }
  }

  const moveGalleryItem = async (id: string, dir: -1 | 1) => {
    const idx = gallery.findIndex(g => g.id === id)
    if (idx === -1) return
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= gallery.length) return
    const newOrder = [...gallery]
    const [item] = newOrder.splice(idx, 1)
    newOrder.splice(newIdx, 0, item)
    // Reassign display_order
    const updates = newOrder.map((g, i) => ({ id: g.id, display_order: i }))
    setGallery(newOrder.map((g, i) => ({ ...g, display_order: i })))
    // Persist
    for (const u of updates) {
      await supabase.from('gallery_images').update({ display_order: u.display_order }).eq('id', u.id)
    }
  }

  // -------------------- Settings --------------------
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsError, setSettingsError] = useState<string | null>(null)

  const loadSettings = async () => {
    if (activeTab !== 'settings') return
    setSettingsError(null)
    try {
      const { data, error } = await supabase.from('settings').select('*').limit(1).maybeSingle()
      if (error) throw error
      setSettings(data as SiteSettings)
    } catch (e: any) {
      console.error(e)
      setSettingsError(e.message || 'Failed to load settings')
    }
  }

  useEffect(() => {
    if (activeTab === 'settings') loadSettings()
  }, [activeTab])

  const saveSettings = async () => {
    if (!settings) return
    setSettingsSaving(true)
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ ...settings, id: settings.id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
      if (error) throw error
      alert('Settings saved')
    } catch (e) {
      alert('Failed to save settings')
    } finally {
      setSettingsSaving(false)
    }
  }

  // Create or update a blog post
  const savePost = async () => {
    setSavingPost(true)
    setPostError(null)
    
    try {
      if (isNewPost) {
        // Create new post
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([{
            title: postForm.title,
            slug: postForm.slug,
            excerpt: postForm.excerpt,
            content: postForm.content,
            featured_image: postForm.featured_image,
            meta_description: postForm.meta_description,
            published: postForm.published
          }])
          .select()

        if (error) throw error
        
        // Add to local state
        if (data) setBlogPosts([data[0], ...blogPosts])
      } else {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: postForm.title,
            slug: postForm.slug,
            excerpt: postForm.excerpt,
            content: postForm.content,
            featured_image: postForm.featured_image,
            meta_description: postForm.meta_description,
            published: postForm.published,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedPost!.id)

        if (error) throw error
        
        // Update local state
        setBlogPosts(blogPosts.map(post => 
          post.id === selectedPost!.id 
            ? { ...post, ...postForm, updated_at: new Date().toISOString() } 
            : post
        ))
      }
      
      // Close modal and reset form
      setShowPostModal(false)
      setSelectedPost(null)
    } catch (error: any) {
      console.error('Error saving post:', error)
      setPostError(error.message || 'Failed to save post')
    } finally {
      setSavingPost(false)
    }
  }

  // Delete a blog post
  const deletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Update local state
      setBlogPosts(blogPosts.filter(post => post.id !== id))
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post')
    }
  }

  // Open edit modal for a blog post
  const editPost = (post: BlogPost) => {
    setSelectedPost(post)
    setPostForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      featured_image: post.featured_image || '',
      meta_description: post.meta_description || '',
      published: post.published
    })
    setIsNewPost(false)
    setShowPostModal(true)
  }

  // Open modal to create a new blog post
  const createNewPost = () => {
    setSelectedPost(null)
    setPostForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image: '',
      meta_description: '',
      published: false
    })
    setIsNewPost(true)
    setShowPostModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Studio 37 Admin Dashboard</h1>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">Error loading data:</p>
            <p>{error}</p>
            <button onClick={fetchLeads} className="text-red-600 underline mt-2">
              Try again
            </button>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Leads</h3>
            <p className="text-2xl font-bold mt-2">{leads.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">New Leads</h3>
            <p className="text-2xl font-bold mt-2 text-blue-600">
              {leads.filter(l => l.status === 'new').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Qualified</h3>
            <p className="text-2xl font-bold mt-2 text-green-600">
              {leads.filter(l => l.status === 'qualified').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Converted</h3>
            <p className="text-2xl font-bold mt-2 text-purple-600">
              {leads.filter(l => l.status === 'converted').length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-6 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'leads' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Lead Management</h2>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                    <span className="ml-2">Loading leads...</span>
                  </div>
                ) : leads.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No leads yet. They'll appear here when customers submit forms or use the chat.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Service
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Budget
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quick Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {leads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {lead.name}
                                </div>
                                <div className="text-sm text-gray-500">{lead.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {lead.service_interest}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {lead.budget_range || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                aria-label="Lead status"
                                value={lead.status}
                                onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                className={`text-xs px-2 py-1 rounded-full border-0 ${getStatusColor(lead.status)}`}
                              >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="qualified">Qualified</option>
                                <option value="converted">Converted</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(lead.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => viewLeadDetails(lead)}
                                  className="text-primary-600 hover:text-primary-900"
                                  title="View details"
                                >
                                  <SettingsIcon className="h-4 w-4" />
                                </button>
                                <a
                                  href={`mailto:${lead.email}`}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Send email"
                                >
                                  <Mail className="h-4 w-4" />
                                </a>
                                {lead.phone && (
                                  <>
                                    <a
                                      href={`tel:${lead.phone}`}
                                      className="text-green-600 hover:text-green-900"
                                      title="Call"
                                    >
                                      <PhoneCall className="h-4 w-4" />
                                    </a>
                                    <a
                                      href={`sms:${lead.phone}`}
                                      className="text-purple-600 hover:text-purple-900"
                                      title="Send text"
                                    >
                                      <MessageCircle className="h-4 w-4" />
                                    </a>
                                  </>
                                )}
                                <button
                                  onClick={() => openNotesModal(lead)}
                                  className="text-gray-600 hover:text-gray-900"
                                  title="Add/edit notes"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'content' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Content Management</h2>
                  <button 
                    onClick={createNewPage}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    New Page
                  </button>
                </div>

                {pageError && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                    <p className="font-semibold">Error:</p>
                    <p>{pageError}</p>
                    <button onClick={fetchPages} className="text-red-600 underline mt-2">
                      Try again
                    </button>
                  </div>
                )}

                {loadingPages ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                    <span className="ml-2">Loading content pages...</span>
                  </div>
                ) : pages.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No content pages yet.</p>
                    <button
                      onClick={createNewPage} 
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Create Your First Page
                    </button>
                  </div>
                ) : (
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
                        {pages.map((page) => (
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
                                  <SettingsIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => deletePage(page.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Delete page"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                                {page.published && (
                                  <a
                                    href={`/${page.slug}`}
                                    target="_blank"
                                    className="text-blue-600 hover:text-blue-900"
                                    title="View page"
                                    rel="noopener noreferrer"
                                  >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
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
              </div>
            )}

            {activeTab === 'blog' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Blog Management</h2>
                  <button 
                    onClick={() => {
                      setSelectedPost(null)
                      setPostForm({
                        title: '',
                        slug: '',
                        excerpt: '',
                        content: '',
                        featured_image: '',
                        meta_description: '',
                        published: false
                      })
                      setIsNewPost(true)
                      setShowPostModal(true)
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    New Post
                  </button>
                </div>

                {postError && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                    <p className="font-semibold">Error:</p>
                    <p>{postError}</p>
                    <button onClick={fetchBlogPosts} className="text-red-600 underline mt-2">
                      Try again
                    </button>
                  </div>
                )}

                {loadingPosts ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                    <span className="ml-2">Loading blog posts...</span>
                  </div>
                ) : blogPosts.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No blog posts yet.</p>
                    <button
                      onClick={() => {
                        setSelectedPost(null)
                        setPostForm({
                          title: '',
                          slug: '',
                          excerpt: '',
                          content: '',
                          featured_image: '',
                          meta_description: '',
                          published: false
                        })
                        setIsNewPost(true)
                        setShowPostModal(true)
                      }}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Create Your First Post
                    </button>
                  </div>
                ) : (
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
                        {blogPosts.map((post) => (
                          <tr key={post.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {post.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                              /blog/{post.slug}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span 
                                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                  post.published 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {post.published ? 'Published' : 'Draft'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(post.updated_at).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setSelectedPost(post)
                                    setPostForm({
                                      title: post.title,
                                      slug: post.slug,
                                      excerpt: post.excerpt || '',
                                      content: post.content,
                                      featured_image: post.featured_image || '',
                                      meta_description: post.meta_description || '',
                                      published: post.published
                                    })
                                    setIsNewPost(false)
                                    setShowPostModal(true)
                                  }}
                                  className="text-primary-600 hover:text-primary-900"
                                  title="Edit post"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                {post.published && (
                                  <a
                                    href={`/blog/${post.slug}`}
                                    target="_blank"
                                    className="text-blue-600 hover:text-blue-900"
                                    title="View post"
                                    rel="noopener noreferrer"
                                  >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
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
              </div>
            )}

            {activeTab === 'gallery' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Gallery Management</h2>
                  <button onClick={openNewGalleryModal} className="px-3 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Image
                  </button>
                </div>

                {galleryError && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">{galleryError}</div>
                )}

                {loadingGallery ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                    <span className="ml-2">Loading gallery...</span>
                  </div>
                ) : gallery.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No images yet.</p>
                    <button onClick={openNewGalleryModal} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Upload Your First Image</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gallery.map((img) => (
                      <div key={img.id} className="border rounded-lg overflow-hidden bg-white">
                        <div className="relative h-40 bg-gray-100">
                          {img.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={img.image_url} alt={img.title} className="absolute inset-0 w-full h-full object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400"><ImageIcon className="h-8 w-8"/></div>
                          )}
                        </div>
                        <div className="p-3">
                          <div className="font-medium truncate" title={img.title}>{img.title}</div>
                          <div className="text-xs text-gray-500 mb-2">{img.category}{img.featured ? ' • Featured' : ''}</div>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              <button onClick={() => openEditGalleryModal(img)} className="text-primary-600 hover:text-primary-800" title="Edit"><Edit className="h-4 w-4"/></button>
                              <button onClick={() => deleteGalleryItem(img.id)} className="text-red-600 hover:text-red-800" title="Delete"><Trash2 className="h-4 w-4"/></button>
                              <a href={img.image_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800" title="Open"><Eye className="h-4 w-4"/></a>
                            </div>
                            <div className="flex gap-1">
                              <button onClick={() => moveGalleryItem(img.id, -1)} className="text-gray-500 hover:text-gray-800" title="Move up">↑</button>
                              <button onClick={() => moveGalleryItem(img.id, 1)} className="text-gray-500 hover:text-gray-800" title="Move down">↓</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Gallery Modal */}
                {showGalleryModal && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{editingImage ? 'Edit Image' : 'Add Image'}</h3>
                        <button onClick={() => setShowGalleryModal(false)} className="text-gray-400 hover:text-gray-600" aria-label="Close modal" title="Close modal"><X className="h-5 w-5"/></button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="g-title">Title *</label>
                          <input id="g-title" className="w-full border rounded px-3 py-2" value={galleryForm.title} onChange={(e)=>setGalleryForm({...galleryForm, title: e.target.value})} placeholder="Image title" required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="g-desc">Description</label>
                          <textarea id="g-desc" className="w-full border rounded px-3 py-2" rows={3} value={galleryForm.description} onChange={(e)=>setGalleryForm({...galleryForm, description: e.target.value})} placeholder="Optional description"/>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                          <div className="space-y-3">
                            <ImageUploader onImageUrl={(url)=>setGalleryForm({...galleryForm, image_url: url})} />
                            <div className="relative">
                              <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                              </div>
                              <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">or</span>
                              </div>
                            </div>
                            <div>
                              <label htmlFor="g-url" className="block text-sm text-gray-600 mb-1">Image URL</label>
                              <input 
                                id="g-url" 
                                type="url"
                                className="w-full border rounded px-3 py-2" 
                                value={galleryForm.image_url} 
                                onChange={(e)=>setGalleryForm({...galleryForm, image_url: e.target.value})} 
                                placeholder="https://example.com/image.jpg"
                              />
                            </div>
                          </div>
                          {galleryForm.image_url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={galleryForm.image_url} alt="Preview" className="mt-2 h-36 w-full object-cover rounded" />
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="g-category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input id="g-category" className="w-full border rounded px-3 py-2" value={galleryForm.category} onChange={(e)=>setGalleryForm({...galleryForm, category: e.target.value})} placeholder="general / portraits / events" />
                          </div>
                          <div className="flex items-center mt-1">
                            <input id="g-featured" type="checkbox" className="h-4 w-4" checked={galleryForm.featured} onChange={(e)=>setGalleryForm({...galleryForm, featured: e.target.checked})} />
                            <label htmlFor="g-featured" className="ml-2 text-sm">Featured</label>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end gap-2">
                        <button onClick={()=>setShowGalleryModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                        <button onClick={saveGalleryItem} disabled={!galleryForm.title || !galleryForm.image_url} className="px-4 py-2 bg-primary-600 text-white rounded disabled:opacity-50">{editingImage ? 'Save Changes' : 'Add Image'}</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Settings</h2>
                  <button onClick={saveSettings} disabled={!settings || settingsSaving} className="px-4 py-2 bg-primary-600 text-white rounded disabled:opacity-50">{settingsSaving ? 'Saving…' : 'Save'}</button>
                </div>
                {settingsError && <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">{settingsError}</div>}
                {!settings ? (
                  <div className="flex items-center text-gray-500"><Loader2 className="h-4 w-4 animate-spin mr-2"/> Loading settings…</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded">
                      <h3 className="font-semibold mb-3">General</h3>
                      <label className="block text-sm mb-1" htmlFor="s-name">Site Name</label>
                      <input id="s-name" className="w-full border rounded px-3 py-2 mb-3" value={settings.site_name} onChange={(e)=>setSettings({...settings, site_name: e.target.value})} />
                      <label className="block text-sm mb-1" htmlFor="s-email">Contact Email</label>
                      <input id="s-email" type="email" className="w-full border rounded px-3 py-2 mb-3" value={settings.contact_email} onChange={(e)=>setSettings({...settings, contact_email: e.target.value})} />
                      <label className="block text-sm mb-1" htmlFor="s-phone">Contact Phone</label>
                      <input id="s-phone" className="w-full border rounded px-3 py-2" value={settings.contact_phone || ''} onChange={(e)=>setSettings({...settings, contact_phone: e.target.value})} />
                    </div>

                    <div className="bg-gray-50 p-4 rounded">
                      <h3 className="font-semibold mb-3">Address & Social</h3>
                      <label className="block text-sm mb-1" htmlFor="s-address">Business Address</label>
                      <textarea id="s-address" className="w-full border rounded px-3 py-2 mb-3" rows={3} value={settings.business_address || ''} onChange={(e)=>setSettings({...settings, business_address: e.target.value})}/>
                      <label className="block text-sm mb-1" htmlFor="s-fb">Facebook</label>
                      <input id="s-fb" className="w-full border rounded px-3 py-2 mb-2" value={settings.social_facebook || ''} onChange={(e)=>setSettings({...settings, social_facebook: e.target.value})} />
                      <label className="block text-sm mb-1" htmlFor="s-ig">Instagram</label>
                      <input id="s-ig" className="w-full border rounded px-3 py-2 mb-2" value={settings.social_instagram || ''} onChange={(e)=>setSettings({...settings, social_instagram: e.target.value})} />
                      <label className="block text-sm mb-1" htmlFor="s-tw">Twitter/X</label>
                      <input id="s-tw" className="w-full border rounded px-3 py-2" value={settings.social_twitter || ''} onChange={(e)=>setSettings({...settings, social_twitter: e.target.value})} />
                    </div>

                    <div className="bg-gray-50 p-4 rounded">
                      <h3 className="font-semibold mb-3">SEO</h3>
                      <label className="block text-sm mb-1" htmlFor="s-seo-title">Title Template</label>
                      <input id="s-seo-title" className="w-full border rounded px-3 py-2 mb-3" value={settings.seo_title_template || ''} onChange={(e)=>setSettings({...settings, seo_title_template: e.target.value})} />
                      <label className="block text-sm mb-1" htmlFor="s-seo-desc">Default Description</label>
                      <textarea id="s-seo-desc" className="w-full border rounded px-3 py-2" rows={3} value={settings.seo_default_description || ''} onChange={(e)=>setSettings({...settings, seo_default_description: e.target.value})}/>
                    </div>

                    <div className="bg-gray-50 p-4 rounded">
                      <h3 className="font-semibold mb-3">Theme</h3>
                      <label className="block text-sm mb-1" htmlFor="s-color-1">Primary Color</label>
                      <input id="s-color-1" type="color" className="w-16 h-10 p-0 border rounded mb-3" value={settings.theme_primary_color || '#b46e14'} onChange={(e)=>setSettings({...settings, theme_primary_color: e.target.value})} />
                      <label className="block text-sm mb-1" htmlFor="s-color-2">Secondary Color</label>
                      <input id="s-color-2" type="color" className="w-16 h-10 p-0 border rounded" value={settings.theme_secondary_color || '#a17a07'} onChange={(e)=>setSettings({...settings, theme_secondary_color: e.target.value})} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Lead Details Modal */}
        {showLeadModal && selectedLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Lead Details</h3>
                <button
                  onClick={() => setShowLeadModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                  title="Close modal"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lead Information */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-lg">{selectedLead.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <p><span className={`px-2 py-1 text-sm rounded-full ${getStatusColor(selectedLead.status)}`}>
                        {selectedLead.status}
                      </span></p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p>{selectedLead.email}</p>
                      </div>
                    </div>
                    {selectedLead.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <div>
                          <label className="text-sm font-medium text-gray-500">Phone</label>
                          <p>{selectedLead.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Service Interest</label>
                      <p className="capitalize">{selectedLead.service_interest}</p>
                    </div>
                    {selectedLead.budget_range && (
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <div>
                          <label className="text-sm font-medium text-gray-500">Budget</label>
                          <p>{selectedLead.budget_range}</p>
                        </div>
                      </div>
                    )}
                    {selectedLead.event_date && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <label className="text-sm font-medium text-gray-500">Event Date</label>
                          <p>{new Date(selectedLead.event_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                      <label className="text-sm font-medium text-gray-500">Message</label>
                    </div>
                    <p className="bg-gray-50 p-3 rounded-lg">{selectedLead.message}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p>{new Date(selectedLead.created_at).toLocaleString()}</p>
                  </div>

                  {selectedLead.notes && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Notes</label>
                      <p className="bg-gray-50 p-3 rounded-lg">{selectedLead.notes}</p>
                    </div>
                  )}
                </div>

                {/* Communication History */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold">Communication History</h4>
                    <button
                      onClick={() => setShowLogModal(true)}
                      className="px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Add Log
                    </button>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {logs.length === 0 ? (
                      <p className="text-gray-500 text-sm">No communication history yet</p>
                    ) : (
                      logs.map((log) => (
                        <div key={log.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className={`${getLogColor(log.type)} mt-1`}>
                              {getLogIcon(log.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium capitalize">
                                  {log.type}
                                </span>
                                {log.direction && (
                                  <span className="text-xs text-gray-500 capitalize">
                                    ({log.direction})
                                  </span>
                                )}
                                <span className="text-xs text-gray-500">
                                  {new Date(log.created_at).toLocaleString()}
                                </span>
                              </div>
                              {log.subject && (
                                <p className="text-sm font-medium mb-1">{log.subject}</p>
                              )}
                              <p className="text-sm text-gray-600 whitespace-pre-wrap">{log.content}</p>
                            </div>
                          </div>
                        </div>
                  ))
                )}
              </div>
            </div>
          </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => deleteLead(selectedLead.id)}
                disabled={isDeleting === selectedLead.id}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting === selectedLead.id ? 'Deleting...' : 'Delete Lead'}
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLeadModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                {selectedLead.phone && (
                  <a
                    href={`tel:${selectedLead.phone}`}
                    onClick={() => logCommunication(selectedLead, 'phone', 'Outbound phone call')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Call
                  </a>
                )}
                <a
                  href={`mailto:${selectedLead.email}`}
                  onClick={() => logCommunication(selectedLead, 'email', 'Sent email')}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Send Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Communication Log Modal */}
      {showLogModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Add Communication Log</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="log-type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  id="log-type"
                  value={newLog.type}
                  onChange={(e) => setNewLog({ ...newLog, type: e.target.value as CommunicationLog['type'] })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="note">Note</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone Call</option>
                  <option value="sms">Text Message</option>
                  <option value="meeting">Meeting</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="log-direction" className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
                <select
                  id="log-direction"
                  value={newLog.direction}
                  onChange={(e) => setNewLog({ ...newLog, direction: e.target.value as CommunicationLog['direction'] })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="outbound">Outbound</option>
                  <option value="inbound">Inbound</option>
                  <option value="internal">Internal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject (Optional)</label>
                <input
                  type="text"
                  value={newLog.subject}
                  onChange={(e) => setNewLog({ ...newLog, subject: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Brief subject or title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                <textarea
                  value={newLog.content}
                  onChange={(e) => setNewLog({ ...newLog, content: e.target.value })}
                  className="w-full h-32 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Describe the communication..."
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowLogModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addCommunicationLog}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                disabled={!newLog.content.trim()}
              >
                Add Log
              </button>
            </div>
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
                title="Close modal"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {pageError && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                {pageError}
              </div>
            )}

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
                disabled={!pageForm.title || !pageForm.slug || !pageForm.content || savingPage}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingPage ? 'Saving...' : isNewPage ? 'Create Page' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blog Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                {isNewPost ? 'Create New Post' : 'Edit Post'}
              </h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-gray-400 hover:text-gray-500"
                title="Close modal"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {postError && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                {postError}
              </div>
            )}

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Post Title *
                  </label>
                  <input
                    type="text"
                    value={postForm.title}
                    onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Post Title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Slug *
                  </label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-1">/blog/</span>
                    <input
                      type="text"
                      value={postForm.slug}
                      onChange={(e) => setPostForm({ ...postForm, slug: e.target.value })}
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                      placeholder="post-url-slug"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt
                </label>
                <textarea
                  value={postForm.excerpt}
                  onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })}
                  className="w-full h-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Brief excerpt for the post"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <input
                  type="text"
                  value={postForm.meta_description}
                  onChange={(e) => setPostForm({ ...postForm, meta_description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Brief description for search engines"
                  maxLength={160}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {postForm.meta_description.length}/160 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Featured Image URL
                </label>
                <input
                  type="text"
                  value={postForm.featured_image}
                  onChange={(e) => setPostForm({ ...postForm, featured_image: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Post Content *
                </label>
                <MarkdownEditor 
                  value={postForm.content}
                  onChange={(value) => setPostForm({ ...postForm, content: value })}
                  minHeight="400px"
                  placeholder="Write your post content using Markdown..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={postForm.published}
                  onChange={(e) => setPostForm({ ...postForm, published: e.target.checked })}
                  className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor="published" className="ml-2 text-sm text-gray-700">
                  Publish this post (will be visible to visitors)
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowPostModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={savePost}
                disabled={!postForm.title || !postForm.slug || !postForm.content || savingPost}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingPost ? 'Saving...' : isNewPost ? 'Create Post' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
