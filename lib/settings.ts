import { createClient } from '@supabase/supabase-js'

export interface SiteSettings {
  site_name: string
  contact_email: string
  contact_phone: string
  business_address: string
  social_facebook: string
  social_instagram: string
  social_twitter: string
  seo_title_template: string
  seo_default_description: string
  theme_primary_color: string
  theme_secondary_color: string
  google_analytics_id: string
  book_session_bg_url?: string
  logo_url?: string
  ai_enabled?: boolean
  ai_model?: string
  ai_key_ref?: string
}

export const DEFAULT_SETTINGS = {
  site_name: 'Studio37 Photography',
  tagline: 'Capturing Moments, Creating Memories',
  contact_email: 'sales@studio37.cc',
  contact_phone: '832-713-9944',
  business_address: '1701 Goodson Loop, TRLR 80, Pinehurst, TX 77362',
  social_facebook: '',
  social_instagram: '',
  social_twitter: '',
  seo_title_template: '%s | Studio37 Photography',
  seo_default_description: 'Professional photography services',
  theme_primary_color: '#b46e14',
  theme_secondary_color: '#111827',
  google_analytics_id: '',
  // Default to the refined badge logo (light variant)
  logo_url: '/brand/studio37-badge-light.svg',
  ai_enabled: false,
  ai_model: 'gemini-1.5-pro',
  ai_key_ref: ''
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    
    if (!supabaseUrl || !supabaseKey) {
      return DEFAULT_SETTINGS
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single()
    
    if (error || !data) {
      return DEFAULT_SETTINGS
    }
    
    return {
      ...DEFAULT_SETTINGS, // Provide defaults
      ...data // Overwrite with actual values from DB
    }
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return DEFAULT_SETTINGS
  }
}

export async function updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings | null> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials')
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // First check if settings exist
    const { data: existing } = await supabase
      .from('settings')
      .select('id')
      .single()
      
    let result
    
    if (existing) {
      // Update existing settings
      result = await supabase
        .from('settings')
        .update(settings)
        .eq('id', existing.id)
        .select('*')
        .single()
    } else {
      // Insert new settings
      result = await supabase
        .from('settings')
        .insert([settings])
        .select('*')
        .single()
    }
    
    if (result.error) throw result.error
    
    return result.data
  } catch (error) {
    console.error('Error updating settings:', error)
    return null
  }
}
