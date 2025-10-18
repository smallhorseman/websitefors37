'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import NewsletterModal from './NewsletterModal'

const galleryImages = [
  {
    id: 1,
    category: 'portrait',
    title: 'Featured Portrait Session',
    src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1760748636/54828488590_bb7f9c9b05_o_ha5the_e_gen_restore_e_improve_e_sharpen_l_image_upload_My_Brand_IMG_2115_mtuowt_c_scale_fl_relative_w_0.40_o_80_fl_layer_apply_g_south_west_x_0.03_y_0.04_shn3ar.jpg',
  },
  {
    id: 2,
    category: 'wedding',
    title: 'Romantic Wedding Ceremony',
    src: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop',
  },
  {
    id: 3,
    category: 'portrait',
    title: 'Professional Headshot',
    src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1756077326/54694193043_f9ae5338ca_k_p7pjaz.jpg',
  },
  {
    id: 4,
    category: 'event',
    title: 'Corporate Event',
    src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
  },
  {
    id: 5,
    category: 'commercial',
    title: 'Product Photography',
    src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
  },
  {
    id: 6,
    category: 'wedding',
    title: 'Wedding Reception',
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
  },
  {
    id: 7,
    category: 'portrait',
    title: 'Family Portrait',
    src: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop',
  }
]

const categories = [
  { id: 'all', label: 'All Work' },
  { id: 'wedding', label: 'Weddings' },
  { id: 'portrait', label: 'Portraits' },
  { id: 'event', label: 'Events' },
  { id: 'commercial', label: 'Commercial' }
]

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false)

  const filteredImages = activeCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory)

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Portfolio Highlights</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            A curated selection from our extensive portfolio showcasing the diversity and quality 
            of our photography across weddings, portraits, events, and commercial work.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-lg bg-gray-800 aspect-[4/3]"
            >
              <Image
                src={image.src}
                alt={image.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                loading={index < 6 ? "eager" : "lazy"}
                quality={80}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <h3 className="text-white text-lg font-semibold">{image.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/gallery" 
              className="btn-primary inline-flex items-center"
            >
              View Complete Gallery
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button 
              onClick={() => setIsNewsletterModalOpen(true)}
              className="btn-secondary"
            >
              Get Portfolio Updates
            </button>
          </div>
          <p className="text-gray-600 mt-4 text-sm">
            Explore our full collection of wedding, portrait, event, and commercial photography
          </p>
        </div>

        <NewsletterModal 
          isOpen={isNewsletterModalOpen}
          onClose={() => setIsNewsletterModalOpen(false)}
        />
      </div>
    </section>
  )
}
