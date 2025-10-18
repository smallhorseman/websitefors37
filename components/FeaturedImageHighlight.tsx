'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Camera, Eye, Heart } from 'lucide-react'

export default function FeaturedImageHighlight() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500 via-transparent to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <div className="inline-flex items-center gap-2 bg-amber-600/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Camera className="w-5 h-5 text-amber-400" />
              <span className="text-amber-200 font-medium">Featured Work</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Capturing Life's Most
              <span className="block text-amber-400">Beautiful Moments</span>
            </h2>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Every photograph tells a story. This stunning portrait showcases our commitment to 
              creating timeless, artistic images that capture the essence and natural beauty of our subjects.
            </p>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-600/20 rounded-full mb-3">
                  <Eye className="w-6 h-6 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">Professional</div>
                <div className="text-sm text-gray-400">Quality</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-600/20 rounded-full mb-3">
                  <Camera className="w-6 h-6 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">Artistic</div>
                <div className="text-sm text-gray-400">Vision</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-600/20 rounded-full mb-3">
                  <Heart className="w-6 h-6 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">Emotional</div>
                <div className="text-sm text-gray-400">Depth</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/gallery" 
                className="inline-flex items-center justify-center px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors duration-300"
              >
                Explore Full Gallery
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/book-a-session" 
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white/30 hover:border-amber-400 hover:bg-amber-400/10 text-white font-semibold rounded-lg transition-all duration-300"
              >
                Book Your Session
              </Link>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative">
              {/* Main Image */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://res.cloudinary.com/dmjxho2rl/image/upload/v1760748636/54828488590_bb7f9c9b05_o_ha5the_e_gen_restore_e_improve_e_sharpen_l_image_upload_My_Brand_IMG_2115_mtuowt_c_scale_fl_relative_w_0.40_o_80_fl_layer_apply_g_south_west_x_0.03_y_0.04_shn3ar.jpg"
                  alt="Featured Portrait - Studio37 Photography"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                  quality={95}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-400/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-amber-400" />
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-white text-sm font-medium mb-1">Studio37 Photography</div>
                <div className="text-gray-300 text-xs">Professional Portrait Session</div>
              </div>

              {/* Decorative Border */}
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-400/20 to-amber-600/20 rounded-3xl -z-10"></div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}