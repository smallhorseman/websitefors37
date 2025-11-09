'use client'

import React from 'react'
import Image from 'next/image'
import { optimizeCloudinaryUrl } from '@/lib/cloudinaryOptimizer'

type Slide = { image: string; category?: string; title?: string }

export default function SlideshowHeroClient({
  slides,
  intervalMs = 5000,
  overlay = 60,
  heading,
  subheading,
  ctaText,
  ctaLink = '#',
  alignment = 'center',
  titleColor = 'text-white',
  subtitleColor = 'text-amber-50',
  buttonStyle = 'primary',
  buttonAnimation = 'hover-zoom',
}: {
  slides: Slide[]
  intervalMs?: number
  overlay?: number
  heading?: string
  subheading?: string
  ctaText?: string
  ctaLink?: string
  alignment?: 'left' | 'center' | 'right'
  titleColor?: string
  subtitleColor?: string
  buttonStyle?: string
  buttonAnimation?: string
}) {
  const [index, setIndex] = React.useState(0)
  const hasSlides = slides && slides.length > 0

  React.useEffect(() => {
    if (!hasSlides || slides.length < 2) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, Math.max(1500, intervalMs))
    return () => clearInterval(id)
  }, [hasSlides, slides.length, intervalMs])

  const current = hasSlides ? slides[index] : undefined
  const currentImageSrc = current?.image ? optimizeCloudinaryUrl(current.image, 1920, 'auto:low') : undefined
  const overlayAlpha = Math.min(Math.max(Number(overlay ?? 60), 0), 100) / 100
  const buttonStyleClasses: Record<string, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary bg-white/10 hover:bg-white/20 border border-amber-200/30',
    outline: 'border-2 border-white text-white hover:bg-white/10'
  }
  const hoverZoom = buttonAnimation === 'hover-zoom' ? 'transition-transform duration-300 hover:scale-105' : ''

  return (
    <section className="relative min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center text-white overflow-hidden">
      {/* Slides */}
      <div className="absolute inset-0">
        {hasSlides && currentImageSrc && (
          <Image
            src={currentImageSrc}
            alt={current?.title || 'Slideshow'}
            fill
            priority={index === 0}
            fetchPriority={index === 0 ? 'high' : 'auto'}
            sizes="100vw"
            quality={75}
            className="object-cover transition-opacity duration-700"
          />
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${overlayAlpha})` }} />

      {/* Content */}
      <div className={`relative z-10 max-w-4xl w-full px-6 text-${alignment}`}>
        {heading && <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-3 ${titleColor}`} dangerouslySetInnerHTML={{ __html: heading }} />}
        {subheading && <p className={`text-lg md:text-xl mb-6 opacity-90 ${subtitleColor}`} dangerouslySetInnerHTML={{ __html: subheading }} />}
        {ctaText && (
          <a href={ctaLink} className={`inline-block px-6 py-3 rounded-lg transition no-underline ${buttonStyleClasses[buttonStyle] || buttonStyleClasses.primary} ${hoverZoom}`}>
            {ctaText}
          </a>
        )}
        {current?.category && (
          <div className="mt-4 text-sm opacity-80">{current.category}</div>
        )}
      </div>
    </section>
  )
}
