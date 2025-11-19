-- page_configs table for inline editor
-- Stores per-page block property overrides
-- Primary use: admin inline editor to customize blocks per page

CREATE TABLE IF NOT EXISTS page_configs (
  path TEXT NOT NULL,
  block_id TEXT NOT NULL,
  block_type TEXT NOT NULL,
  props JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (path, block_id)
);

-- Index for fast lookups by path
CREATE INDEX IF NOT EXISTS idx_page_configs_path ON page_configs(path);

-- Optional: RLS policies if you want row-level security
-- For now, assume service-role access only (via supabaseAdmin in API routes)

-- Example: Allow authenticated admins to read/write
-- ALTER TABLE page_configs ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY admin_full_access ON page_configs
--   FOR ALL
--   USING (auth.jwt() ->> 'role' = 'authenticated');
