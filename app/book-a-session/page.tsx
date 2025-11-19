import React, { Suspense } from 'react'
import { generateSEOMetadata } from '@/lib/seo-helpers'
import BookSessionPage from './booking-client'

export const metadata = generateSEOMetadata({
  title: 'Book Photography Session - Studio37 Pinehurst, TX',
  description: 'Book your professional photography session with Studio37 in Pinehurst, Texas. Choose from wedding, portrait, event, or commercial photography packages. Easy online booking available.',
  keywords: [
    'book photography session Pinehurst TX',
    'photography booking Texas',
    'schedule photoshoot',
    'wedding photography booking',
    'portrait session booking',
    'photography appointment Pinehurst',
    'hire photographer Texas'
  ],
  canonicalUrl: 'https://studio37.cc/book-a-session'
})

// Loading fallback
function BookingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Loading booking system...</p>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<BookingFallback />}>
      <BookSessionPage />
    </Suspense>
  )
}