-- Simplified admin authentication without Supabase Auth dependency
-- Migration created: 2025-11-01
-- This creates a standalone admin system that doesn't require auth.users

-- Create a simple admin_users table (independent of auth.users)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,  -- TEMPORARY: plain text, use bcrypt in production
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'owner')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert CEO user
INSERT INTO admin_users (name, email, password_hash, role)
VALUES (
  'CEO - Studio37',
  'ceo@studio37.cc',
  '19!Alebest',  -- TEMPORARY PLAIN TEXT
  'admin'
)
ON CONFLICT (email) DO UPDATE
SET 
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy to allow service role to access (for server-side auth)
CREATE POLICY "Service role can access admin users" ON admin_users
  FOR ALL
  USING (true);

-- Create index for fast email lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

COMMENT ON TABLE admin_users IS 'Standalone admin authentication - independent of Supabase Auth';
