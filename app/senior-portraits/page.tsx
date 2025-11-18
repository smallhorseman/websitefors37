import { generateSEOMetadata } from '@/lib/seo-helpers'
import Link from 'next/link'

export const metadata = generateSEOMetadata({
  title: 'Senior Portraits Pinehurst TX - Studio37',
  description: 'Modern senior portrait sessions highlighting personality, style, and achievements. On-location and studio options.',
  canonicalUrl: 'https://www.studio37.cc/senior-portraits',
  pageType: 'service'
})

export const revalidate = 86400

export default function SeniorPortraitsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">Senior Portraits</h1>
      <p className="text-lg text-gray-700 mb-6">Celebrate this milestone with a custom senior portrait experience. Multiple looks, locations, and styling guidance included.</p>
      <p className="mb-4">We focus on authentic expression and creative storytelling to make each gallery unique.</p>
      <Link href="/contact" className="btn-primary inline-block mt-4">Schedule Senior Portraits</Link>
    </div>
  )
}
