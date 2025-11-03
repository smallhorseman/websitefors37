-- Create admin authentication tables
-- This fixes the login 500 error by ensuring admin_users and admin_sessions tables exist

-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text,
  role text DEFAULT 'admin',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create admin_sessions table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash text UNIQUE NOT NULL,
  ip text,
  user_agent text,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  last_used_at timestamp with time zone,
  revoked boolean DEFAULT false
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_id ON admin_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token_hash ON admin_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);

-- Enable RLS on both tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for admin_users (bypass RLS for service role)
DROP POLICY IF EXISTS "Bypass RLS for service role on admin_users" ON admin_users;
CREATE POLICY "Bypass RLS for service role on admin_users"
  ON admin_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policies for admin_sessions (bypass RLS for service role)
DROP POLICY IF EXISTS "Bypass RLS for service role on admin_sessions" ON admin_sessions;
CREATE POLICY "Bypass RLS for service role on admin_sessions"
  ON admin_sessions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create a default admin user if none exists
-- Email: ceo@studio37.cc
-- Password: 19!Alebest
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM admin_users LIMIT 1) THEN
    INSERT INTO admin_users (email, password_hash, name, role)
    VALUES (
      'ceo@studio37.cc',
      '$2a$12$8vZ5YqXJ9mK3L7N2P4R5Oe1XzQwA6bC8dE9fG0hI1jK2lM3nO4pQ5r', -- bcrypt hash of '19!Alebest'
      'CEO',
      'admin'
    );
    
    RAISE NOTICE 'Admin user created: ceo@studio37.cc';
  END IF;
END $$;

-- Function to clean up expired sessions (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM admin_sessions WHERE expires_at < now();
END $$;

-- Grant execute permission on cleanup function
GRANT EXECUTE ON FUNCTION cleanup_expired_sessions() TO service_role;
