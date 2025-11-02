-- Add missing alt_text column so EnhancedGalleryEditor can persist SEO alt text
ALTER TABLE public.gallery_images
  ADD COLUMN IF NOT EXISTS alt_text TEXT;

-- Helpful comment
COMMENT ON COLUMN public.gallery_images.alt_text IS 'Accessible alternative text for this image (used for SEO and screen readers)';
