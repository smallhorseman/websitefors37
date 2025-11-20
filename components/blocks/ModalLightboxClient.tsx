'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

/**
 * Modal Lightbox Component - Phase 7
 * 
 * Fullscreen image viewer with navigation, keyboard controls, and touch support.
 * Provides immersive experience for viewing gallery images.
 */

interface LightboxImage {
  url: string
  alt: string
  title?: string
  description?: string
  width?: number
  height?: number
}

interface ModalLightboxClientProps {
  images: LightboxImage[]
  initialIndex?: number
  onClose?: () => void
  showCaptions?: boolean
  showThumbnails?: boolean
  accentColor?: string
}

export default function ModalLightboxClient({
  images,
  initialIndex = 0,
  onClose,
  showCaptions = true,
  showThumbnails = false,
  accentColor = '#b46e14'
}: ModalLightboxClientProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isLoading, setIsLoading] = useState(true)

  const currentImage = images[currentIndex]
  const hasMultipleImages = images.length > 1

  // Navigation handlers
  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsLoading(true)
    }
  }, [currentIndex])

  const goToNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsLoading(true)
    }
  }, [currentIndex, images.length])

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index)
    setIsLoading(true)
  }, [])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose?.()
          break
        case 'ArrowLeft':
          goToPrevious()
          break
        case 'ArrowRight':
          goToNext()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, goToPrevious, goToNext])

  // Touch swipe support
  useEffect(() => {
    let touchStartX = 0
    let touchEndX = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX
    }

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX
      handleSwipe()
    }

    const handleSwipe = () => {
      const swipeThreshold = 50
      if (touchStartX - touchEndX > swipeThreshold) {
        goToNext()
      } else if (touchEndX - touchStartX > swipeThreshold) {
        goToPrevious()
      }
    }

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [goToPrevious, goToNext])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        aria-label="Close lightbox"
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Image Counter */}
      {hasMultipleImages && (
        <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Previous Button */}
      {hasMultipleImages && currentIndex > 0 && (
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          style={{ backgroundColor: `${accentColor}40` }}
          aria-label="Previous image"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Next Button */}
      {hasMultipleImages && currentIndex < images.length - 1 && (
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          style={{ backgroundColor: `${accentColor}40` }}
          aria-label="Next image"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Main Image */}
      <div className="relative w-full h-full flex items-center justify-center p-8 md:p-16">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"
              style={{ borderTopColor: accentColor }}
            />
          </div>
        )}
        
        <div className="relative max-w-7xl max-h-full">
          <Image
            src={currentImage.url}
            alt={currentImage.alt}
            width={currentImage.width || 1920}
            height={currentImage.height || 1080}
            className="max-w-full max-h-[calc(100vh-16rem)] w-auto h-auto object-contain"
            onLoad={() => setIsLoading(false)}
            priority
          />
        </div>
      </div>

      {/* Caption */}
      {showCaptions && (currentImage.title || currentImage.description) && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
          <div className="max-w-4xl mx-auto text-white">
            {currentImage.title && (
              <h3 className="text-2xl font-semibold mb-2">{currentImage.title}</h3>
            )}
            {currentImage.description && (
              <p className="text-white/80">{currentImage.description}</p>
            )}
          </div>
        </div>
      )}

      {/* Thumbnail Strip */}
      {showThumbnails && hasMultipleImages && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto">
          <div className="flex gap-2 p-2 bg-black/50 rounded-lg">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`relative w-16 h-16 flex-shrink-0 rounded overflow-hidden transition-all ${
                  index === currentIndex 
                    ? 'ring-2 ring-white scale-110' 
                    : 'opacity-60 hover:opacity-100'
                }`}
                style={index === currentIndex ? { ringColor: accentColor } : {}}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
