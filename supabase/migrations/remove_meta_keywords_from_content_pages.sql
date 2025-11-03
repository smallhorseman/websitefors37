-- Remove meta_keywords column from content_pages table
-- This column was removed because it's not needed for the page builder
-- Keywords functionality is only used in blog_posts table

-- Note: The content_pages table schema should be:
-- - id (uuid, primary key)
-- - slug (text, unique)
-- - title (text)
-- - content (text) -- stores MDX
-- - meta_description (text)
-- - published (boolean)
-- - created_at (timestamp)
-- - updated_at (timestamp)

-- If the column exists, you can remove it with:
-- ALTER TABLE content_pages DROP COLUMN IF EXISTS meta_keywords;

-- No action needed if column doesn't exist
