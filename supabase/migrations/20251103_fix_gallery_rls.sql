-- Fix Gallery RLS Policies
-- This ensures public read access works properly AND admin can manage images

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Public can read featured gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Public can read all gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Allow all operations on gallery_images" ON gallery_images;
DROP POLICY IF EXISTS "Public read access to gallery" ON gallery_images;
DROP POLICY IF EXISTS "Admin full access to gallery" ON gallery_images;
DROP POLICY IF EXISTS "Service role full access" ON gallery_images;

-- Create public read policy (for website visitors)
CREATE POLICY "Public read access to gallery" 
  ON gallery_images 
  FOR SELECT 
  USING (true);

-- Create admin write policy (for authenticated service role / admin users)
CREATE POLICY "Service role full access" 
  ON gallery_images 
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Verify RLS is enabled
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Check current data
SELECT COUNT(*) as total_images FROM gallery_images;
SELECT id, title, category, display_order, order_index FROM gallery_images ORDER BY display_order LIMIT 5;
