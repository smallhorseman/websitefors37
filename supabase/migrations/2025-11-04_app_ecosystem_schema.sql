-- Migration: App Ecosystem Schema
-- Purpose: Support Workflow App, Mobile Companion, Client Portal, and AI Platform
-- Date: 2025-11-04

-- ============================================================================
-- 1. App Users (extends admin_users for multi-app access)
-- ============================================================================

CREATE TABLE IF NOT EXISTS app_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('admin', 'photographer', 'client', 'tenant_admin')),
  app_access jsonb DEFAULT '{"workflow": false, "companion": false, "portal": false, "ai_platform": false}'::jsonb,
  profile jsonb DEFAULT '{}'::jsonb, -- name, phone, avatar_url, etc.
  admin_user_id uuid REFERENCES admin_users(id) ON DELETE SET NULL, -- Link to existing admin if applicable
  tenant_id uuid, -- For white-label multi-tenancy (FK added later)
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  last_login_at timestamp
);

CREATE INDEX idx_app_users_email ON app_users(email);
CREATE INDEX idx_app_users_type ON app_users(user_type);
CREATE INDEX idx_app_users_tenant ON app_users(tenant_id);

-- ============================================================================
-- 2. Tenant Configuration (White-label support)
-- ============================================================================

CREATE TABLE IF NOT EXISTS tenant_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL, -- Subdomain or custom domain
  name text NOT NULL,
  branding jsonb DEFAULT '{
    "logo_url": "",
    "primary_color": "#b46e14",
    "secondary_color": "#0f172a",
    "custom_domain": null
  }'::jsonb,
  features jsonb DEFAULT '{
    "workflow_app": true,
    "client_portal": true,
    "ai_tools": false,
    "white_label": false
  }'::jsonb,
  billing jsonb DEFAULT '{
    "plan": "free",
    "stripe_customer_id": null,
    "subscription_status": "inactive"
  }'::jsonb,
  settings jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE INDEX idx_tenant_slug ON tenant_config(slug);
CREATE INDEX idx_tenant_active ON tenant_config(is_active);

-- Add FK constraint to app_users now that tenant_config exists
ALTER TABLE app_users ADD CONSTRAINT fk_app_users_tenant 
  FOREIGN KEY (tenant_id) REFERENCES tenant_config(id) ON DELETE CASCADE;

-- ============================================================================
-- 3. Shoots (Core workflow entity)
-- ============================================================================

CREATE TABLE IF NOT EXISTS shoots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenant_config(id) ON DELETE CASCADE,
  client_id uuid REFERENCES leads(id) ON DELETE SET NULL, -- Link to existing leads table
  photographer_id uuid REFERENCES app_users(id) ON DELETE SET NULL,
  title text NOT NULL,
  shoot_type text, -- 'wedding', 'portrait', 'event', 'commercial', etc.
  shoot_date date,
  shoot_time time,
  location_name text,
  location_address text,
  location_lat decimal(10, 7),
  location_lng decimal(10, 7),
  shot_list jsonb DEFAULT '[]'::jsonb, -- [{ id, description, completed, image_id, notes }]
  equipment_checklist jsonb DEFAULT '[]'::jsonb, -- [{ item, checked }]
  notes text,
  status text DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'delivered', 'cancelled')),
  metadata jsonb DEFAULT '{}'::jsonb, -- Weather, duration, etc.
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  completed_at timestamp
);

CREATE INDEX idx_shoots_tenant ON shoots(tenant_id);
CREATE INDEX idx_shoots_client ON shoots(client_id);
CREATE INDEX idx_shoots_photographer ON shoots(photographer_id);
CREATE INDEX idx_shoots_date ON shoots(shoot_date);
CREATE INDEX idx_shoots_status ON shoots(status);

-- ============================================================================
-- 4. Shoot Photos (Links gallery images to shoots)
-- ============================================================================

CREATE TABLE IF NOT EXISTS shoot_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shoot_id uuid REFERENCES shoots(id) ON DELETE CASCADE,
  gallery_image_id uuid REFERENCES gallery_images(id) ON DELETE CASCADE,
  shot_list_item_id text, -- Links to shoots.shot_list[].id
  sequence_number int, -- Order in shoot
  metadata jsonb DEFAULT '{}'::jsonb, -- GPS, camera settings, notes, tags
  upload_source text DEFAULT 'workflow_app', -- 'workflow_app', 'web', 'mobile_companion'
  uploaded_at timestamp DEFAULT now(),
  created_at timestamp DEFAULT now()
);

CREATE INDEX idx_shoot_photos_shoot ON shoot_photos(shoot_id);
CREATE INDEX idx_shoot_photos_gallery ON shoot_photos(gallery_image_id);
CREATE INDEX idx_shoot_photos_uploaded ON shoot_photos(uploaded_at);

-- ============================================================================
-- 5. Client Accounts (For Client Portal)
-- ============================================================================

CREATE TABLE IF NOT EXISTS client_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenant_config(id) ON DELETE CASCADE,
  app_user_id uuid REFERENCES app_users(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL, -- Link to original lead
  display_name text,
  access_code text UNIQUE, -- One-time code for initial login
  gallery_access jsonb DEFAULT '[]'::jsonb, -- Array of gallery_image IDs or shoot IDs
  permissions jsonb DEFAULT '{
    "can_download": true,
    "can_select_favorites": true,
    "can_request_edits": false
  }'::jsonb,
  contract_signed boolean DEFAULT false,
  contract_signed_at timestamp,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded')),
  stripe_customer_id text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE INDEX idx_client_accounts_tenant ON client_accounts(tenant_id);
CREATE INDEX idx_client_accounts_user ON client_accounts(app_user_id);
CREATE INDEX idx_client_accounts_access_code ON client_accounts(access_code);

