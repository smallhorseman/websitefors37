'use client'

import React from 'react'
import { useGalleryImages } from '@/hooks/useGalleryImages'
import type { GalleryImage } from '@/lib/supabase'
import OptimizedImage from './OptimizedImage'
import Link from 'next/link'

export default function PortraitHighlightGallery() {
  const { data: images } = useGalleryImages({
    featured: true,
    limit: 6,
    orderBy: 'created_at',
    ascending: false,
  })

  if (!images || images.length === 0) return null

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Featured Portfolio</h2>
          <p className="text-lg text-gray-700">
            A curated selection of our favorite work
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <Link href="/gallery" key={image.id} className="relative group overflow-hidden rounded-lg shadow-lg">
              <OptimizedImage
                src={image.image_url}
                alt={image.title}
                width={600}
                height={400}
                className="object-cover w-full h-[300px] transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4 w-full text-white">
                  <h3 className="text-lg font-semibold mb-1">{image.title}</h3>
                  {image.description && (
                    <p className="text-sm opacity-90">{image.description}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
