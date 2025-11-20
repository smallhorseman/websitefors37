'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'

/**
 * Filterable Gallery Component - Phase 7
 * 
 * Interactive image gallery with category filtering.
 * Users can filter images by clicking category buttons.
 */

interface GalleryImage {
  url: string
  alt: string
  title?: string
  category: string
  description?: string
}

interface FilterableGalleryClientProps {
  images: GalleryImage[]
  columns?: 2 | 3 | 4
  gap?: number
  showAllButton?: boolean
  accentColor?: string
  animate?: boolean
}

export default function FilterableGalleryClient({
  images,
  columns = 3,
  gap = 16,
  showAllButton = true,
  accentColor = '#b46e14',
  animate = true
}: FilterableGalleryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(images.map(img => img.category))
    return Array.from(cats).sort()
  }, [images])

  // Filter images based on selected category
  const filteredImages = useMemo(() => {
    if (selectedCategory === 'all') {
      return images
    }
    return images.filter(img => img.category === selectedCategory)
  }, [images, selectedCategory])

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className="w-full">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {showAllButton && (
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === 'all'
                ? 'text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={selectedCategory === 'all' ? { backgroundColor: accentColor } : {}}
          >
            All
            <span className="ml-2 text-sm opacity-75">({images.length})</span>
          </button>
        )}
        {categories.map((category) => {
          const count = images.filter(img => img.category === category).length
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category
                  ? 'text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={selectedCategory === category ? { backgroundColor: accentColor } : {}}
            >
              {category}
              <span className="ml-2 text-sm opacity-75">({count})</span>
            </button>
          )
        })}
      </div>

      {/* Gallery Grid */}
      <div className={`grid ${gridCols[columns]} gap-${gap}`}>
        {filteredImages.map((image, index) => (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer ${
              animate ? 'animate-fadeIn' : ''
            }`}
            style={{ animationDelay: animate ? `${index * 50}ms` : undefined }}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  {image.title && (
                    <h3 className="text-lg font-bold mb-1">{image.title}</h3>
                  )}
                  {image.description && (
                    <p className="text-sm opacity-90">{image.description}</p>
                  )}
                  <div 
                    className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: accentColor }}
                  >
                    {image.category}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredImages.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-lg font-medium">No images in this category</p>
          <p className="text-sm mt-1">Try selecting a different filter</p>
        </div>
      )}
    </div>
  )
}
