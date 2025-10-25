-- Add meta_keywords column to blog_posts table
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_keywords TEXT[];

-- Add index for meta_keywords (optional, if you plan to search by keywords)
CREATE INDEX IF NOT EXISTS idx_blog_posts_meta_keywords ON blog_posts USING GIN(meta_keywords);