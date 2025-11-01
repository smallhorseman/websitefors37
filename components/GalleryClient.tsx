'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useGalleryImages } from '@/hooks/useGalleryImages'
import type { GalleryImage } from '@/lib/supabase'

interface GalleryProps {
  initialImages: GalleryImage[]
  categories: string[]
}

export default function GalleryClient({ initialImages, categories }: GalleryProps) {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Background refresh using React Query; hydrate with server-provided data
  const { data: allImages = initialImages } = useGalleryImages({}, { initialData: initialImages })

  // Set initial category from URL parameter
  useEffect(() => {
    if (categoryParam && categories.includes(categoryParam)) {
      setActiveCategory(categoryParam)
    }
  }, [categoryParam, categories])
  
  const filteredImages = activeCategory === 'all'
    ? allImages
    : allImages.filter(img => img.category === activeCategory)
  
  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return
      
      if (e.key === 'Escape') {
        setSelectedImage(null)
      } else if (e.key === 'ArrowLeft') {
        navigateImage(-1)
      } else if (e.key === 'ArrowRight') {
        navigateImage(1)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage, selectedIndex, filteredImages])
  
  const openLightbox = (image: GalleryImage, index: number) => {
    setSelectedImage(image)
    setSelectedIndex(index)
  }
  
  const navigateImage = (direction: number) => {
    const newIndex = selectedIndex + direction
    if (newIndex >= 0 && newIndex < filteredImages.length) {
      setSelectedIndex(newIndex)
      setSelectedImage(filteredImages[newIndex])
    }
  }
  
  return (
    <>
      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map(category => (
          <motion.button
            key={category}
            onClick={() => setActiveCategory(category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2.5 rounded-full font-medium transition-all shadow-sm ${
              activeCategory === category
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-primary-300'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Gallery Grid - Masonry-style */}
      <motion.div 
        layout
        className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative cursor-pointer group break-inside-avoid mb-6"
              onClick={() => openLightbox(image, index)}
            >
              <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-300">
                <div className="relative aspect-[4/3] bg-gray-100">
                  <Image
                    src={image.image_url}
                    alt={image.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                {/* Featured Badge */}
                {image.featured && (
                  <div className="absolute top-3 right-3 bg-primary-600 text-white p-2 rounded-full shadow-lg">
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 w-full text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-bold text-lg mb-1">{image.title}</h3>
                    {image.description && (
                      <p className="text-sm text-gray-200 line-clamp-2">{image.description}</p>
                    )}
                    <p className="text-xs text-gray-300 mt-2 capitalize">{image.category}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 p-2 hover:bg-white/10 rounded-full"
              onClick={() => setSelectedImage(null)}
              aria-label="Close lightbox"
              title="Close (Esc)"
            >
              <X size={32} />
            </button>
            
            {/* Previous Button */}
            {selectedIndex > 0 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-3 hover:bg-white/10 rounded-full z-10"
                onClick={(e) => {
                  e.stopPropagation()
                  navigateImage(-1)
                }}
                aria-label="Previous image"
                title="Previous (←)"
              >
                <ChevronLeft size={40} />
              </button>
            )}
            
            {/* Next Button */}
            {selectedIndex < filteredImages.length - 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-3 hover:bg-white/10 rounded-full z-10"
                onClick={(e) => {
                  e.stopPropagation()
                  navigateImage(1)
                }}
                aria-label="Next image"
                title="Next (→)"
              >
                <ChevronRight size={40} />
              </button>
            )}
            
            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="max-w-7xl w-full max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative flex-1 mb-4">
                <Image
                  src={selectedImage.image_url}
                  alt={selectedImage.title}
                  fill
                  sizes="90vw"
                  className="object-contain"
                  priority
                />
              </div>
              
              {/* Image Info */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-black/80 backdrop-blur-sm p-6 rounded-lg text-white"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
                    {selectedImage.description && (
                      <p className="text-gray-300 mb-2">{selectedImage.description}</p>
                    )}
                    <p className="text-sm text-gray-400 capitalize">Category: {selectedImage.category}</p>
                  </div>
                  {selectedImage.featured && (
                    <div className="flex items-center gap-2 text-primary-400">
                      <Star className="h-5 w-5 fill-current" />
                      <span className="text-sm font-medium">Featured</span>
                    </div>
                  )}
                </div>
                
                {/* Image Counter */}
                <div className="mt-4 text-center text-sm text-gray-400">
                  {selectedIndex + 1} / {filteredImages.length}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {filteredImages.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-gray-500 text-lg">No images found in this category.</p>
        </motion.div>
      )}
    </>
  )
}
