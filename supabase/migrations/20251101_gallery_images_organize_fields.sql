-- Add organizing fields to gallery_images for better highlights control
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS collection TEXT;
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS highlight_group TEXT;
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_gallery_images_tags ON gallery_images USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_gallery_images_collection ON gallery_images(collection);
CREATE INDEX IF NOT EXISTS idx_gallery_images_highlight_group ON gallery_images(highlight_group);
