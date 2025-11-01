'use client'

import React, { Suspense } from 'react'
import GalleryClient from './GalleryClient'
import type { GalleryImage } from '@/lib/supabase'

interface GalleryWithSuspenseProps {
  initialImages: GalleryImage[]
  categories: string[]
}

function GalleryClientWrapper({ initialImages, categories }: GalleryWithSuspenseProps) {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    }>
      <GalleryClient initialImages={initialImages} categories={categories} />
    </Suspense>
  )
}

export default GalleryClientWrapper