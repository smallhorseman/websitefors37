import React from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import GalleryClient from '@/components/GalleryClient'

export const metadata = {
  title: 'Photo Gallery | Studio 37 Photography',
  description: 'Browse our portfolio of wedding, portrait, event, and commercial photography work.',
}

export default async function GalleryPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: images } = await supabase
    .from('gallery_images')
    .select('*')
    .order('created_at', { ascending: false })
  
  // Get unique categories
  const categories = images ? 
    ['all', ...new Set(images.map(img => img.category))] : 
    ['all']
  
  return (
    <div className="pt-16 min-h-screen">
      <div className="bg-gray-900 py-16 px-4 text-center text-white">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Photography Portfolio</h1>
          <p className="text-lg text-gray-300 mb-2">
            Explore our diverse collection of photography across different styles and occasions.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <GalleryClient initialImages={images || []} categories={categories} />
      </div>
    </div>
  )
}
