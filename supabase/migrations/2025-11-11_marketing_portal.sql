-- =====================================================
-- Marketing & Client Communication Portal Schema
-- Created: 2025-11-11
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define/replace helper trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- =====================================================
-- EMAIL MARKETING TABLES
-- =====================================================

-- Email Templates
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  subject VARCHAR(255) NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  category VARCHAR(50) DEFAULT 'general',
  variables JSONB DEFAULT '[]'::jsonb, -- Array of available variables like [{name: 'firstName', default: ''}]
  is_active BOOLEAN DEFAULT true,
  preview_text VARCHAR(255), -- Email preview text shown in inbox
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email_templates_slug ON email_templates(slug);
CREATE INDEX idx_email_templates_category ON email_templates(category);
CREATE INDEX idx_email_templates_active ON email_templates(is_active);

-- Email Campaigns
CREATE TABLE email_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  template_id UUID REFERENCES email_templates(id) ON DELETE SET NULL,
  subject VARCHAR(255) NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled')),
  
  -- Targeting
  target_type VARCHAR(20) NOT NULL DEFAULT 'all' CHECK (target_type IN ('all', 'segment', 'individual')),
  target_criteria JSONB, -- {status: ['new', 'qualified'], tags: ['wedding'], budget_min: 1000}
  recipient_ids UUID[], -- Specific lead IDs if target_type = 'individual'
  
  -- Scheduling
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Analytics
  total_recipients INTEGER DEFAULT 0,
  total_sent INTEGER DEFAULT 0,
  total_delivered INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  total_bounced INTEGER DEFAULT 0,
  total_unsubscribed INTEGER DEFAULT 0,
  
  -- Metadata
  from_name VARCHAR(255) DEFAULT 'Studio37 Photography',
  from_email VARCHAR(255) DEFAULT 'contact@studio37.cc',
  reply_to VARCHAR(255),
  tags TEXT[],
  notes TEXT,
  
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX idx_email_campaigns_scheduled_at ON email_campaigns(scheduled_at);
CREATE INDEX idx_email_campaigns_created_at ON email_campaigns(created_at DESC);
-- Correct GIN index syntax (no 'CREATE GIN INDEX')
CREATE INDEX idx_email_campaigns_tags ON email_campaigns USING GIN (tags);

-- Email Campaign Sends (tracking individual sends)
CREATE TABLE email_campaign_sends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES email_campaigns(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255),
  
  -- Status tracking
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained', 'unsubscribed')),
  
  -- Email service provider data
  provider VARCHAR(50), -- 'resend', 'sendgrid', 'ses', etc.
  provider_message_id VARCHAR(255),
  provider_metadata JSONB,
  
  -- Analytics
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  first_clicked_at TIMESTAMP WITH TIME ZONE,
  click_count INTEGER DEFAULT 0,
  bounced_at TIMESTAMP WITH TIME ZONE,
  bounce_reason TEXT,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  
  -- Error tracking
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_campaign_sends_campaign_id ON email_campaign_sends(campaign_id);
CREATE INDEX idx_campaign_sends_lead_id ON email_campaign_sends(lead_id);
CREATE INDEX idx_campaign_sends_status ON email_campaign_sends(status);
CREATE INDEX idx_campaign_sends_provider_id ON email_campaign_sends(provider_message_id);

-- =====================================================
-- SMS MARKETING TABLES
-- =====================================================

-- SMS Templates
CREATE TABLE sms_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  message_body TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'general',
  variables JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  
  -- SMS-specific
  character_count INTEGER,
  estimated_segments INTEGER DEFAULT 1, -- SMS segments (160 chars each)
  
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sms_templates_slug ON sms_templates(slug);
CREATE INDEX idx_sms_templates_category ON sms_templates(category);
CREATE INDEX idx_sms_templates_active ON sms_templates(is_active);

