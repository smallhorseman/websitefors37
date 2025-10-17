import { Metadata } from 'next'
import { businessInfo } from '@/lib/seo-config'

interface SEOProps {
  title: string
  description: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  structuredData?: object
  pageType?: 'website' | 'service' | 'article' | 'contact'
}

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage = '/og-image.jpg',
  structuredData,
  pageType = 'website'
}: SEOProps): Metadata {
  const fullTitle = title.includes(businessInfo.name) 
    ? title 
    : `${title} | ${businessInfo.name} - Pinehurst, TX Photography`
  
  const defaultKeywords = [
    'photography',
    'photographer',
    'Pinehurst TX',
    'Texas photography',
    'professional photography',
    businessInfo.name,
    'Studio37',
    'Montgomery County',
    'The Woodlands photography',
    'Houston photography'
  ]

  const allKeywords = [...keywords, ...defaultKeywords]

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: allKeywords.join(', '),
    authors: [{ name: businessInfo.name }],
    creator: businessInfo.name,
    publisher: businessInfo.name,
    formatDetection: {
      telephone: true,
      address: true,
      email: true
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl || businessInfo.contact.website,
      siteName: businessInfo.name,
      locale: 'en_US',
      type: pageType === 'article' ? 'article' : 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${businessInfo.name} - Professional Photography in Pinehurst, TX`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@studio37photo'
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
    alternates: {
      canonical: canonicalUrl || businessInfo.contact.website,
    },
    other: {
      'geo.region': 'US-TX',
      'geo.placename': 'Pinehurst, Texas',
      'geo.position': `${businessInfo.geo.latitude};${businessInfo.geo.longitude}`,
      'ICBM': `${businessInfo.geo.latitude}, ${businessInfo.geo.longitude}`,
      'DC.title': fullTitle,
      'DC.creator': businessInfo.name,
      'DC.subject': allKeywords.slice(0, 5).join(', '),
      'DC.description': description,
      'contact.phone_number': businessInfo.contact.phone,
      'contact.email': businessInfo.contact.email,
      'contact.address': businessInfo.address.fullAddress
    }
  }

  return metadata
}

// Generate JSON-LD structured data as string (for use in head)
export function generateStructuredDataScript(data: object): string {
  return `<script type="application/ld+json">${JSON.stringify(data, null, 0)}</script>`
}

// Generate structured data object for Next.js metadata
export function generateStructuredData(data: object) {
  return {
    type: 'application/ld+json',
    children: JSON.stringify(data, null, 0)
  }
}