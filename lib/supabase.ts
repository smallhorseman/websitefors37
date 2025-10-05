import { createClient } from '@supabase/supabase-js'

// Use environment variables only - no hardcoded values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Only validate in browser environment
if (typeof window !== 'undefined' && (!supabaseUrl || !supabaseKey)) {
  console.warn('Supabase environment variables are not set')
}

// Create client with empty strings if vars are missing (for build time)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
)

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
  notes?: string
}

export interface CommunicationLog {
  id: string
  lead_id: string
  type: 'email' | 'phone' | 'sms' | 'note' | 'meeting' | 'other'
  subject?: string
  content: string
  direction?: 'inbound' | 'outbound' | 'internal'
  created_at: string
  created_by?: string
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

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  featured_image?: string
  author: string
  category: string
  tags?: string[]
  meta_description?: string
  published: boolean
  published_at: string
  created_at: string
  updated_at: string
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageCount: number
}

// Pagination helper
export async function getPaginatedData<T>(
  table: string,
  params: PaginationParams,
  filters?: { column: string; value: any }[],
  orderBy?: { column: string; ascending?: boolean }
): Promise<PaginatedResponse<T>> {
  const { page, limit } = params
  const from = (page - 1) * limit
  const to = from + limit - 1

  // Start query
  let query = supabase.from(table).select('*', { count: 'exact' })

  // Apply filters
  if (filters) {
    filters.forEach(filter => {
      query = query.eq(filter.column, filter.value)
    })
  }

  // Apply ordering
  if (orderBy) {
    query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true })
  }

  // Apply pagination
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching paginated data:', error)
    throw error
  }

  return {
    data: data || [],
    count: count || 0,
    page,
    pageCount: Math.ceil((count || 0) / limit)
  }
}

// Batch operations helper
export async function batchUpdate<T>(
  table: string,
  updates: { id: string; data: Partial<T> }[]
): Promise<void> {
  const promises = updates.map(({ id, data }) =>
    supabase.from(table).update(data).eq('id', id)
  )

  await Promise.all(promises)
}
