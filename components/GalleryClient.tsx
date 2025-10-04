'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface GalleryImage {
  id: string
  title: string
  description?: string
  image_url: string
  category: string
  featured: boolean
}

interface GalleryProps {
  initialImages: GalleryImage[]
  categories: string[]
}

export default function GalleryClient({ initialImages, categories }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  
  const filteredImages = activeCategory === 'all'
    ? initialImages
    : initialImages.filter(img => img.category === activeCategory)
  
  return (
    <>
      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              activeCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredImages.map((image) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout
              className="relative cursor-pointer group aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image.image_url}
                alt={image.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-end">
                <div className="p-4 w-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <h3 className="font-semibold text-lg">{image.title}</h3>
                  {image.description && (
                    <p className="text-sm text-gray-200">{image.description}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          
          <div 
            className="max-w-5xl max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[80vh] w-full">
              <Image
                src={selectedImage.image_url}
                alt={selectedImage.title}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="bg-black bg-opacity-70 p-4 text-white">
              <h3 className="text-xl font-semibold">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="text-gray-300">{selectedImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {filteredImages.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500">No images found in this category.</p>
        </div>
      )}
    </>
  )
}
