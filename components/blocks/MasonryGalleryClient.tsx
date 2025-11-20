'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

/**
 * Masonry Gallery Block
 * Pinterest-style layout with varied image heights
 * Phase 2 Enhancement: Enhanced Blocks
 */

interface MasonryImage {
  url: string
  alt: string
  title?: string
  category?: string
  aspectRatio?: number
}

interface MasonryGalleryClientProps {
  images: MasonryImage[]
  columns?: 2 | 3 | 4
  gap?: number
  onClick?: (image: MasonryImage, index: number) => void
}

export default function MasonryGalleryClient({
  images,
  columns = 3,
  gap = 16,
  onClick
}: MasonryGalleryClientProps) {
  const [columnArrays, setColumnArrays] = useState<MasonryImage[][]>([])

  useEffect(() => {
    // Distribute images across columns for balanced height
    const cols: MasonryImage[][] = Array.from({ length: columns }, () => [])
    const colHeights = new Array(columns).fill(0)

    images.forEach((image) => {
      // Find shortest column
      const shortestCol = colHeights.indexOf(Math.min(...colHeights))
      cols[shortestCol].push(image)
      colHeights[shortestCol] += image.aspectRatio || 1
    })

    setColumnArrays(cols)
  }, [images, columns])

  return (
    <div
      className="flex gap-4"
      style={{ gap: `${gap}px` }}
    >
      {columnArrays.map((column, colIndex) => (
        <div
          key={colIndex}
          className="flex-1 flex flex-col gap-4"
          style={{ gap: `${gap}px` }}
        >
          {column.map((image, imgIndex) => {
            const globalIndex = images.indexOf(image)
            
            return (
              <div
                key={imgIndex}
                className="relative overflow-hidden rounded-lg group cursor-pointer hover-lift"
                onClick={() => onClick?.(image, globalIndex)}
              >
                <div className="relative w-full" style={{ paddingBottom: `${(image.aspectRatio || 1) * 100}%` }}>
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      {image.category && (
                        <div className="text-xs uppercase tracking-wide opacity-90 mb-1">
                          {image.category}
                        </div>
                      )}
                      {image.title && (
                        <div className="text-base font-semibold">{image.title}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
