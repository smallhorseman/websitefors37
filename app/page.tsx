import React from 'react'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import CommercialHighlightGallery from '@/components/CommercialHighlightGallery'
import PortraitHighlightGallery from '@/components/PortraitHighlightGallery'
import LeadCaptureForm from '@/components/LeadCaptureForm'
import Testimonials from '@/components/Testimonials'
import LocalBusinessSchema from '@/components/LocalBusinessSchema'
import { generateSEOMetadata } from '@/lib/seo-helpers'
import DiscountNewsletterModal from '@/components/DiscountNewsletterModal'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeHighlight from 'rehype-highlight'
import { MDXBuilderComponents } from '@/components/BuilderRuntime'

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

// Try to import rehype-raw, but fall back gracefully if not available
let rehypeRaw: any
try {
  rehypeRaw = require('rehype-raw')
} catch {
  console.warn('rehype-raw not available on home page; raw HTML in MDX will not be parsed')
}

export default async function HomePage() {
  // If an editor-managed home page exists in content_pages (slug 'home'), render it.
  // Otherwise, fall back to the static homepage sections below.
  const supabase = createServerComponentClient({ cookies })
  const { data: page } = await supabase
    .from('content_pages')
    .select('*')
    .eq('slug', 'home')
    .eq('published', true)
    .maybeSingle()

  if (page?.content) {
    return (
      <div className="pt-16 min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <article className="prose max-w-none">
            <MDXRemote
              source={page.content}
              options={{
                mdxOptions: {
                  rehypePlugins: rehypeRaw ? [rehypeRaw as any, [rehypeHighlight, {}] as any] : [[rehypeHighlight, {}] as any]
                }
              }}
              components={MDXBuilderComponents as any}
            />
          </article>
        </div>
      </div>
    )
  }

  // Static fallback homepage
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
      <DiscountNewsletterModal />
    </>
  )
}
