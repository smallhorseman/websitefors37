"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { useGalleryImages } from '@/hooks/useGalleryImages'
import OptimizedImage from '@/components/OptimizedImage'
import type { GalleryImage } from '@/lib/supabase'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

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

  // Lightbox state
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const selectedImage = selectedIndex !== null ? filtered[selectedIndex] : null

  const openLightbox = (index: number) => setSelectedIndex(index)
  const closeLightbox = () => setSelectedIndex(null)
  const navigate = (dir: number) => {
    if (selectedIndex === null) return
    const next = selectedIndex + dir
    if (next >= 0 && next < filtered.length) setSelectedIndex(next)
  }

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selectedIndex === null) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') navigate(-1)
      if (e.key === 'ArrowRight') navigate(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedIndex, filtered.length])

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
          {filtered.map((image: GalleryImage, index) => (
            <button
              key={image.id}
              onClick={() => openLightbox(index)}
              className="relative group overflow-hidden rounded-lg shadow-lg text-left"
            >
              <OptimizedImage
                src={image.image_url}
                alt={image.alt_text || image.title}
                width={600}
                height={400}
                className="w-full h-[300px]"
                imgClassName="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end" />
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-lg font-semibold mb-1">{image.title}</h3>
                {image.description && (
                  <p className="text-sm opacity-90 line-clamp-2">{image.description}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {(!isLoading && filtered.length === 0) && (
        <div className="text-center text-gray-500 py-16">No images found.</div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
          aria-modal="true"
          role="dialog"
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 p-2 rounded-full text-white hover:bg-white/10"
            aria-label="Close"
            onClick={(e) => { e.stopPropagation(); closeLightbox() }}
          >
            <X size={28} />
          </button>

          {/* Prev */}
          {selectedIndex! > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full text-white hover:bg-white/10"
              aria-label="Previous image"
              onClick={(e) => { e.stopPropagation(); navigate(-1) }}
            >
              <ChevronLeft size={38} />
            </button>
          )}

          {/* Next */}
          {selectedIndex! < filtered.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full text-white hover:bg-white/10"
              aria-label="Next image"
              onClick={(e) => { e.stopPropagation(); navigate(1) }}
            >
              <ChevronRight size={38} />
            </button>
          )}

          <div className="relative w-full max-w-6xl h-[70vh]" onClick={(e) => e.stopPropagation()}>
            <OptimizedImage
              src={selectedImage.image_url}
              alt={selectedImage.alt_text || selectedImage.title}
              fill
              sizes="(max-width: 1200px) 90vw, 1100px"
              imgClassName="object-contain"
              priority
            />
          </div>

          {/* Caption & Counter */}
          <div className="mt-4 w-full max-w-3xl text-white">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{selectedImage.title}</h3>
                  {selectedImage.description && (
                    <p className="text-sm text-gray-200">{selectedImage.description}</p>
                  )}
                  {selectedImage.category && (
                    <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs bg-white/20">
                      {selectedImage.category}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-300 whitespace-nowrap">
                  {(selectedIndex! + 1)} / {filtered.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
