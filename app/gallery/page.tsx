import React, { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import GalleryWithSuspense from '@/components/GalleryWithSuspense'
import { generateSEOMetadata } from '@/lib/seo-helpers'

export const metadata = generateSEOMetadata({
  title: 'Photography Portfolio Gallery - Studio37 Pinehurst, TX',
  description: 'Browse Studio37\'s photography portfolio featuring wedding, portrait, event, and commercial photography work in Pinehurst, Texas and surrounding Montgomery County areas.',
  keywords: [
    'photography portfolio Pinehurst TX',
    'wedding photography gallery',
    'portrait photography examples',
    'event photography portfolio',
    'commercial photography samples',
    'Texas photographer portfolio',
    'Montgomery County photography'
  ],
  canonicalUrl: 'https://studio37.cc/gallery'
})

// Enable ISR caching for gallery (revalidate every 5 minutes)
export const revalidate = 300

export default async function GalleryPage() {
  const { data: images } = await supabase
    .from('gallery_images')
    .select('*')
    .order('order_index', { ascending: true })
  
  // Get unique categories
  const categories = images ? 
    ['all', ...Array.from(new Set(images.map(img => img.category)))] : 
    ['all']
  
  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 py-20 px-4 text-center text-white overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Our Photography Portfolio
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-2 max-w-2xl mx-auto leading-relaxed">
            Explore our diverse collection of photography across different styles and occasions.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400">
            <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">
              {images?.length || 0} Photos
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">
              {categories.length - 1} Categories
            </span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading gallery…</div>}>
          <GalleryWithSuspense initialImages={images || []} categories={categories} />
        </Suspense>
      </div>
    </div>
  )
}
