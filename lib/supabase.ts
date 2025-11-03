
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions
export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  source: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  priority: 'low' | 'medium' | 'high'
  estimated_value?: number
  created_at: string
  updated_at: string
  assigned_to?: string
  next_follow_up?: string
  tags?: string[]
  notes?: string
  service_interest?: string
  budget_range?: string
  event_date?: string
}

export interface CommunicationLog {
  id: string
  lead_id: string
  type: 'email' | 'phone' | 'meeting' | 'note' | 'sms'
  subject?: string
  content: string
  direction: 'inbound' | 'outbound'
  created_at: string
  created_by: string
  metadata?: Record<string, any>
}

export interface ContentPage {
  id: string
  slug: string
  title: string
  content: string
  meta_description?: string
  meta_keywords?: string
  published: boolean
  created_at: string
  updated_at: string
  author_id?: string
  featured_image?: string
  excerpt?: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featured_image?: string
  published: boolean
  published_at?: string
  meta_description?: string
  meta_keywords?: string[]
  author_id: string
  category?: string
  tags?: string[]
  created_at: string
  updated_at: string
}

export interface GalleryImage {
  id: string
  title: string
  description?: string
  image_url: string
  thumbnail_url?: string
  // Optional optimized/cdn-transformed URL for display
  optimized_url?: string | null
  category: string
  tags?: string[]
  featured: boolean
  order_index: number
  display_order?: number
  alt_text?: string
  created_at: string
  updated_at: string
  // New organizational fields (optional)
  orientation?: 'landscape' | 'portrait' | 'square'
  collection?: string
  hero?: boolean
  color_dominant?: string
  color_palette?: string[]
}

export interface Settings {
  id: string
  key?: string
  value?: any
  type?: 'string' | 'number' | 'boolean' | 'json'
  description?: string
  created_at: string
  updated_at: string
  // Specific settings properties
  site_name?: string
  contact_email?: string
  contact_phone?: string
  business_address?: string
  social_facebook?: string
  social_instagram?: string
  social_twitter?: string
  seo_title_template?: string
  seo_default_description?: string
  theme_primary_color?: string
  theme_secondary_color?: string
}

export interface PageConfig {
  id: string
  slug: string
  data: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  name: string
  email: string
  phone?: string
  type: string
  package_name?: string
  package_key?: string
  start_time: string
  duration_minutes: number
  price_cents?: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'scheduled'
  created_at: string
  updated_at: string
  notes?: string
  client_name?: string
  client_email?: string
  client_phone?: string
  service_type?: string
  preferred_date?: string
  preferred_time?: string
  location?: string
  message?: string
}

// Highlight sets and items
export interface GalleryHighlightSet {
  id: string
  name: string
  slug: string
  description?: string
  is_active: boolean
  config?: Record<string, any>
  slide_duration_ms?: number
  transition?: string
  layout?: string
  created_by?: string | null
  created_at: string
  updated_at: string
}

export interface GalleryHighlightItem {
  id: string
  set_id: string
  image_id: string
  position: number
  caption_override?: string
  link_url?: string
  overlay_color?: string
  overlay_opacity?: number
  duration_ms?: number
  created_at: string
}

// Utility function for paginated data
export async function getPaginatedData<T>(
  table: string,
  pagination: { page: number; limit: number },
  filters: Array<{ column: string; value: any }> = [],
  ordering?: { column: string; ascending: boolean }
): Promise<{
  data: T[]
  count: number
  pageCount: number
}> {
  try {
    let query = supabase
      .from(table)
      .select('*', { count: 'exact' })

    // Apply filters
    filters.forEach(filter => {
      if (filter.value !== undefined && filter.value !== null && filter.value !== '') {
        query = query.eq(filter.column, filter.value)
      }
    })

    // Apply ordering
    if (ordering) {
      query = query.order(ordering.column, { ascending: ordering.ascending })
    }

    // Apply pagination
    const from = (pagination.page - 1) * pagination.limit
    const to = from + pagination.limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) throw error

    const pageCount = count ? Math.ceil(count / pagination.limit) : 0

    return {
      data: data as T[],
      count: count || 0,
      pageCount
    }
  } catch (error) {
    console.error('Error fetching paginated data:', error)
    throw error
  }
}
