-- Ensure the settings table exists (already included in schema.sql)
-- This script just adds a default settings record if none exists

-- Insert default settings if no settings record exists
INSERT INTO settings (
  site_name, 
  contact_email, 
  contact_phone, 
  business_address, 
  social_facebook, 
  social_instagram, 
  social_twitter, 
  seo_title_template, 
  seo_default_description, 
  theme_primary_color, 
  theme_secondary_color
)
SELECT 
  'Studio 37 Photography', 
  'contact@studio37.cc', 
  '', 
  '', 
  '', 
  '', 
  '', 
  '%s | Studio 37 Photography', 
  'Professional photography services for weddings, events, portraits, and commercial projects.', 
  '#0f766e', 
  '#6366f1'
WHERE NOT EXISTS (SELECT 1 FROM settings);

-- Create function to update the updated_at timestamp automatically
DROP FUNCTION IF EXISTS update_settings_timestamp;
CREATE FUNCTION update_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function
DROP TRIGGER IF EXISTS set_settings_timestamp ON settings;
CREATE TRIGGER set_settings_timestamp ON settings
BEFORE UPDATE
FOR EACH ROW
EXECUTE PROCEDURE update_settings_timestamp();
