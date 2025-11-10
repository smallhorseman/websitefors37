'use client'

import Image from 'next/image'
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
  sizes = '100vw',
  quality = 75
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Optimize Cloudinary URLs to use WebP/AVIF automatically
  const optimizedSrc = src.includes('res.cloudinary.com')
    ? optimizeCloudinaryUrl(src, {
        width: !fill && width ? width : undefined,
        quality: quality,
        format: 'auto', // Cloudinary auto-selects WebP/AVIF based on browser support
      })
    : src

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: !fill && width && height ? `${width} / ${height}` : undefined }}>
      <Image
        src={optimizedSrc}
        alt={alt}
        {...(fill ? { fill: true } : { width, height })}
        className={`duration-700 ease-in-out ${imgClassName} ${
          isLoading ? 'scale-110 blur-sm' : 'scale-100 blur-0'
        }`}
        onLoad={() => setIsLoading(false)}
        priority={priority}
        quality={quality}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-900 to-slate-700 animate-pulse" />
      )}
    </div>
  )
}