import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Use safe fallbacks during build to avoid crashes when env vars are missing.
// At runtime (on Netlify/CI), real env vars must be provided.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-placeholder'

// Ensure a singleton client in the browser (prevents Multiple GoTrueClient warnings in dev)
declare global {
  // eslint-disable-next-line no-var
  var __supabase: SupabaseClient | undefined
}

export const supabase: SupabaseClient =
  globalThis.__supabase ?? createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Use a distinct storage key so this public client doesn't clash
      // with the authenticated client used in admin routes.
      storageKey: 'sb-public-anon',
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })

if (typeof window !== 'undefined') {
  globalThis.__supabase = supabase
}

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
  id: number
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
  google_analytics_id?: string
  logo_url?: string
  ai_enabled?: boolean
  ai_model?: string
  ai_key_ref?: string
  // Homepage hero customization
  hero_min_height?: string
  hero_title_color?: string
  hero_subtitle_color?: string
  hero_overlay_opacity?: number
  home_prose_invert?: boolean
  hero_title?: string | null
  hero_subtitle?: string | null
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

// Marketing & Client Portal Types
export interface EmailTemplate {
  id: string
  name: string
  slug: string
  subject: string
  html_content: string
  text_content?: string
  category: string
  variables?: Record<string, any>
  is_active: boolean
  preview_text?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface EmailCampaign {
  id: string
  name: string
  template_id?: string
  subject: string
  html_content: string
  text_content?: string
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled'
  target_type: 'all' | 'segment' | 'individual'
  target_criteria?: Record<string, any>
  recipient_ids?: string[]
  scheduled_at?: string
  sent_at?: string
  total_recipients: number
  total_sent: number
  total_delivered: number
  total_opened: number
  total_clicked: number
  total_bounced: number
  total_unsubscribed: number
  from_name?: string
  from_email?: string
  reply_to?: string
  tags?: string[]
  notes?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface SMSCampaign {
  id: string
  name: string
  template_id?: string
  message_body: string
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled'
  target_type: 'all' | 'segment' | 'individual'
  target_criteria?: Record<string, any>
  recipient_ids?: string[]
  scheduled_at?: string
  sent_at?: string
  total_recipients: number
  total_sent: number
  total_delivered: number
  total_failed: number
  total_clicked: number
  total_replied: number
  from_number?: string
  estimated_cost_cents?: number
  actual_cost_cents?: number
  tags?: string[]
  notes?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface ClientPortalUser {
  id: string
  lead_id?: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  avatar_url?: string
  is_active: boolean
  email_verified: boolean
  preferences?: Record<string, any>
  last_login_at?: string
  login_count: number
  created_at: string
  updated_at: string
}

export interface ClientProject {
  id: string
  client_user_id: string
  appointment_id?: string
  name: string
  type: string
  description?: string
  status: 'pending' | 'scheduled' | 'in-progress' | 'review' | 'completed' | 'delivered' | 'archived'
  session_date?: string
  due_date?: string
  completed_at?: string
  package_name?: string
  total_amount_cents?: number
  paid_amount_cents: number
  payment_status: 'pending' | 'partial' | 'paid' | 'refunded'
  gallery_id?: string
  file_urls?: any[]
  cover_image_url?: string
  metadata?: Record<string, any>
  tags?: string[]
  notes?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface ClientMessage {
  id: string
  project_id?: string
  client_user_id: string
  subject?: string
  message_body: string
  message_type: 'message' | 'notification' | 'approval-request' | 'system'
  sender_type: 'client' | 'admin' | 'system'
  sender_id?: string
  sender_name?: string
  attachments?: any[]
  is_read: boolean
  read_at?: string
  is_starred: boolean
  parent_message_id?: string
  thread_id?: string
  created_at: string
  updated_at: string
}

export interface MarketingPreferences {
  id: string
  lead_id?: string
  email: string
  email_marketing: boolean
  sms_marketing: boolean
  promotional_emails: boolean
  transactional_emails: boolean
  newsletter: boolean
  unsubscribed_at?: string
  unsubscribe_reason?: string
  created_at: string
  updated_at: string
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
