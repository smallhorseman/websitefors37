import React from 'react'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import CommercialHighlightGallery from '@/components/CommercialHighlightGallery'
import PortraitHighlightGallery from '@/components/PortraitHighlightGallery'
import LeadCaptureForm from '@/components/LeadCaptureForm'
import Testimonials from '@/components/Testimonials'
import LocalBusinessSchema from '@/components/LocalBusinessSchema'
import { generateSEOMetadata } from '@/lib/seo-helpers'
import { generateLocalBusinessSchema } from '@/lib/seo-config'

export const metadata = generateSEOMetadata({
  title: 'Professional Photography Services in Pinehurst, TX',
  description: 'Studio37 offers professional wedding, portrait, event, and commercial photography services in Pinehurst, Texas and surrounding areas. Serving Montgomery County, The Woodlands, and Houston.',
  keywords: [
    'wedding photography Pinehurst TX',
    'portrait photographer Texas',
    'event photography Montgomery County',
    'commercial photography The Woodlands',
    'professional photographer near me',
    'family portraits Pinehurst',
    'engagement photography Texas'
  ],
  canonicalUrl: 'https://studio37.cc',
  pageType: 'website'
})

export default function HomePage() {
  return (
    <>
      <LocalBusinessSchema />
      <Hero />
      <PortraitHighlightGallery />
      <Services />
      <CommercialHighlightGallery />
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Capture Your Story?</h2>
            <p className="text-lg text-gray-600">
              Let's discuss your photography needs and create something beautiful together.
            </p>
          </div>
          <LeadCaptureForm />
        </div>
      </section>
      <Testimonials />
    </>
  )
}
