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
  ),
  {
    id: 'p3',
    title: 'Studio Portrait',
    description: 'Professional studio portrait session',
    src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1756082735/54740994305_b99379cf95_h_ky7is7.jpg',
    category: 'studio'
  },
  {
    id: 'p4',
    title: 'Corporate Portrait',
    description: 'Business and corporate portrait',
    src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1756081262/Untitled_convert.io_jnf0gn_aclplu.jpg',
    category: 'business'
  },
  {
    id: 'p5',
    title: 'Creative Portrait',
    description: 'Artistic creative portrait',
    src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1756078209/54681762715_a8ed7d4dbc_o_budwjo.jpg',
    category: 'creative'
  },
  {
    id: 'p6',
    title: 'Personal Branding',
    description: 'Portraits for personal branding',
    src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1756077326/54694193043_f9ae5338ca_k_p7pjaz.jpg',
    category: 'branding'
  }
]

export default function PortraitHighlightGallery() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-3"
          >
            Portrait Highlights
          </motion.h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A curated selection of our portrait work — headshots, family sessions, studio
            portraits, and creative branding images.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="relative rounded-lg overflow-hidden bg-gray-100 aspect-[4/5] shadow-lg"
            >
              <OptimizedImage
                src={img.src}
                alt={img.title}
                fill
                imgClassName="object-cover"
                priority={i < 3}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4 text-white w-full">
                  <h3 className="font-semibold text-lg">{img.title}</h3>
                  <p className="text-sm text-gray-200 mt-1 line-clamp-2">{img.description}</p>
                  <div className="mt-3">
                    <Link href={`/gallery?category=portrait`} className="inline-block text-xs bg-amber-600 px-3 py-1 rounded-full">View more</Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
