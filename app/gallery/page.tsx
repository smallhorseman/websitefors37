import React from 'react'
import { generateSEOMetadata } from '@/lib/seo-helpers'
import SimpleGallery from '@/components/SimpleGallery'

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

// Use ISR with a reasonable window; client will fetch fresh data
export const revalidate = 300

export default function GalleryPage() {
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
          {/* counts will render in client component below */}
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <SimpleGallery />
      </div>
    </div>
  )
}
