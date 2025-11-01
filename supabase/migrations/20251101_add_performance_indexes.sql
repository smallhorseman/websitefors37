-- Add performance indexes for frequently queried columns
-- Migration created: 2025-11-01
-- Fixed: Updated to match actual database schema (appointments not bookings)

-- Appointments table indexes (for booking system)
-- Index on status for filtering appointments
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Composite index for common query pattern (status + time)
CREATE INDEX IF NOT EXISTS idx_appointments_status_time ON appointments(status, start_time DESC);

-- Communication logs composite index
-- For querying logs by lead and date (common pattern in lead detail view)
-- Note: Individual indexes on lead_id and created_at already exist
-- This composite index optimizes queries that filter by lead AND sort by date
CREATE INDEX IF NOT EXISTS idx_communication_logs_lead_date ON communication_logs(lead_id, created_at DESC);

-- Comments on indexes for documentation
COMMENT ON INDEX idx_appointments_status IS 'Speeds up appointment status filtering';
COMMENT ON INDEX idx_appointments_status_time IS 'Composite index for filtering by status and sorting by time';
COMMENT ON INDEX idx_communication_logs_lead_date IS 'Optimizes lead detail view communication history';

-- Summary of existing indexes (already in schema):
-- ✓ idx_leads_email (leads.email)
-- ✓ idx_leads_status (leads.status)
-- ✓ idx_leads_created_at (leads.created_at)
-- ✓ idx_pages_slug (content_pages.slug)
-- ✓ idx_pages_updated_at (content_pages.updated_at)
-- ✓ idx_comm_logs_lead_id (communication_logs.lead_id)
-- ✓ idx_comm_logs_created_at (communication_logs.created_at)
-- ✓ idx_page_configs_slug (page_configs.slug)
-- ✓ idx_page_configs_updated_at (page_configs.updated_at)
-- ✓ idx_appointments_time (appointments.start_time, end_time)
-- ✓ idx_appointments_email (appointments.email)

-- Notes on skipped indexes:
-- - leads.assigned_to: Column doesn't exist (would need ALTER TABLE first)
-- - See optional migration file for adding lead assignment feature
