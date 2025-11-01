-- Add logo_url to settings for Navigation logo fetch
ALTER TABLE settings ADD COLUMN IF NOT EXISTS logo_url TEXT;
