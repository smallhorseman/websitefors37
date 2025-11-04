"use client"

import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { supabase, GalleryImage } from '@/lib/supabase'

export type GalleryQueryParams = {
  categories?: string[]
  featured?: boolean
  limit?: number
  orderBy?: keyof GalleryImage | string
  ascending?: boolean
  select?: string
}

async function fetchGalleryImages(params: GalleryQueryParams = {}): Promise<GalleryImage[]> {
  const {
    categories,
    featured,
    limit,
    orderBy = 'created_at',
    ascending = false,
    select = '*',
  } = params

  let query = supabase
    .from('gallery_images')
    .select(select)

  if (categories && categories.length > 0) {
    query = query.in('category', categories)
  }
  if (typeof featured === 'boolean') {
    query = query.eq('featured', featured)
  }
  if (orderBy) {
    query = query.order(orderBy as string, { ascending })
  }
  if (typeof limit === 'number') {
    query = query.limit(limit)
  }

  const { data, error } = await query.returns<GalleryImage[]>()
  if (error) throw error
  return data ?? []
}

export function useGalleryImages(
  params: GalleryQueryParams = {},
  options?: Omit<UseQueryOptions<GalleryImage[], Error>, 'queryKey' | 'queryFn'>
) {
  const queryKey = ['gallery_images', params] as const
  return useQuery<GalleryImage[], Error>({
    queryKey,
    queryFn: () => fetchGalleryImages(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    ...options,
  })
}

export { fetchGalleryImages }
