'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Building2, Package, Briefcase, TrendingUp } from '@/icons'

const commercialHighlights = [
  {
    id: 1,
    title: 'Product Photography',
    description: 'High-end product shots for e-commerce and marketing',
    src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=600&fit=crop',
    category: 'product'
  },
  {
    id: 2,
    title: 'Corporate Headshots',
    description: 'Professional team portraits for business use',
    src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=600&fit=crop',
    category: 'corporate'
  },
  {
    id: 3,
    title: 'Brand Photography',
    description: 'Lifestyle and brand story images for marketing',
    src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&h=600&fit=crop',
    category: 'branding'
  },
  {
    id: 4,
    title: 'Restaurant Photography',
    description: 'Appetizing food and restaurant atmosphere shots',
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=600&fit=crop',
    category: 'food'
  },
  {
    id: 5,
    title: 'Real Estate',
    description: 'Professional property and architectural photography',
    src: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&h=600&fit=crop',
    category: 'real estate'
  },
  {
    id: 6,
    title: 'Industrial Photography',
    description: 'Manufacturing and industrial facility documentation',
    src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=600&fit=crop',
    category: 'industrial'
  }
]

const commercialStats = [
  { icon: Building2, label: 'Business Clients', value: '150+' },
  { icon: Package, label: 'Projects Completed', value: '800+' },
  { icon: TrendingUp, label: 'Client Retention', value: '95%' }
]

export default function CommercialHighlightGallery() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Slideshow functionality
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % commercialHighlights.length)
    }, 4000) // Change image every 4 seconds

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  // Intersection Observer for animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section')
            if (id) setVisibleSections((prev) => new Set(prev).add(id))
          }
        })
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    const sections = document.querySelectorAll('[data-section]')
    sections.forEach((section) => observerRef.current?.observe(section))

    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            data-section="header"
            className={`transition-all duration-600 ${
              visibleSections.has('header') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Commercial Photography
              <span className="block text-amber-600">Showcase</span>
            </h2>
                        <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Transforming brands through powerful visual storytelling. From
              product showcases to corporate events, we deliver images that
              drive results.
            </p>
          </div>

          {/* Stats */}
          <div
            data-section="stats"
            className={`grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12 transition-all duration-600 delay-200 ${
              visibleSections.has('stats') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {commercialStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-3">
                  <stat.icon className="w-6 h-6 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-amber-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-700">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Slideshow */}
        <div
          data-section="slideshow"
          className={`mb-16 transition-all duration-600 delay-300 ${
            visibleSections.has('slideshow') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="relative max-w-4xl mx-auto">
            <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative w-full h-full">
                {commercialHighlights.map((image, index) => (
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
            <div className="flex justify-center mt-6 space-x-3">
              {commercialHighlights.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 p-3 ${
                    index === currentImageIndex 
                      ? 'bg-amber-600 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  style={{ minWidth: '44px', minHeight: '44px' }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          style={{ contain: 'layout style paint', contentVisibility: 'auto', containIntrinsicSize: '900px' as any }}
        >
          {commercialHighlights.map((image, index) => (
            <div
              key={image.id}
              data-section={`grid-${index}`}
              className={`group relative overflow-hidden rounded-xl bg-gray-800 aspect-[4/5] shadow-lg hover:shadow-xl transition-all duration-500 ${
                visibleSections.has(`grid-${index}`) ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
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

              {/* Business Icon Overlay */}
              <div className="absolute top-4 right-4">
                <div className="w-8 h-8 bg-amber-600/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Services Grid */}
        <div
          data-section="services"
          className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 transition-all duration-600 ${
            visibleSections.has('services') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {[
            { icon: Package, title: 'Product Photography', desc: 'E-commerce & catalog images' },
            { icon: Building2, title: 'Corporate Portraits', desc: 'Professional team photos' },
            { icon: TrendingUp, title: 'Marketing Content', desc: 'Brand storytelling images' },
            { icon: Briefcase, title: 'Business Events', desc: 'Conference & meeting coverage' }
          ].map((service, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-4">
                <service.icon className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-700 text-sm">{service.desc}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div
          data-section="cta"
          className={`text-center transition-all duration-600 ${
            visibleSections.has('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">
              Ready to Elevate Your Business Visuals?
            </h3>
            <p className="text-amber-700 mb-6 max-w-2xl mx-auto">
              From product photography to corporate events, we help businesses create 
              compelling visual content that drives results and enhances your brand image.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/services/commercial-photography" 
                className="btn-primary inline-flex items-center"
              >
                View Commercial Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/contact" 
                className="btn-secondary inline-flex items-center"
              >
                Request Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}