'use client'

import React from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import OptimizedImage from './OptimizedImage'
import Link from 'next/link'

interface GalleryImage {
  id: string
  title: string
  description?: string
  image_url: string
  category: string
  featured: boolean
}

export default function PortraitHighlightGallery() {
  const [images, setImages] = React.useState<GalleryImage[]>([])
  const supabase = createClientComponentClient()

  React.useEffect(() => {
    async function loadFeaturedImages() {
      const { data } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('featured', true)
        .limit(6)
        .order('created_at', { ascending: false })
      
      if (data) {
        setImages(data)
      }
    }

    loadFeaturedImages()
  }, [])

  if (images.length === 0) return null

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Portfolio</h2>
          <p className="text-lg text-gray-600">
            A showcase of our best work and cherished moments
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
