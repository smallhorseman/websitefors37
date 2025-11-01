-- Add book_session_bg_url column to settings table if missing
ALTER TABLE settings ADD COLUMN IF NOT EXISTS book_session_bg_url TEXT;

-- Ensure at least one settings row exists (id arbitrary)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM settings) THEN
    INSERT INTO settings (site_name) VALUES ('Studio 37 Photography');
  END IF;
END$$;
