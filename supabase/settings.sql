-- Ensure the settings table exists (already included in schema.sql)
-- This script just adds a default settings record if none exists

-- Insert default settings if no settings record exists
INSERT INTO settings (
  id,
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
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'Studio 37 Photography', 
  'contact@studio37.cc', 
  '', 
  '', 
  '', 
  '', 
  '', 
  '%s | Studio 37 Photography', 
  'Professional photography services for weddings, events, portraits, and commercial projects.', 
  '#b46e14', 
  '#a17a07'
WHERE NOT EXISTS (SELECT 1 FROM settings);

-- Update function is already in schema-complete.sql
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function
DROP TRIGGER IF EXISTS set_settings_timestamp ON settings;
CREATE TRIGGER set_settings_timestamp
BEFORE UPDATE ON settings
FOR EACH ROW
EXECUTE FUNCTION update_settings_timestamp();
    DROP TRIGGER set_settings_timestamp;
GO

CREATE TRIGGER set_settings_timestamp ON settings
AFTER UPDATE
AS
BEGIN
    UPDATE settings
    SET updated_at = GETDATE()
    FROM settings s
    INNER JOIN inserted i ON s.id = i.id;
END;
GO
