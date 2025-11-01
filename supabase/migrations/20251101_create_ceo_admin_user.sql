-- Create CEO admin user for authentication
-- Migration created: 2025-11-01
-- IMPORTANT: This is a temporary solution with plain text password
-- You MUST add bcrypt hashing before going to production!

-- First, ensure the user_profiles table exists and has the right structure
-- (It should already exist from schema.sql)

-- Insert CEO user into user_profiles
-- Note: This uses a direct insert since we're managing auth manually for now
INSERT INTO user_profiles (id, name, email, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'CEO',
  'ceo@studio37.cc',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- For the temporary auth system, we'll store credentials in a simple auth table
-- Create a temporary admin_credentials table (until you implement proper Supabase Auth)
CREATE TABLE IF NOT EXISTS admin_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,  -- TEMPORARY: storing plain text, MUST use bcrypt in production
  user_profile_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert CEO credentials
-- SECURITY WARNING: This stores the password in plain text
-- You MUST replace this with bcrypt hashing before production!
INSERT INTO admin_credentials (email, password_hash, user_profile_id)
SELECT 
  'ceo@studio37.cc',
  '19!Alebest',  -- TEMPORARY PLAIN TEXT - Replace with bcrypt hash!
  up.id
FROM user_profiles up
WHERE up.email = 'ceo@studio37.cc'
ON CONFLICT (email) DO UPDATE
SET password_hash = EXCLUDED.password_hash;

-- Enable RLS on admin_credentials
ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;

-- Policy to allow service role to access (for server-side auth checks)
CREATE POLICY "Service role can access credentials" ON admin_credentials
  FOR ALL
  USING (true);

COMMENT ON TABLE admin_credentials IS 'TEMPORARY auth table - migrate to Supabase Auth with bcrypt hashing before production';
