import { createClient } from '@supabase/supabase-js'

// Use fallback values for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Only validate in browser environment
if (typeof window !== 'undefined') {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
  }
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  message?: string
  service_interest?: string
  budget_range?: string
  event_date?: string
  created_at: string
  status: 'new' | 'contacted' | 'qualified' | 'converted'
}

export interface ContentPage {
  id: string
  title: string
  slug: string
  content: string
  meta_description?: string
  published: boolean
  created_at: string
  updated_at: string
}

export interface GalleryImage {
  id: string
  title: string
  description?: string
  image_url: string
  category: string
  featured: boolean
  created_at: string
}
