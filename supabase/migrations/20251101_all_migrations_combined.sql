-- Complete setup: Run all pending migrations together
-- Migration created: 2025-11-01

-- 1. Add logo_url column to settings
ALTER TABLE settings ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- 2. Add performance indexes for appointments
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_status_time ON appointments(status, start_time DESC);

-- 3. Add composite index for communication logs
CREATE INDEX IF NOT EXISTS idx_communication_logs_lead_date ON communication_logs(lead_id, created_at DESC);

-- Comments on indexes
COMMENT ON INDEX idx_appointments_status IS 'Speeds up appointment status filtering';
COMMENT ON INDEX idx_appointments_status_time IS 'Composite index for filtering by status and sorting by time';
COMMENT ON INDEX idx_communication_logs_lead_date IS 'Optimizes lead detail view communication history';

-- Verify settings table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'settings'
ORDER BY ordinal_position;
