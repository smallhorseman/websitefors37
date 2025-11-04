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

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        {...(fill ? { fill: true } : { width, height })}
        className={`duration-700 ease-in-out ${imgClassName} ${
          isLoading ? 'scale-110 blur-sm' : 'scale-100 blur-0'
        }`}
        onLoad={() => setIsLoading(false)}
        priority={priority}
        quality={75}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        unoptimized={process.env.NETLIFY === "true"}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-900 to-slate-700 animate-pulse" />
      )}
    </div>
  )
}