-- Fix Gallery RLS Policies
-- This ensures public read access works properly for the gallery

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Public can read featured gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Public can read all gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Allow all operations on gallery_images" ON gallery_images;

-- Create a simple, permissive read policy for all gallery images
CREATE POLICY "Public read access to gallery" 
  ON gallery_images 
  FOR SELECT 
  USING (true);

-- Verify RLS is enabled
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Check current data
SELECT COUNT(*) as total_images FROM gallery_images;
SELECT id, title, category, display_order, order_index FROM gallery_images ORDER BY display_order LIMIT 5;
