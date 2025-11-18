import { generateSEOMetadata } from '@/lib/seo-helpers'
import Link from 'next/link'

export const metadata = generateSEOMetadata({
  title: 'Maternity Sessions Pinehurst TX - Studio37',
  description: 'Elegant maternity photography capturing the joy and anticipation of motherhood. Studio and outdoor options.',
  canonicalUrl: 'https://www.studio37.cc/maternity-sessions',
  pageType: 'service'
})

export const revalidate = 86400

export default function MaternitySessionsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">Maternity Sessions</h1>
      <p className="text-lg text-gray-700 mb-6">Timeless maternity portraits celebrating this beautiful season. Guided posing, styling assistance, and flattering lighting.</p>
      <p className="mb-4">We recommend scheduling between weeks 28–34 for optimal comfort and bump definition.</p>
      <Link href="/contact" className="btn-primary inline-block mt-4">Book a Maternity Session</Link>
    </div>
  )
}
