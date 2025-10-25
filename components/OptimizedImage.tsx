'use client'

import Image, { ImageLoaderProps } from 'next/image'
import { useState, useEffect } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  imgClassName?: string
  priority?: boolean
  sizes?: string
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  imgClassName = '',
  priority = false,
  sizes = '100vw'
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Cloudinary loader: inject responsive transformation into the URL when possible
  const cloudinaryLoader = ({ src, width }: ImageLoaderProps) => {
    try {
      if (!src) return src
      // Only handle res.cloudinary.com URLs
      if (!src.includes('res.cloudinary.com')) return src
      // Insert width/format/quality transform after '/upload/'
      const parts = src.split('/upload/')
      if (parts.length !== 2) return src
      const prefix = parts[0]
      const rest = parts[1]
      // Add transformation: w_{width},f_auto,q_auto
      const transform = `w_${Math.min(1920, Math.max(200, Math.round(width || 800)))},f_auto,q_auto`
      return `${prefix}/upload/${transform}/${rest}`
    } catch (e) {
      return src
    }
  }
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        {...(fill ? { fill: true } : { width, height })}
        className={`duration-700 ease-in-out ${imgClassName} ${
          isLoading ? 'scale-110 blur-lg' : 'scale-100 blur-0'
        }`}
        onLoadingComplete={() => setIsLoading(false)}
        priority={priority}
        // Use lower default quality for better performance; Cloudinary transforms will set format automatically
        quality={70}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        loader={src.includes('res.cloudinary.com') ? cloudinaryLoader : undefined}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-900 to-slate-700 animate-pulse" />
      )}
    </div>
  )
}