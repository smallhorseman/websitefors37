import { supabase } from './supabase'
import type { PageConfig } from './supabase'

export async function getPageConfig(slug: string): Promise<PageConfig | null> {
  const { data, error } = await supabase
    .from('page_configs')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  if (error) {
    console.error('getPageConfig error', error)
    return null
  }
  return data as PageConfig | null
}

export async function upsertPageConfig(slug: string, dataObj: Record<string, any>): Promise<PageConfig | null> {
  const { data, error } = await supabase
    .from('page_configs')
    .upsert({ slug, data: dataObj }, { onConflict: 'slug' })
    .select('*')
    .single()
  if (error) {
    console.error('upsertPageConfig error', error)
    return null
  }
  return data as PageConfig
}
