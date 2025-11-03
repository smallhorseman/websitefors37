-- Fix content_pages table schema
-- Remove meta_keywords column if it exists (not needed for page builder)
-- Ensure all required columns exist

-- Drop meta_keywords column if it exists
ALTER TABLE content_pages DROP COLUMN IF EXISTS meta_keywords;

-- Ensure all required columns exist with proper types
DO $$ 
BEGIN
  -- Add id column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='content_pages' AND column_name='id') THEN
    ALTER TABLE content_pages ADD COLUMN id uuid PRIMARY KEY DEFAULT gen_random_uuid();
  END IF;

  -- Add slug column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='content_pages' AND column_name='slug') THEN
    ALTER TABLE content_pages ADD COLUMN slug text UNIQUE NOT NULL;
  END IF;

  -- Add title column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='content_pages' AND column_name='title') THEN
    ALTER TABLE content_pages ADD COLUMN title text;
  END IF;

  -- Add content column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='content_pages' AND column_name='content') THEN
    ALTER TABLE content_pages ADD COLUMN content text;
  END IF;

  -- Add meta_description column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='content_pages' AND column_name='meta_description') THEN
    ALTER TABLE content_pages ADD COLUMN meta_description text;
  END IF;

  -- Add published column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='content_pages' AND column_name='published') THEN
    ALTER TABLE content_pages ADD COLUMN published boolean DEFAULT false;
  END IF;

  -- Add created_at column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='content_pages' AND column_name='created_at') THEN
    ALTER TABLE content_pages ADD COLUMN created_at timestamp with time zone DEFAULT now();
  END IF;

  -- Add updated_at column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='content_pages' AND column_name='updated_at') THEN
    ALTER TABLE content_pages ADD COLUMN updated_at timestamp with time zone DEFAULT now();
  END IF;
END $$;

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_content_pages_slug ON content_pages(slug);

-- Create index on published for filtering
CREATE INDEX IF NOT EXISTS idx_content_pages_published ON content_pages(published);

-- Enable RLS (Row Level Security)
ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to published pages
DROP POLICY IF EXISTS "Allow public read access to published pages" ON content_pages;
CREATE POLICY "Allow public read access to published pages"
  ON content_pages
  FOR SELECT
  USING (published = true);

-- Create policy to allow authenticated users to manage all pages
DROP POLICY IF EXISTS "Allow authenticated users full access" ON content_pages;
CREATE POLICY "Allow authenticated users full access"
  ON content_pages
  FOR ALL
  USING (auth.role() = 'authenticated');
