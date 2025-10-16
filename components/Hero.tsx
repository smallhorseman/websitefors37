'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getPageConfig } from '@/lib/pageConfig'
import { supabase } from '@/lib/supabase'

export default function Hero() {
  const [cfg, setCfg] = useState<Record<string, any> | null>(null)
  const [galleryImages, setGalleryImages] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Categories to show in homepage hero
  const homepageCategories = [
    'professional portraits',
    'creative portraits',
    'product photography',
    'brand photography'
  ]

  useEffect(() => {
    getPageConfig('home').then((c) => setCfg(c?.data || null))
    // Fetch featured gallery images for homepage categories
    supabase
      .from('gallery_images')
      .select('*')
      .in('category', homepageCategories)
      .eq('featured', true)
      .order('display_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setGalleryImages(data)
      })
  }, [])

  // Slideshow rotation
  useEffect(() => {
    if (galleryImages.length < 2) return
    intervalRef.current = setInterval(() => {
      setCurrentIndex((idx) => (idx + 1) % galleryImages.length)
    }, 5000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [galleryImages])

  const heroTitle: string = cfg?.hero_title || 'Studio '
  const heroSubtitle: string = cfg?.hero_subtitle || 'Capturing your precious moments with artistic excellence and professional craftsmanship'
  // Use slideshow image if available, else fallback to config/default
  const heroImage: string = galleryImages.length > 0
    ? galleryImages[currentIndex]?.image_url
    : (cfg?.hero_image || 'https://res.cloudinary.com/dmjxho2rl/image/upload/v1759639187/A4B03835-ED8B-4FBB-A27E-1F2EE6CA1A18_1_105_c_gstgil_e_gen_restore_e_improve_e_sharpen_l_image_upload_My_Brand_IMG_2115_mtuowt_c_scale_fl_relative_w_0.40_o_80_fl_layer_apply_g_south_x_0.03_y_0.04_yqgycj.jpg')

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image (slideshow) */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt={galleryImages.length > 0 ? galleryImages[currentIndex]?.title || 'Homepage slideshow' : 'Studio 37 Photography background'}
          fill
          priority
          className="object-cover transition-opacity duration-1000"
        />
      </div>

      {/* Overlay with vintage gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 via-amber-800/50 to-transparent z-10"></div>

      {/* Film grain texture overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay z-10">
        <Image 
          src="https://res.cloudinary.com/dmjxho2rl/image/upload/v1759639916/Pngtree_film_grain_overlay_8671079_amgbm1.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-20 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-block p-2 border-4 border-amber-200/30 rounded-full mb-8">
            <Camera className="h-16 w-16 text-amber-200" />
          </div>

          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
            {heroTitle || 'Studio '}<span className="text-amber-200">37</span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-amber-50 max-w-2xl mx-auto font-light">
            {heroSubtitle}
          </p>

          {/* Show current image category and title if slideshow is active */}
          {galleryImages.length > 0 && (
            <div className="mb-6 text-amber-100 text-lg font-medium">
              <span className="capitalize">{galleryImages[currentIndex]?.category}</span>
              {galleryImages[currentIndex]?.title && (
                <span className="ml-2 text-white/80">— {galleryImages[currentIndex].title}</span>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/book-a-session" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
              Book Your Session
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>

            <Link href="/gallery" className="btn-secondary text-lg px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-amber-200/30 hover:border-amber-200/50 transition-colors">
              View Portfolio
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Vintage frame border */}
      <div className="absolute inset-8 border border-amber-200/20 pointer-events-none z-10 hidden md:block"></div>

      {/* Animated scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="w-6 h-10 border-2 border-amber-200/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-amber-200/70 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  )
}
