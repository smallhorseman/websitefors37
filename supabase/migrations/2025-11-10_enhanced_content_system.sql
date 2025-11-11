-- Enhanced Content Management System Migration
-- Adds features for categories, tags, revisions, scheduling, analytics, and collaboration

-- Add new columns to content_pages table
ALTER TABLE content_pages 
  ADD COLUMN IF NOT EXISTS category VARCHAR(100),
  ADD COLUMN IF NOT EXISTS tags TEXT[], -- array of tag strings
  ADD COLUMN IF NOT EXISTS featured_image VARCHAR(500),
  ADD COLUMN IF NOT EXISTS open_graph_image VARCHAR(500),
  ADD COLUMN IF NOT EXISTS open_graph_description TEXT,
  ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS scheduled_unpublish_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'draft', -- draft, review, in_progress, published, archived
  ADD COLUMN IF NOT EXISTS seo_score INTEGER, -- 0-100 SEO quality score
  ADD COLUMN IF NOT EXISTS readability_score INTEGER, -- 0-100 readability score
  ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES content_pages(id) ON DELETE SET NULL, -- for folders/collections
  ADD COLUMN IF NOT EXISTS is_template BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS template_name VARCHAR(200),
  ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_content_pages_category ON content_pages(category);
CREATE INDEX IF NOT EXISTS idx_content_pages_tags ON content_pages USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_content_pages_status ON content_pages(status);
CREATE INDEX IF NOT EXISTS idx_content_pages_parent_id ON content_pages(parent_id);
CREATE INDEX IF NOT EXISTS idx_content_pages_scheduled ON content_pages(scheduled_publish_at, scheduled_unpublish_at);

-- Create content_revisions table for version history
CREATE TABLE IF NOT EXISTS content_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES content_pages(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  content TEXT,
  meta_description TEXT,
  created_by UUID, -- references admin_users(id) but no FK constraint for flexibility
  created_at TIMESTAMPTZ DEFAULT NOW(),
  revision_note TEXT,
  version_number INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_content_revisions_page_id ON content_revisions(page_id);
CREATE INDEX IF NOT EXISTS idx_content_revisions_created_at ON content_revisions(created_at DESC);

-- Create page_comments table for internal collaboration
CREATE TABLE IF NOT EXISTS page_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES content_pages(id) ON DELETE CASCADE,
  user_id UUID, -- references admin_users(id)
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_page_comments_page_id ON page_comments(page_id);
CREATE INDEX IF NOT EXISTS idx_page_comments_resolved ON page_comments(resolved);

-- Create page_analytics table for tracking views and engagement
CREATE TABLE IF NOT EXISTS page_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES content_pages(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  avg_time_on_page INTEGER, -- seconds
  bounce_rate DECIMAL(5,2), -- percentage
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_id, date)
);

CREATE INDEX IF NOT EXISTS idx_page_analytics_page_date ON page_analytics(page_id, date DESC);

-- Create content_categories table for taxonomy
CREATE TABLE IF NOT EXISTS content_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES content_categories(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create activity_log table for audit trail
CREATE TABLE IF NOT EXISTS content_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES content_pages(id) ON DELETE CASCADE,
  user_id UUID, -- references admin_users(id)
  action VARCHAR(100) NOT NULL, -- created, updated, published, unpublished, deleted, etc.
  changes JSONB, -- store what changed
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_log_page_id ON content_activity_log(page_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON content_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON content_activity_log(created_at DESC);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for page_comments
DROP TRIGGER IF EXISTS update_page_comments_updated_at ON page_comments;
CREATE TRIGGER update_page_comments_updated_at
  BEFORE UPDATE ON page_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add trigger for page_analytics
DROP TRIGGER IF EXISTS update_page_analytics_updated_at ON page_analytics;
CREATE TRIGGER update_page_analytics_updated_at
  BEFORE UPDATE ON page_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some default categories
INSERT INTO content_categories (name, slug, description, sort_order)
VALUES 
  ('General', 'general', 'General content pages', 1),
  ('Services', 'services', 'Service description pages', 2),
  ('Portfolio', 'portfolio', 'Portfolio and showcase pages', 3),
  ('Blog', 'blog', 'Blog articles and posts', 4),
  ('Location', 'location', 'Location-specific SEO pages', 5)
ON CONFLICT (slug) DO NOTHING;

-- Update existing pages to have a default status
UPDATE content_pages 
SET status = CASE 
  WHEN published = true THEN 'published'
  ELSE 'draft'
END
WHERE status IS NULL;

COMMENT ON TABLE content_revisions IS 'Stores version history for content pages';
COMMENT ON TABLE page_comments IS 'Internal comments and notes on content pages';
COMMENT ON TABLE page_analytics IS 'Analytics data for content pages';
COMMENT ON TABLE content_categories IS 'Categories for organizing content';
COMMENT ON TABLE content_activity_log IS 'Audit log for content changes';
