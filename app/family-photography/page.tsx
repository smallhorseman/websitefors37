import { generateSEOMetadata } from '@/lib/seo-helpers'
import Link from 'next/link'

export const metadata = generateSEOMetadata({
  title: 'Family Photography Pinehurst TX - Studio37',
  description: 'Family photography sessions in Pinehurst, Texas and Montgomery County. Natural, relaxed portraits for lasting memories.',
  canonicalUrl: 'https://www.studio37.cc/family-photography',
  pageType: 'service'
})

export const revalidate = 86400

export default function FamilyPhotographyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">Family Photography</h1>
      <p className="text-lg text-gray-700 mb-6">Natural, relaxed family portrait sessions that capture authentic connections and real moments. Available in Pinehurst, The Woodlands, Magnolia, and surrounding areas.</p>
      <p className="mb-4">We guide you through outfit planning, location selection, and posing so everyone feels comfortable and confident.</p>
      <Link href="/contact" className="btn-primary inline-block mt-4">Book a Family Session</Link>
    </div>
  )
}