-- ============================================================================
-- 6. AI Processing Jobs (For AI Platform)
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_processing_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenant_config(id) ON DELETE CASCADE,
  user_id uuid REFERENCES app_users(id) ON DELETE SET NULL,
  job_type text NOT NULL CHECK (job_type IN ('photo_enhancement', 'seo_generation', 'alt_text', 'content_generation', 'analytics')),
  input_data jsonb NOT NULL, -- Varies by job type
  output_data jsonb, -- Results after processing
  status text DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  progress int DEFAULT 0, -- 0-100
  error_message text,
  credits_used decimal(10, 2) DEFAULT 0, -- For billing
  processing_time_ms int,
  created_at timestamp DEFAULT now(),
  started_at timestamp,
  completed_at timestamp
);

CREATE INDEX idx_ai_jobs_tenant ON ai_processing_jobs(tenant_id);
CREATE INDEX idx_ai_jobs_user ON ai_processing_jobs(user_id);
CREATE INDEX idx_ai_jobs_status ON ai_processing_jobs(status);
CREATE INDEX idx_ai_jobs_type ON ai_processing_jobs(job_type);
CREATE INDEX idx_ai_jobs_created ON ai_processing_jobs(created_at DESC);

-- ============================================================================
-- 7. App Sessions (Cross-app session tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS app_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES app_users(id) ON DELETE CASCADE,
  app_name text NOT NULL CHECK (app_name IN ('workflow', 'companion', 'portal', 'ai_platform', 'web_admin')),
  device_info jsonb DEFAULT '{}'::jsonb, -- device_type, os, app_version, etc.
  session_token_hash text, -- Hashed token (like admin_sessions)
  ip_address inet,
  last_active_at timestamp DEFAULT now(),
  expires_at timestamp,
  revoked boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);

CREATE INDEX idx_app_sessions_user ON app_sessions(user_id);
CREATE INDEX idx_app_sessions_token ON app_sessions(session_token_hash);
CREATE INDEX idx_app_sessions_app ON app_sessions(app_name);
CREATE INDEX idx_app_sessions_active ON app_sessions(last_active_at) WHERE NOT revoked;

-- ============================================================================
-- 8. Client Gallery Favorites (Photo selection for Client Portal)
-- ============================================================================

CREATE TABLE IF NOT EXISTS client_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_account_id uuid REFERENCES client_accounts(id) ON DELETE CASCADE,
  gallery_image_id uuid REFERENCES gallery_images(id) ON DELETE CASCADE,
  shoot_id uuid REFERENCES shoots(id) ON DELETE SET NULL,
  rating int CHECK (rating >= 1 AND rating <= 5), -- Optional star rating
  notes text, -- Client notes/edit requests
  created_at timestamp DEFAULT now()
);

CREATE UNIQUE INDEX idx_client_favorites_unique ON client_favorites(client_account_id, gallery_image_id);
CREATE INDEX idx_client_favorites_shoot ON client_favorites(shoot_id);

-- ============================================================================
-- 9. Helper Functions
-- ============================================================================

-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_app_users_updated_at BEFORE UPDATE ON app_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_config_updated_at BEFORE UPDATE ON tenant_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shoots_updated_at BEFORE UPDATE ON shoots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_accounts_updated_at BEFORE UPDATE ON client_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 10. Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on all new tables
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE shoots ENABLE ROW LEVEL SECURITY;
ALTER TABLE shoot_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_processing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_favorites ENABLE ROW LEVEL SECURITY;

-- Basic policies (expand these based on your auth strategy)

-- App users can read their own record
CREATE POLICY app_users_select_own ON app_users
  FOR SELECT USING (auth.uid() = id);

-- Admins/photographers can read shoots in their tenant
CREATE POLICY shoots_select_tenant ON shoots
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM app_users WHERE id = auth.uid() AND user_type IN ('admin', 'photographer', 'tenant_admin')
    )
  );

-- Client accounts can read their own data
CREATE POLICY client_accounts_select_own ON client_accounts
  FOR SELECT USING (app_user_id = auth.uid());

-- AI jobs can be read by the user who created them or tenant admins
CREATE POLICY ai_jobs_select_own ON ai_processing_jobs
  FOR SELECT USING (
    user_id = auth.uid() OR 
    tenant_id IN (SELECT tenant_id FROM app_users WHERE id = auth.uid() AND user_type = 'tenant_admin')
  );

-- Client favorites: clients can manage their own
CREATE POLICY client_favorites_all ON client_favorites
  USING (
    client_account_id IN (SELECT id FROM client_accounts WHERE app_user_id = auth.uid())
  );

-- ============================================================================
-- 11. Seed Data (Studio37 as default tenant)
-- ============================================================================

INSERT INTO tenant_config (slug, name, branding, features, billing)
VALUES (
  'studio37',
  'Studio37 Photography',
  '{
    "logo_url": "/brand/studio37-logo-dark.svg",
    "primary_color": "#b46e14",
    "secondary_color": "#0f172a",
    "custom_domain": "studio37.cc"
  }'::jsonb,
  '{
    "workflow_app": true,
    "client_portal": true,
    "ai_tools": true,
    "white_label": false
  }'::jsonb,
  '{
    "plan": "enterprise",
    "stripe_customer_id": null,
    "subscription_status": "active"
  }'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- Link existing admin_users to app_users (one-time migration)
INSERT INTO app_users (email, user_type, app_access, admin_user_id, tenant_id)
SELECT 
  email,
  'admin',
  '{
    "workflow": true,
    "companion": true,
    "portal": true,
    "ai_platform": true
  }'::jsonb,
  id,
  (SELECT id FROM tenant_config WHERE slug = 'studio37')
FROM admin_users
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- End of Migration
-- ============================================================================
