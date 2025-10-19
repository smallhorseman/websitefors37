'use client'

import React, { useState, useEffect } from 'react'
import { Loader2, Plus, Trash2, Edit, Settings, X, ExternalLink, FileText, Eye, Calendar, User, Tag, Save } from 'lucide-react'
import MarkdownEditor from '@/components/MarkdownEditor'
import { supabase } from '@/lib/supabase'
import type { BlogPost } from '@/lib/supabase'

export default function BlogManagementPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [showPostModal, setShowPostModal] = useState(false)
  const [postForm, setPostForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    meta_description: '',
    meta_keywords: '',
    author: 'Admin',
    category: '',
    tags: [] as string[],
    published: false
  })
  const [isNewPost, setIsNewPost] = useState(false)
  const [savingPost, setSavingPost] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [tagInput, setTagInput] = useState('')

  // Fetch blog posts
  const fetchBlogPosts = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setBlogPosts(data || [])
    } catch (error: any) {
      console.error('Error fetching blog posts:', error)
      setError(error.message || 'Failed to load blog posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }

  // Handle title change and auto-generate slug for new posts
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setPostForm({
      ...postForm,
      title,
      slug: isNewPost ? generateSlug(title) : postForm.slug
    })
  }

  // Handle tag management
  const addTag = () => {
    if (tagInput.trim() && !postForm.tags.includes(tagInput.trim())) {
      setPostForm({
        ...postForm,
        tags: [...postForm.tags, tagInput.trim()]
      })
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setPostForm({
      ...postForm,
      tags: postForm.tags.filter(tag => tag !== tagToRemove)
    })
  }

  // Create or update a blog post
  const savePost = async () => {
    setSavingPost(true)
    setError(null)
    
    try {
      const postData = {
        title: postForm.title,
        slug: postForm.slug,
        excerpt: postForm.excerpt,
        content: postForm.content,
        featured_image: postForm.featured_image,
        meta_description: postForm.meta_description,
        meta_keywords: postForm.meta_keywords,
        author: postForm.author,
        category: postForm.category,
        tags: postForm.tags,
        published: postForm.published,
        published_at: postForm.published ? new Date().toISOString() : null
      }

      if (isNewPost) {
        // Create new post
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([postData])
          .select()

        if (error) throw error
        
        // Add to local state
        if (data) setBlogPosts([data[0], ...blogPosts])
      } else {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update({
            ...postData,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedPost!.id)

        if (error) throw error
        
        // Update local state
        setBlogPosts(blogPosts.map(post => 
          post.id === selectedPost!.id 
            ? { ...post, ...postData, updated_at: new Date().toISOString(), published_at: postData.published_at || undefined } 
            : post
        ))
      }
      
      // Close modal and reset form
      setShowPostModal(false)
      setSelectedPost(null)
      resetForm()
    } catch (error: any) {
      console.error('Error saving post:', error)
      setError(error.message || 'Failed to save post')
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

  // Reset form
  const resetForm = () => {
    setPostForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image: '',
      meta_description: '',
      meta_keywords: '',
      author: 'Admin',
      category: '',
      tags: [],
      published: false
    })
    setTagInput('')
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
      meta_keywords: post.meta_keywords || '',
      author: post.author_id || 'Admin',
      category: post.category || '',
      tags: post.tags || [],
      published: post.published
    })
    setIsNewPost(false)
    setShowPostModal(true)
  }

  // Open modal to create a new blog post
  const createNewPost = () => {
    setSelectedPost(null)
    resetForm()
    setIsNewPost(true)
    setShowPostModal(true)
  }

  // Toggle post publish status
  const togglePublish = async (post: BlogPost) => {
    try {
      const updateData = {
        published: !post.published,
        published_at: !post.published ? new Date().toISOString() : null
      }

      const { error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', post.id)

      if (error) throw error
      
      // Update local state
      setBlogPosts(blogPosts.map(p => 
        p.id === post.id ? { ...p, ...updateData, published_at: updateData.published_at || undefined } : p
      ))
    } catch (error) {
      console.error('Error toggling publish status:', error)
      alert('Failed to update publish status')
    }
  }

  // Filter posts based on search and status
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filter === 'published') return matchesSearch && post.published
    if (filter === 'draft') return matchesSearch && !post.published
    return matchesSearch
  })

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
            <p className="text-gray-600 mt-2">Create and manage your blog posts</p>
          </div>
          <button
            onClick={createNewPost}
            className="btn-primary inline-flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Blog Post
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Posts</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Search by title or content..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                title="Filter blog posts by status"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Posts</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-500">
                {filteredPosts.length} of {blogPosts.length} posts
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Posts List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {blogPosts.length === 0 ? 'No blog posts yet' : 'No posts match your search'}
            </h3>
            <p className="text-gray-500 mb-6">
              {blogPosts.length === 0 
                ? 'Create your first blog post to get started.' 
                : 'Try adjusting your search terms or filters.'
              }
            </p>
            {blogPosts.length === 0 && (
              <button onClick={createNewPost} className="btn-primary">
                Create Your First Post
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        post.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    {post.excerpt && (
                      <p className="text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{post.author_id || 'Admin'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {post.published_at 
                            ? new Date(post.published_at).toLocaleDateString() 
                            : new Date(post.created_at || Date.now()).toLocaleDateString()
                          }
                        </span>
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Tag className="h-4 w-4" />
                          <span>{post.tags.length} tags</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePublish(post)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        post.published
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {post.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => editPost(post)}
                      title="Edit post"
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    {post.published && (
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View published post"
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      onClick={() => deletePost(post.id)}
                      title="Delete post"
                      className="p-2 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Blog Post Modal */}
        {showPostModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    {isNewPost ? 'Create New Blog Post' : 'Edit Blog Post'}
                  </h2>
                  <button
                    onClick={() => setShowPostModal(false)}
                    title="Close modal"
                    className="p-2 hover:bg-gray-100 rounded-md"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                    <p className="text-red-800">{error}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={postForm.title}
                        onChange={handleTitleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter post title..."
                        required
                      />
                    </div>

                    {/* Slug */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL Slug *
                      </label>
                      <input
                        type="text"
                        value={postForm.slug}
                        onChange={(e) => setPostForm({ ...postForm, slug: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="url-friendly-slug"
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Will be used in URL: /blog/{postForm.slug}
                      </p>
                    </div>

                    {/* Excerpt */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Excerpt
                      </label>
                      <textarea
                        value={postForm.excerpt}
                        onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        rows={3}
                        placeholder="Brief description of the post..."
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content *
                      </label>
                      <MarkdownEditor
                        value={postForm.content}
                        onChange={(value) => setPostForm({ ...postForm, content: value })}
                        placeholder="Write your blog post content in Markdown..."
                      />
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Publish Settings */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-4">Publish Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={postForm.published}
                              onChange={(e) => setPostForm({ ...postForm, published: e.target.checked })}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-700">
                              Publish immediately
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Featured Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Featured Image URL
                      </label>
                      <input
                        type="url"
                        value={postForm.featured_image}
                        onChange={(e) => setPostForm({ ...postForm, featured_image: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="https://..."
                      />
                    </div>

                    {/* Author */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Author
                      </label>
                      <input
                        type="text"
                        value={postForm.author}
                        onChange={(e) => setPostForm({ ...postForm, author: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Author name"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        value={postForm.category}
                        onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Photography Tips, Behind the Scenes, etc."
                      />
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Add a tag..."
                        />
                        <button
                          type="button"
                          onClick={addTag}
                          className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                        >
                          Add
                        </button>
                      </div>
                      {postForm.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {postForm.tags.map((tag, index) => (
                            <span 
                              key={index} 
                              className="flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                title={`Remove tag ${tag}`}
                                className="text-primary-600 hover:text-primary-800"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* SEO Settings */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-4">SEO Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meta Description
                          </label>
                          <textarea
                            value={postForm.meta_description}
                            onChange={(e) => setPostForm({ ...postForm, meta_description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            rows={3}
                            placeholder="SEO description for search engines..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meta Keywords
                          </label>
                          <input
                            type="text"
                            value={postForm.meta_keywords}
                            onChange={(e) => setPostForm({ ...postForm, meta_keywords: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="keyword1, keyword2, keyword3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowPostModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={savePost}
                    disabled={savingPost || !postForm.title || !postForm.slug || !postForm.content}
                    className="btn-primary inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {savingPost && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    <Save className="h-4 w-4 mr-2" />
                    {savingPost ? 'Saving...' : (isNewPost ? 'Create Post' : 'Update Post')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}