-- SMS Campaigns
CREATE TABLE sms_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  template_id UUID REFERENCES sms_templates(id) ON DELETE SET NULL,
  message_body TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled')),
  
  -- Targeting
  target_type VARCHAR(20) NOT NULL DEFAULT 'all' CHECK (target_type IN ('all', 'segment', 'individual')),
  target_criteria JSONB,
  recipient_ids UUID[],
  
  -- Scheduling
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Analytics
  total_recipients INTEGER DEFAULT 0,
  total_sent INTEGER DEFAULT 0,
  total_delivered INTEGER DEFAULT 0,
  total_failed INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0, -- If message contains links
  total_replied INTEGER DEFAULT 0,
  
  -- SMS-specific
  from_number VARCHAR(20), -- Twilio phone number
  estimated_cost_cents INTEGER, -- Cost estimation
  actual_cost_cents INTEGER, -- Actual cost after sending
  
  -- Metadata
  tags TEXT[],
  notes TEXT,
  
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sms_campaigns_status ON sms_campaigns(status);
CREATE INDEX idx_sms_campaigns_scheduled_at ON sms_campaigns(scheduled_at);
CREATE INDEX idx_sms_campaigns_created_at ON sms_campaigns(created_at DESC);
CREATE INDEX idx_sms_campaigns_tags ON sms_campaigns USING GIN (tags);

-- SMS Campaign Sends
CREATE TABLE sms_campaign_sends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES sms_campaigns(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  recipient_phone VARCHAR(20) NOT NULL,
  recipient_name VARCHAR(255),
  
  -- Status tracking
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'queued', 'sent', 'delivered', 'failed', 'undelivered')),
  
  -- Provider data (Twilio)
  provider VARCHAR(50) DEFAULT 'twilio',
  provider_message_sid VARCHAR(255),
  provider_status VARCHAR(50),
  provider_metadata JSONB,
  
  -- Analytics
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  failure_reason TEXT,
  
  -- Cost
  cost_cents INTEGER, -- Actual cost per message
  segments_count INTEGER DEFAULT 1,
  
  -- Error tracking
  error_code VARCHAR(50),
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sms_sends_campaign_id ON sms_campaign_sends(campaign_id);
CREATE INDEX idx_sms_sends_lead_id ON sms_campaign_sends(lead_id);
CREATE INDEX idx_sms_sends_status ON sms_campaign_sends(status);
CREATE INDEX idx_sms_sends_provider_sid ON sms_campaign_sends(provider_message_sid);

-- =====================================================
-- CLIENT PORTAL TABLES
-- =====================================================

-- Client Portal Users (separate from leads, linked to them)
CREATE TABLE client_portal_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID UNIQUE REFERENCES leads(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT, -- bcrypt hash
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url TEXT,
  
  -- Access control
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  email_verification_token VARCHAR(255),
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP WITH TIME ZONE,
  
  -- Preferences
  preferences JSONB DEFAULT '{}'::jsonb, -- {notifications: {email: true, sms: false}}
  
  -- Session tracking
  last_login_at TIMESTAMP WITH TIME ZONE,
  login_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_portal_users_email ON client_portal_users(email);
CREATE INDEX idx_portal_users_lead_id ON client_portal_users(lead_id);
CREATE INDEX idx_portal_users_active ON client_portal_users(is_active);

-- Client Projects (photography sessions/bookings accessible via portal)
CREATE TABLE client_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_user_id UUID NOT NULL REFERENCES client_portal_users(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  
  -- Project details
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'wedding', 'portrait', 'event', 'commercial'
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'in-progress', 'review', 'completed', 'delivered', 'archived')),
  
  -- Dates
  session_date TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Financial
  package_name VARCHAR(255),
  total_amount_cents INTEGER,
  paid_amount_cents INTEGER DEFAULT 0,
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded')),
  
  -- Gallery & Files
  gallery_id UUID, -- Link to gallery_highlight_sets or separate project gallery
  file_urls JSONB DEFAULT '[]'::jsonb, -- Array of {name, url, type, size}
  cover_image_url TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  tags TEXT[],
  notes TEXT, -- Admin notes
  
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_client_id ON client_projects(client_user_id);
CREATE INDEX idx_projects_appointment_id ON client_projects(appointment_id);
CREATE INDEX idx_projects_status ON client_projects(status);
CREATE INDEX idx_projects_session_date ON client_projects(session_date);
CREATE INDEX idx_projects_tags ON client_projects USING GIN (tags);

-- Client Messages (two-way communication between studio and clients)
CREATE TABLE client_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES client_projects(id) ON DELETE CASCADE,
  client_user_id UUID REFERENCES client_portal_users(id) ON DELETE CASCADE,
  
  -- Message details
  subject VARCHAR(255),
  message_body TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'message' CHECK (message_type IN ('message', 'notification', 'approval-request', 'system')),
  
  -- Sender info
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('client', 'admin', 'system')),
  sender_id UUID, -- admin_users.id or client_portal_users.id
  sender_name VARCHAR(255),
  
  -- Attachments
  attachments JSONB DEFAULT '[]'::jsonb, -- [{name, url, type, size}]
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  is_starred BOOLEAN DEFAULT false,
  
  -- Threading
  parent_message_id UUID REFERENCES client_messages(id) ON DELETE SET NULL,
  thread_id UUID, -- All messages in a thread share this ID
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_project_id ON client_messages(project_id);
CREATE INDEX idx_messages_client_id ON client_messages(client_user_id);
CREATE INDEX idx_messages_sender_type ON client_messages(sender_type);
CREATE INDEX idx_messages_thread_id ON client_messages(thread_id);
CREATE INDEX idx_messages_created_at ON client_messages(created_at DESC);
CREATE INDEX idx_messages_is_read ON client_messages(is_read);

