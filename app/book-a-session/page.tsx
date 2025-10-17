import React from 'react'
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

export default function BookingPage() {
  return <BookSessionPage />
}