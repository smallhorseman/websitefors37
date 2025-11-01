-- Update default settings with accurate Studio37 business information
-- Run this in your Supabase SQL editor to update the settings table

UPDATE settings 
SET 
  site_name = 'Studio37',
  contact_email = 'sales@studio37.cc',
  contact_phone = '832-713-9944',
  business_address = '1701 Goodson Loop, TRLR 80, Pinehurst, TX 77362'
WHERE id = (SELECT id FROM settings LIMIT 1);

-- If no settings row exists yet, insert one
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
  theme_secondary_color,
  google_analytics_id,
  logo_url
)
SELECT 
  'Studio37',
  'sales@studio37.cc',
  '832-713-9944',
  '1701 Goodson Loop, TRLR 80, Pinehurst, TX 77362',
  '',
  '',
  '',
  '%s | Studio37 Photography',
  'Professional photography services in Pinehurst, TX and surrounding areas within 50 miles. Specializing in portraits, weddings, events, and commercial photography.',
  '#b46e14',
  '#111827',
  'G-5NTFJK2GH8',
  'https://res.cloudinary.com/dmjxho2rl/image/upload/v1730486234/studio37-logo-light_xyzvwu.svg'
WHERE NOT EXISTS (SELECT 1 FROM settings);
