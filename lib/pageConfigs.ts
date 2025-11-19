import { supabaseAdmin } from './supabaseAdmin'

export interface PageConfig {
  path: string
  block_id: string
  block_type: string
  props: Record<string, any>
  draft_props?: Record<string, any> | null
  is_published?: boolean
  updated_at: string
}

/**
 * Fetch all block overrides for a given page path from page_configs.
 * Returns a Map keyed by block_id for easy lookups.
 * Call this in server components or API routes.
 */
export async function getPageConfigs(path: string): Promise<Map<string, PageConfig>> {
  const { data, error } = await supabaseAdmin
    .from('page_configs')
    .select('path, block_id, block_type, props, draft_props, is_published, updated_at')
    .eq('path', path)

  if (error) {
    console.error('[getPageConfigs] Error fetching configs for path:', path, error)
    return new Map()
  }

  const map = new Map<string, PageConfig>()
  for (const row of data || []) {
    map.set(row.block_id, row as PageConfig)
  }
  return map
}

/**
 * Get override props for a specific block_id on a page.
 * Returns null if no override exists.
 */
export function getBlockOverride(configs: Map<string, PageConfig>, blockId: string): Record<string, any> | null {
  const config = configs.get(blockId)
  return config ? config.props : null
}

/** Select props based on mode. If useDraft is true and draft_props exist, return draft_props; else props. */
export function selectProps(config: PageConfig | undefined, useDraft: boolean): Record<string, any> | null {
  if (!config) return null
  if (useDraft && config.draft_props && Object.keys(config.draft_props || {}).length > 0) return config.draft_props as any
  return config.props || null
}
