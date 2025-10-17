-- CEO Admin User Setup Script for Studio37 Photography
-- Run this in your Supabase SQL Editor to create the CEO admin account

-- First, create the auth user (this needs to be done through Supabase Auth, not SQL)
-- You'll need to sign up through your app or Supabase dashboard with:
-- Email: ceo@studio37.cc
-- Password: 19!Alebest

-- After creating the auth user, run this to set up the profile:
-- Replace 'USER_UUID_HERE' with the actual UUID from auth.users table

-- Step 1: Get the user ID (run this first to get the UUID)
SELECT id, email FROM auth.users WHERE email = 'ceo@studio37.cc';

-- Step 2: Insert the user profile with CEO/Owner role
-- Replace the UUID below with the actual UUID from Step 1
INSERT INTO user_profiles (id, name, email, role, created_at, updated_at)
VALUES (
  'USER_UUID_FROM_STEP_1', -- Replace with actual UUID
  'CEO - Studio37',
  'ceo@studio37.cc',
  'owner',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Verify the user was created correctly
SELECT 
  up.id,
  up.name,
  up.email,
  up.role,
  au.email_confirmed_at,
  up.created_at
FROM user_profiles up
JOIN auth.users au ON up.id = au.id
WHERE up.email = 'ceo@studio37.cc';