import { generateSEOMetadata } from '@/lib/seo-helpers'
import Link from 'next/link'

export const metadata = generateSEOMetadata({
  title: 'Professional Headshots Pinehurst TX - Studio37',
  description: 'Business and personal branding headshot photography. Studio lighting, multiple looks, fast turnaround.',
  canonicalUrl: 'https://www.studio37.cc/professional-headshots',
  pageType: 'service'
})

export const revalidate = 86400

export default function ProfessionalHeadshotsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">Professional Headshots</h1>
      <p className="text-lg text-gray-700 mb-6">Polished, confident headshots for LinkedIn, websites, speaking profiles, and personal branding.</p>
      <p className="mb-4">We offer studio, environmental, and on-location corporate team sessions.</p>
      <Link href="/contact" className="btn-primary inline-block mt-4">Book Headshots</Link>
    </div>
  )
}