-- =====================================================
-- UNSUBSCRIBE / PREFERENCES TABLE
-- =====================================================

CREATE TABLE marketing_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID UNIQUE REFERENCES leads(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  
  -- Subscription preferences
  email_marketing BOOLEAN DEFAULT true,
  sms_marketing BOOLEAN DEFAULT true,
  promotional_emails BOOLEAN DEFAULT true,
  transactional_emails BOOLEAN DEFAULT true, -- Can't unsubscribe from these
  newsletter BOOLEAN DEFAULT true,
  
  -- Unsubscribe tracking
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  unsubscribe_reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_marketing_prefs_email ON marketing_preferences(email);
CREATE INDEX idx_marketing_prefs_lead_id ON marketing_preferences(lead_id);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON email_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_sends_updated_at BEFORE UPDATE ON email_campaign_sends
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sms_templates_updated_at BEFORE UPDATE ON sms_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sms_campaigns_updated_at BEFORE UPDATE ON sms_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sms_sends_updated_at BEFORE UPDATE ON sms_campaign_sends
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portal_users_updated_at BEFORE UPDATE ON client_portal_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON client_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON client_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketing_prefs_updated_at BEFORE UPDATE ON marketing_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA: Sample Templates (idempotent inserts)
-- =====================================================

-- Email Templates
INSERT INTO email_templates (name, slug, subject, html_content, text_content, category, variables)
SELECT 'Welcome Email', 'welcome-email', 'Welcome to Studio37 Photography!', 
'<h1>Welcome {{firstName}}!</h1><p>Thank you for your interest in Studio37 Photography. We''re excited to work with you on your {{serviceType}} project!</p><p>Next steps:</p><ul><li>Review your consultation notes</li><li>Check available dates</li><li>View our portfolio</li></ul><p>Best regards,<br>Studio37 Team</p>',
'Welcome {{firstName}}! Thank you for your interest in Studio37 Photography. We''re excited to work with you on your {{serviceType}} project!',
'onboarding',
'[{"name":"firstName","default":"there"},{"name":"serviceType","default":"photography"}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM email_templates WHERE slug = 'welcome-email');

INSERT INTO email_templates (name, slug, subject, html_content, text_content, category, variables)
SELECT 'Session Reminder', 'session-reminder', 'Your Photo Session is Coming Up!',
'<h2>Hi {{firstName}},</h2><p>This is a friendly reminder that your {{sessionType}} session is scheduled for:</p><p><strong>Date:</strong> {{sessionDate}}<br><strong>Time:</strong> {{sessionTime}}<br><strong>Location:</strong> {{location}}</p><p>What to bring:</p><ul><li>Outfit changes (if planned)</li><li>Props or personal items</li><li>Your excitement! 📸</li></ul><p>See you soon!</p>',
'Hi {{firstName}}, Your {{sessionType}} session is on {{sessionDate}} at {{sessionTime}}. Location: {{location}}. See you there!',
'reminders',
'[{"name":"firstName","default":""},{"name":"sessionType","default":"photo"},{"name":"sessionDate","default":""},{"name":"sessionTime","default":""},{"name":"location","default":"Studio37"}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM email_templates WHERE slug = 'session-reminder');

INSERT INTO email_templates (name, slug, subject, html_content, text_content, category, variables)
SELECT 'Photos Ready', 'photos-ready', 'Your Photos Are Ready! 🎉',
'<h1>Great News {{firstName}}!</h1><p>Your photos from your {{sessionType}} session are now ready to view!</p><p><a href="{{galleryLink}}" style="background:#b46e14;color:white;padding:12px 24px;text-decoration:none;border-radius:4px;display:inline-block;margin:20px 0;">View Your Gallery</a></p><p>Your gallery will be available for {{expiryDays}} days. Don''t forget to download your favorites!</p><p>Love your photos? We''d appreciate a review!</p>',
'Hi {{firstName}}! Your photos from your {{sessionType}} session are ready! View them here: {{galleryLink}}',
'delivery',
'[{"name":"firstName","default":""},{"name":"sessionType","default":""},{"name":"galleryLink","default":""},{"name":"expiryDays","default":"30"}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM email_templates WHERE slug = 'photos-ready');

-- SMS Templates
INSERT INTO sms_templates (name, slug, message_body, category, variables, character_count, estimated_segments)
SELECT 'Appointment Confirmation', 'appointment-confirmation', 
'Hi {{firstName}}! Your {{sessionType}} session is confirmed for {{date}} at {{time}}. Reply CONFIRM to acknowledge. - Studio37',
'confirmations',
'[{"name":"firstName","default":""},{"name":"sessionType","default":"photo"},{"name":"date","default":""},{"name":"time","default":""}]'::jsonb,
120, 1
WHERE NOT EXISTS (SELECT 1 FROM sms_templates WHERE slug = 'appointment-confirmation');

INSERT INTO sms_templates (name, slug, message_body, category, variables, character_count, estimated_segments)
SELECT 'Session Reminder 24h', 'session-reminder-24h',
'Reminder: Your photo session is tomorrow at {{time}}! Location: {{location}}. Reply with any questions. - Studio37',
'reminders',
'[{"name":"time","default":""},{"name":"location","default":"our studio"}]'::jsonb,
110, 1
WHERE NOT EXISTS (SELECT 1 FROM sms_templates WHERE slug = 'session-reminder-24h');

INSERT INTO sms_templates (name, slug, message_body, category, variables, character_count, estimated_segments)
SELECT 'Gallery Ready', 'gallery-ready',
'{{firstName}}, your photos are ready! 🎉 View your gallery: {{shortLink}} - Studio37',
'delivery',
'[{"name":"firstName","default":""},{"name":"shortLink","default":""}]'::jsonb,
80, 1
WHERE NOT EXISTS (SELECT 1 FROM sms_templates WHERE slug = 'gallery-ready');

-- =====================================================
-- COMMENTS & DOCUMENTATION
-- =====================================================

COMMENT ON TABLE email_campaigns IS 'Email marketing campaigns sent to leads';
COMMENT ON TABLE sms_campaigns IS 'SMS marketing campaigns sent to leads with phone numbers';
COMMENT ON TABLE client_portal_users IS 'Client login accounts for accessing their projects and galleries';
COMMENT ON TABLE client_projects IS 'Photography projects visible in client portal';
COMMENT ON TABLE client_messages IS 'Two-way messaging between studio and clients';
COMMENT ON TABLE marketing_preferences IS 'Email and SMS subscription preferences and unsubscribe tracking';

-- =====================================================
-- GRANT PERMISSIONS (adjust based on your RLS policies)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaign_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_campaign_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_portal_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_preferences ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (customize based on your auth setup)
-- Admin full access (assumes you have an admin role or auth.uid() check)
-- Client users can only see their own data

-- Client portal users can read their own profile
CREATE POLICY "Users can view own profile" ON client_portal_users
  FOR SELECT USING (auth.uid()::uuid = id);

CREATE POLICY "Users can update own profile" ON client_portal_users
  FOR UPDATE USING (auth.uid()::uuid = id);

-- Clients can view their own projects
CREATE POLICY "Users can view own projects" ON client_projects
  FOR SELECT USING (client_user_id = auth.uid()::uuid);

-- Clients can view messages in their projects
CREATE POLICY "Users can view own messages" ON client_messages
  FOR SELECT USING (client_user_id = auth.uid()::uuid);

CREATE POLICY "Users can send messages" ON client_messages
  FOR INSERT WITH CHECK (client_user_id = auth.uid()::uuid AND sender_type = 'client');

-- Marketing preferences - users can view/update their own
CREATE POLICY "Users can view own preferences" ON marketing_preferences
  FOR SELECT USING (email = (SELECT email FROM client_portal_users WHERE id = auth.uid()::uuid));

CREATE POLICY "Users can update own preferences" ON marketing_preferences
  FOR UPDATE USING (email = (SELECT email FROM client_portal_users WHERE id = auth.uid()::uuid));

-- =====================================================
-- COMPLETED MIGRATION
-- =====================================================
-- Run this migration with: 
-- psql -h <host> -U postgres -d <database> < 2025-11-11_marketing_portal.sql
-- Or via Supabase Dashboard → SQL Editor
