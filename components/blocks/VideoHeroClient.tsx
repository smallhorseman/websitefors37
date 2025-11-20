'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

/**
 * Video Hero Block - Background video with overlay content
 * Supports YouTube, Vimeo embeds or direct MP4 files
 * Phase 2 Enhancement: Enhanced Blocks
 */

interface VideoHeroClientProps {
  videoUrl: string
  videoType?: 'youtube' | 'vimeo' | 'direct'
  posterImage?: string
  overlay?: number
  heading?: string
  subheading?: string
  ctaText?: string
  ctaLink?: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
  alignment?: 'left' | 'center' | 'right'
  titleColor?: string
  subtitleColor?: string
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
}

export default function VideoHeroClient({
  videoUrl,
  videoType = 'direct',
  posterImage,
  overlay = 60,
  heading,
  subheading,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  alignment = 'center',
  titleColor = 'text-white',
  subtitleColor = 'text-amber-50',
  autoplay = true,
  muted = true,
  loop = true
}: VideoHeroClientProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPoster, setShowPoster] = useState(true)

  useEffect(() => {
    if (videoRef.current && autoplay) {
      videoRef.current.play().then(() => {
        setIsPlaying(true)
        setShowPoster(false)
      }).catch(() => {
        // Autoplay failed, show poster
        setShowPoster(true)
      })
    }
  }, [autoplay])

  const getEmbedUrl = () => {
    if (videoType === 'youtube') {
      const videoId = videoUrl.includes('youtube.com') 
        ? new URL(videoUrl).searchParams.get('v')
        : videoUrl.replace('https://youtu.be/', '')
      return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`
    }
    
    if (videoType === 'vimeo') {
      const videoId = videoUrl.split('/').pop()
      return `https://player.vimeo.com/video/${videoId}?autoplay=${autoplay ? 1 : 0}&muted=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&background=1&controls=0`
    }
    
    return videoUrl
  }

  const overlayAlpha = Math.min(Math.max(overlay, 0), 100) / 100

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      {videoType === 'direct' ? (
        <>
          {showPoster && posterImage && (
            <div className="absolute inset-0 z-10">
              <Image src={posterImage} alt="Video poster" fill className="object-cover" />
            </div>
          )}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            poster={posterImage}
            autoPlay={autoplay}
            muted={muted}
            loop={loop}
            playsInline
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </>
      ) : (
        <iframe
          className="absolute inset-0 w-full h-full pointer-events-none"
          src={getEmbedUrl()}
          allow="autoplay; fullscreen; picture-in-picture"
          style={{ border: 'none', transform: 'scale(1.5)' }}
        />
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayAlpha }}
      />

      {/* Content */}
      <div className={`relative z-10 max-w-4xl w-full px-6 text-${alignment}`}>
        {heading && (
          <h1 
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-3 ${titleColor}`}
            dangerouslySetInnerHTML={{ __html: heading }}
          />
        )}
        {subheading && (
          <p 
            className={`text-lg md:text-xl mb-6 opacity-90 ${subtitleColor}`}
            dangerouslySetInnerHTML={{ __html: subheading }}
          />
        )}
        {(ctaText || secondaryCtaText) && (
          <div className="flex flex-wrap gap-4 justify-center items-center">
            {ctaText && (
              <a
                href={ctaLink || '#'}
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition no-underline"
              >
                {ctaText}
              </a>
            )}
            {secondaryCtaText && (
              <a
                href={secondaryCtaLink || '#'}
                className="inline-block px-6 py-3 border-2 border-white text-white hover:bg-white/10 rounded-lg transition no-underline"
              >
                {secondaryCtaText}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
