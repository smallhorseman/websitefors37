'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Users, Camera, Star } from 'lucide-react'

const portraitHighlights = [
  {
    id: 1,
    title: 'Featured Portrait Session',
    description: 'Professional artistic portrait with natural lighting and composition',
    src: 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1760748636/54828488590_bb7f9c9b05_o_ha5the_e_gen_restore_e_improve_e_sharpen_l_image_upload_My_Brand_IMG_2115_mtuowt_c_scale_fl_relative_w_0.40_o_80_fl_layer_apply_g_south_west_x_0.03_y_0.04_shn3ar.jpg',
    category: 'featured'
  },
  {
    id: 2,
    title: 'Executive Headshot',
    description: 'Professional corporate portrait with studio lighting',
    src: 'https://images.unsplash.com/photo-1494790108755-2616b612b5a5?w=500&h=600&fit=crop',
    category: 'headshots'
  },
  {
    id: 2,
    title: 'Family Portrait Session',
    description: 'Warm, natural family portraits in outdoor setting',
    src: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=500&h=600&fit=crop',
    category: 'family'
  },
  {
    id: 3,
    title: 'Senior Portrait',
    description: 'Creative graduation portraits with personality',
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop',
    category: 'senior'
  },
  {
    id: 4,
    title: 'Maternity Session',
    description: 'Beautiful expecting mother portraits',
    src: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&h=600&fit=crop',
    category: 'maternity'
  },
  {
    id: 5,
    title: 'Creative Portrait',
    description: 'Artistic portrait with dramatic lighting',
    src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=600&fit=crop',
    category: 'creative'
  },
  {
    id: 6,
    title: 'Professional Headshot',
    description: 'Clean, modern business portrait',
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=600&fit=crop',
    category: 'headshots'
  }
]

const portraitStats = [
  { icon: Users, label: 'Happy Clients', value: '500+' },
  { icon: Camera, label: 'Portrait Sessions', value: '1,200+' },
  { icon: Star, label: 'Average Rating', value: '4.9/5' }
]

export default function PortraitHighlightGallery() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Slideshow functionality
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % portraitHighlights.length)
    }, 4000) // Change image every 4 seconds

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Portrait Photography
              <span className="block text-amber-600">Highlights</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              From professional headshots to intimate family moments, we capture the essence 
              of who you are with artistic excellence and personal attention.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12"
          >
            {portraitStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-3">
                  <stat.icon className="w-6 h-6 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-amber-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Main Slideshow */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="relative max-w-4xl mx-auto">
            <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative w-full h-full">
                {portraitHighlights.map((image, index) => (
                  <div
                    key={image.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1200px) 100vw, 1200px"
                      priority={index === 0}
                      quality={90}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                      <h3 className="text-2xl md:text-3xl font-bold mb-2">{image.title}</h3>
                      <p className="text-lg text-gray-200 mb-4">{image.description}</p>
                      <span className="inline-block px-4 py-2 bg-amber-600 rounded-full text-sm font-medium capitalize">
                        {image.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slideshow Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {portraitHighlights.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-amber-600 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {portraitHighlights.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-xl bg-gray-800 aspect-[4/5] shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={image.src}
                alt={image.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                loading={index < 3 ? "eager" : "lazy"}
                quality={85}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg font-semibold mb-2">{image.title}</h3>
                <p className="text-sm text-gray-200 mb-3">{image.description}</p>
                <span className="inline-block px-3 py-1 bg-amber-600 rounded-full text-xs font-medium capitalize">
                  {image.category}
                </span>
              </div>

              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-800 capitalize">
                  {image.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-amber-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">
              Ready for Your Portrait Session?
            </h3>
            <p className="text-amber-700 mb-6 max-w-2xl mx-auto">
              Whether you need professional headshots, family portraits, or creative sessions, 
              we'll work together to create images that truly represent you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/services/portrait-photography" 
                className="btn-primary inline-flex items-center"
              >
                View Portrait Packages
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/gallery?category=portrait" 
                className="btn-secondary inline-flex items-center"
              >
                See Full Portrait Gallery
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}