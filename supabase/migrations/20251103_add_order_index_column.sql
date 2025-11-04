-- Add order_index column to gallery_images if it doesn't exist
-- This column is used for manual ordering of gallery images
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS order_index INTEGER;

-- Copy existing display_order values to order_index
UPDATE gallery_images SET order_index = display_order WHERE order_index IS NULL;

-- Set default value for new records
ALTER TABLE gallery_images ALTER COLUMN order_index SET DEFAULT 0;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_gallery_images_order_index ON gallery_images(order_index);

-- Update existing NULL values to 0
UPDATE gallery_images SET order_index = 0 WHERE order_index IS NULL;
X