-- Optional: Add lead assignment feature
-- Migration created: 2025-11-01
-- Run this migration if you want to track which team member is assigned to each lead

-- Add assigned_to column to leads table
-- References user_profiles table (which is linked to auth.users)
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES user_profiles(id) ON DELETE SET NULL;

-- Add index for efficient filtering by assignment
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);

-- Add comment for documentation
COMMENT ON COLUMN leads.assigned_to IS 'References the user_profiles (team member) assigned to handle this lead';
COMMENT ON INDEX idx_leads_assigned_to IS 'Improves performance when filtering leads by assignment';

-- Update RLS policies if needed (optional)
-- This allows assigned users to see their assigned leads
-- CREATE POLICY "Users can view assigned leads" ON leads
--   FOR SELECT
--   USING (assigned_to = auth.uid() OR (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');
