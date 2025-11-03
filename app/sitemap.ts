import { createClient } from '@supabase/supabase-js'
import { MetadataRoute } from 'next'
import { businessInfo } from '@/lib/seo-config'

// Cache sitemap generation for 1 hour to reduce Supabase reads and speed responses
export const revalidate = 3600

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
const baseUrl = businessInfo.contact.website

// Priority levels for different content types
const PRIORITIES = {
  homepage: 1.0,
  mainPages: 0.9,
  servicePages: 0.8,
  contentPages: 0.7,
  blogPosts: 0.6,
} as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(supabaseUrl, supabaseKey)
  const currentDate = new Date()
  
  // Static routes - Main pages optimized for local SEO and user journey
  const routes: MetadataRoute.Sitemap = [
    // Homepage - Highest priority
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: PRIORITIES.homepage,
    },
    // Main service pages - High priority for conversions
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: PRIORITIES.mainPages,
    },
    // Individual service pages - High priority for local SEO
    {
      url: `${baseUrl}/services/wedding-photography`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: PRIORITIES.servicePages,
    },
    {
      url: `${baseUrl}/services/portrait-photography`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: PRIORITIES.servicePages,
    },
    {
      url: `${baseUrl}/services/event-photography`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: PRIORITIES.servicePages,
    },
    {
      url: `${baseUrl}/services/commercial-photography`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: PRIORITIES.servicePages,
    },
    {
      url: `${baseUrl}/book-a-session`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: PRIORITIES.mainPages,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: PRIORITIES.mainPages,
    },
    // Local SEO landing page
    {
      url: `${baseUrl}/local-photographer-pinehurst-tx`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: PRIORITIES.servicePages,
    },
    // Portfolio and content pages
    {
      url: `${baseUrl}/gallery`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: PRIORITIES.servicePages,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: PRIORITIES.servicePages,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: PRIORITIES.servicePages,
    },
  ]
  
  // Add all published content pages
  try {
    const { data: pages } = await supabase
      .from('content_pages')
      .select('slug, updated_at')
      .eq('published', true)
    
    if (pages) {
      const contentRoutes = pages.map(page => ({
        url: `${baseUrl}/${page.slug}`,
        lastModified: new Date(page.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
      
      routes.push(...contentRoutes)
    }
  } catch (error) {
    console.error('Error fetching content pages for sitemap:', error)
  }
  
  // Add all published blog posts
  try {
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('published', true)
    
    if (posts) {
      const blogRoutes = posts.map(post => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
      
      routes.push(...blogRoutes)
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
  }
  
  return routes
}
