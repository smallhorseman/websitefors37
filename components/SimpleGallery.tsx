"use client"

import React, { useMemo, useState } from 'react'
import { useGalleryImages } from '@/hooks/useGalleryImages'
import OptimizedImage from '@/components/OptimizedImage'
import type { GalleryImage } from '@/lib/supabase'

export default function SimpleGallery() {
  // Fetch all images using the same hook as Featured Portfolio
  const { data: images = [], isLoading, error } = useGalleryImages({
    orderBy: 'display_order',
    ascending: true,
  })

  const categories = useMemo(() => {
    const set = new Set<string>(['all'])
    images.forEach((img) => img.category && set.add(img.category))
    return Array.from(set)
  }, [images])

  const [activeCategory, setActiveCategory] = useState('all')
  const filtered = activeCategory === 'all' ? images : images.filter(i => i.category === activeCategory)

  if (error) {
    return (
      <div className="text-center text-red-600">Failed to load gallery. Please try again.</div>
    )
  }

  return (
    <div>
      {/* Counts */}
      <div className="mb-8 flex items-center justify-center gap-2 text-sm text-gray-500">
        <span className="px-3 py-1 bg-gray-100 rounded-full">{images.length} Photos</span>
        <span className="px-3 py-1 bg-gray-100 rounded-full">{Math.max(categories.length - 1, 0)} Categories</span>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-6 py-2.5 rounded-full font-medium transition-all shadow-sm ${
              activeCategory === c
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-primary-300'
            }`}
          >
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((image: GalleryImage) => (
            <div key={image.id} className="relative group overflow-hidden rounded-lg shadow-md">
              <OptimizedImage
                src={image.image_url}
                alt={image.alt_text || image.title}
                width={800}
                height={600}
                className="w-full h-[260px]"
                imgClassName="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-semibold text-lg">{image.title}</h3>
                {image.description && (
                  <p className="text-sm text-gray-200 line-clamp-2">{image.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {(!isLoading && filtered.length === 0) && (
        <div className="text-center text-gray-500 py-16">No images found.</div>
      )}
    </div>
  )
}
