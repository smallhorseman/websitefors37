import { createClient } from '@supabase/supabase-js'
import { MetadataRoute } from 'next'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.studio37.cc'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // Static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/admin`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/book-a-session`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ] as MetadataRoute.Sitemap
  
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
