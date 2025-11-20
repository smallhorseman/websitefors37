'use client'

import { useState } from 'react'
import Image from 'next/image'

/**
 * Before/After Image Slider Block
 * Interactive slider to compare two images side-by-side
 * Perfect for photography portfolios showing editing work
 * Phase 2 Enhancement: Enhanced Blocks
 */

interface BeforeAfterSliderClientProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
  initialPosition?: number
  orientation?: 'horizontal' | 'vertical'
  showLabels?: boolean
}

export default function BeforeAfterSliderClient({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  initialPosition = 50,
  orientation = 'horizontal',
  showLabels = true
}: BeforeAfterSliderClientProps) {
  const [sliderPosition, setSliderPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)

  const handleMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging && e.type !== 'click') return

    const container = e.currentTarget
    const rect = container.getBoundingClientRect()
    
    let position: number
    if ('touches' in e) {
      position = orientation === 'horizontal'
        ? ((e.touches[0].clientX - rect.left) / rect.width) * 100
        : ((e.touches[0].clientY - rect.top) / rect.height) * 100
    } else {
      position = orientation === 'horizontal'
        ? ((e.clientX - rect.left) / rect.width) * 100
        : ((e.clientY - rect.top) / rect.height) * 100
    }

    setSliderPosition(Math.min(Math.max(position, 0), 100))
  }

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)

  return (
    <div
      className={`relative w-full aspect-video overflow-hidden rounded-lg cursor-ew-resize select-none ${orientation === 'vertical' ? 'cursor-ns-resize' : ''}`}
      onMouseMove={handleMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleMove}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onClick={handleMove}
    >
      {/* After Image (full) */}
      <div className="absolute inset-0">
        <Image src={afterImage} alt={afterLabel} fill className="object-cover" />
        {showLabels && (
          <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
            {afterLabel}
          </div>
        )}
      </div>

      {/* Before Image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={
          orientation === 'horizontal'
            ? { width: `${sliderPosition}%` }
            : { height: `${sliderPosition}%` }
        }
      >
        <Image 
          src={beforeImage} 
          alt={beforeLabel} 
          fill 
          className="object-cover"
          style={{ objectPosition: 'left center' }}
        />
        {showLabels && (
          <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
            {beforeLabel}
          </div>
        )}
      </div>

      {/* Slider Handle */}
      <div
        className={`absolute ${orientation === 'horizontal' ? 'top-0 bottom-0 w-1' : 'left-0 right-0 h-1'} bg-white shadow-lg`}
        style={
          orientation === 'horizontal'
            ? { left: `${sliderPosition}%`, transform: 'translateX(-50%)' }
            : { top: `${sliderPosition}%`, transform: 'translateY(-50%)' }
        }
      >
        <div
          className={`absolute ${orientation === 'horizontal' ? 'top-1/2 left-1/2' : 'left-1/2 top-1/2'} transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center`}
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {orientation === 'horizontal' ? (
              <>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </>
            ) : (
              <>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </>
            )}
          </svg>
        </div>
      </div>
    </div>
  )
}
