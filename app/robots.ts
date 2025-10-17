import type { MetadataRoute } from 'next'
import { businessInfo } from '@/lib/seo-config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${businessInfo.contact.website}/sitemap.xml`,
  }
}