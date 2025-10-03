'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Camera, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-transparent"></div>
      </div>

      <div className="relative z-20 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center mb-6">
            <Camera className="h-16 w-16 text-primary-500 mb-4" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Studio <span className="text-primary-500">37</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Capturing your precious moments with artistic excellence and professional craftsmanship
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="#contact" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
              Book Your Session
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            
            <Link href="/gallery" className="btn-secondary bg-white/10 hover:bg-white/20 text-white border border-white/30 text-lg px-8 py-4">
              View Portfolio
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Animated elements */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
