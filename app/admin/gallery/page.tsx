'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Loader2, Plus, Trash2, Edit, Settings, X, Upload, Image as ImageIcon } from 'lucide-react'
import { getPaginatedData } from '@/lib/supabase'
import ImageUploader from '@/components/ImageUploader'

interface GalleryImage {
  id: string
  title: string
  description?: string
  image_url: string
  category: string
  featured: boolean
  created_at: string
  display_order: number
}

export default function GalleryAdmin() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const itemsPerPage = 24
  
  // Filter/search state
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: 'general',
    featured: false,
    display_order: 0
  })

  // Fetch images from Supabase
  const fetchImages = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const filters = []
      if (categoryFilter !== 'all') {
        filters.push({ column: 'category', value: categoryFilter })
      }
      if (showFeaturedOnly) {
        filters.push({ column: 'featured', value: true })
      }
      
      const response = await getPaginatedData<GalleryImage>(
        'gallery_images',
        { page: currentPage, limit: itemsPerPage },
        filters,
        { column: 'display_order', ascending: true }
      )
      
      setImages(response.data)
      setTotalCount(response.count)
      setPageCount(response.pageCount)
    } catch (error: any) {
      console.error('Error fetching images:', error)
      setError(error.message || 'Failed to load gallery images')
    } finally {
      setLoading(false)
    }
  }, [currentPage, categoryFilter, showFeaturedOnly])
  
  useEffect(() => {
    fetchImages()
  }, [fetchImages])
  
  // Save a new image or update existing one
  const saveImage = async () => {
    if (!formData.title || !formData.image_url) return
    
    setSaving(true)
    try {
      const { supabase } = await import('@/lib/supabase')
      
      if (isNew) {
        // Create new image
        const { data, error } = await supabase
          .from('gallery_images')
          .insert([{
            title: formData.title,
            description: formData.description,
            image_url: formData.image_url,
            category: formData.category,
            featured: formData.featured,
            display_order: formData.display_order
          }])
          .select()
        
        if (error) throw error
        
        // Update state
        if (data) {
          setImages([data[0], ...images])
        }
      } else if (selectedImage) {
        // Update existing image
        const { error } = await supabase
          .from('gallery_images')
          .update({
            title: formData.title,
            description: formData.description,
            image_url: formData.image_url,
            category: formData.category,
            featured: formData.featured,
            display_order: formData.display_order
          })
          .eq('id', selectedImage.id)
        
        if (error) throw error
        
        // Update state
        setImages(images.map(img => 
          img.id === selectedImage.id 
            ? { ...img, ...formData } 
            : img
        ))
      }
      
      setShowModal(false)
    } catch (error: any) {
      console.error('Error saving image:', error)
      alert('Failed to save image: ' + error.message)
    } finally {
      setSaving(false)
    }
  }
  
  // Delete an image
  const deleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return
    
    try {
      const { supabase } = await import('@/lib/supabase')
      
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      // Update state
      setImages(images.filter(img => img.id !== id))
    } catch (error: any) {
      console.error('Error deleting image:', error)
      alert('Failed to delete image: ' + error.message)
    }
  }
  
  // Open modal to add a new image
  const addNewImage = () => {
    setSelectedImage(null)
    setFormData({
      title: '',
      description: '',
      image_url: '',
      category: 'general',
      featured: false,
      display_order: 0
    })
    setIsNew(true)
    setShowModal(true)
  }
  
  // Open modal to edit an existing image
  const editImage = (image: GalleryImage) => {
    setSelectedImage(image)
    setFormData({
      title: image.title,
      description: image.description || '',
      image_url: image.image_url,
      category: image.category,
      featured: image.featured,
      display_order: image.display_order
    })
    setIsNew(false)
    setShowModal(true)
  }

  // Bulk actions
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
  
  const handleSelectImage = (id: string) => {
    const newSelected = new Set(selectedImages)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedImages(newSelected)
  }
  
  const bulkDelete = async () => {
    if (selectedImages.size === 0) return
    if (!confirm(`Delete ${selectedImages.size} images?`)) return
    
    try {
      const { supabase } = await import('@/lib/supabase')
      
      const promises = Array.from(selectedImages).map(id =>
        supabase.from('gallery_images').delete().eq('id', id)
      )
      
      await Promise.all(promises)
      
      // Update state
      setImages(images.filter(img => !selectedImages.has(img.id)))
      setSelectedImages(new Set())
    } catch (error: any) {
      console.error('Error deleting images:', error)
      alert('Failed to delete some images')
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Gallery Management</h1>
        <div className="flex items-center gap-2">
          {selectedImages.size > 0 && (
            <>
              <span className="text-sm text-gray-600">
                {selectedImages.size} selected
              </span>
              <button
                onClick={bulkDelete}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Selected
              </button>
            </>
          )}
          <button
            onClick={addNewImage}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Image
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value)
            setCurrentPage(1)
          }}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Categories</option>
          <option value="wedding">Wedding</option>
          <option value="portrait">Portrait</option>
          <option value="event">Event</option>
          <option value="commercial">Commercial</option>
          <option value="general">General</option>
        </select>
        
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showFeaturedOnly}
            onChange={(e) => {
              setShowFeaturedOnly(e.target.checked)
              setCurrentPage(1)
            }}
            className="h-4 w-4 text-primary-600 rounded"
          />
          <span className="text-sm">Featured only</span>
        </label>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
          <button onClick={fetchImages} className="text-red-600 underline mt-2">
            Try again
          </button>
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2">Loading gallery images...</span>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No images in the gallery yet.</p>
          <button
            onClick={addNewImage}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Add Your First Image
          </button>
        </div>
      ) : (
        <>
          {/* Gallery grid with checkbox selection */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map(image => (
              <div key={image.id} className="border rounded-lg overflow-hidden bg-white relative">
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    checked={selectedImages.has(image.id)}
                    onChange={() => handleSelectImage(image.id)}
                    className="h-4 w-4 text-primary-600 rounded border-gray-300 bg-white"
                  />
                </div>
                
                <div className="relative aspect-[4/3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-3">
                  <h3 className="font-semibold truncate">{image.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">
                    {image.category} {image.featured && '• Featured'}
                  </p>
                  
                  <div className="flex justify-between">
                    <button
                      onClick={() => editImage(image)}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteImage(image.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination controls */}
          <div className="mt-6">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {pageCount}
            </span>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                disabled={currentPage === pageCount}
                className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
      
      {/* Add/Edit Image Modal with Image Uploader */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isNew ? 'Add New Image' : 'Edit Image'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Image title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Image or Enter URL
                </label>
                {isNew && (
                  <ImageUploader 
                    onImageUrl={(url) => setFormData({ ...formData, image_url: url })}
                  />
                )}
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Brief description of the image"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="wedding">Wedding</option>
                  <option value="portrait">Portrait</option>
                  <option value="event">Event</option>
                  <option value="commercial">Commercial</option>
                  <option value="general">General</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="0"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Lower numbers appear first
                </p>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 text-primary-600 rounded border-gray-300"
                />
                <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                  Featured image (will appear in highlights)
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveImage}
                disabled={!formData.title || !formData.image_url || saving}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Image'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
