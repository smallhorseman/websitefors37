'use client'

import Image, { ImageLoaderProps } from 'next/image'
import { useState } from 'react'
import { optimizeCloudinaryUrl } from '@/lib/cloudinary'

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
  quality?: number
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

  // Use our optimizeCloudinaryUrl utility for consistent transformations
  const cloudinaryLoader = ({ src, width }: ImageLoaderProps) => {
    try {
      return optimizeCloudinaryUrl(src, {
        width: Math.min(1920, Math.max(200, Math.round(width || 800))),
        format: 'auto',
        quality: 60
      })
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
        quality={60} // Lower default quality for better performance
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        loader={src.includes('res.cloudinary.com') ? cloudinaryLoader : undefined}
        placeholder={src.includes('res.cloudinary.com') ? 'blur' : undefined}
        blurDataURL={src.includes('res.cloudinary.com') ? 
          optimizeCloudinaryUrl(src, { 
            width: 40, 
            quality: 20,
            effect: 'blur:400,pixelate:15'
          }) : 
          undefined}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-900 to-slate-700 animate-pulse" />
      )}
    </div>
  )
}