-- =====================================================
-- SMS Inbox & Two-Way Messaging Schema
-- Created: 2025-11-12
-- Purpose: Textline-style SMS inbox for lead communication
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- SMS CONVERSATIONS TABLE
-- =====================================================

CREATE TABLE sms_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  
  -- Contact info
  contact_name VARCHAR(255),
  contact_phone VARCHAR(20) NOT NULL UNIQUE,
  
  -- Conversation metadata
  subject VARCHAR(255), -- Optional thread subject
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'spam')),
  
  -- Assignment
  assigned_to UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  
  -- Message stats
  total_messages INTEGER DEFAULT 0,
  unread_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMP WITH TIME ZONE,
  last_message_preview TEXT,
  last_message_direction VARCHAR(10), -- 'inbound' or 'outbound'
  
  -- Tags and notes
  tags TEXT[],
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sms_conversations_lead_id ON sms_conversations(lead_id);
CREATE INDEX idx_sms_conversations_phone ON sms_conversations(contact_phone);
CREATE INDEX idx_sms_conversations_status ON sms_conversations(status);
CREATE INDEX idx_sms_conversations_assigned_to ON sms_conversations(assigned_to);
CREATE INDEX idx_sms_conversations_last_message_at ON sms_conversations(last_message_at DESC);
CREATE INDEX idx_sms_conversations_unread ON sms_conversations(unread_count) WHERE unread_count > 0;
CREATE INDEX idx_sms_conversations_tags ON sms_conversations USING GIN (tags);

-- =====================================================
-- SMS MESSAGES TABLE
-- =====================================================

CREATE TABLE sms_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES sms_conversations(id) ON DELETE CASCADE,
  
  -- Message content
  body TEXT NOT NULL,
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  
  -- Sender/Recipient info
  from_phone VARCHAR(20) NOT NULL,
  to_phone VARCHAR(20) NOT NULL,
  
  -- Twilio provider data
  provider VARCHAR(50) DEFAULT 'twilio',
  provider_message_sid VARCHAR(255) UNIQUE,
  provider_status VARCHAR(50), -- 'queued', 'sent', 'delivered', 'failed', 'received'
  provider_metadata JSONB,
  
  -- Status tracking
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'received')),
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Media attachments (MMS)
  media_urls JSONB DEFAULT '[]'::jsonb, -- Array of media URLs
  num_media INTEGER DEFAULT 0,
  
  -- Cost tracking
  cost_cents INTEGER,
  segments_count INTEGER DEFAULT 1,
  
  -- Error handling
  error_code VARCHAR(50),
  error_message TEXT,
  
  -- Metadata
  sent_by UUID REFERENCES admin_users(id) ON DELETE SET NULL, -- NULL if inbound
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sms_messages_conversation_id ON sms_messages(conversation_id);
CREATE INDEX idx_sms_messages_created_at ON sms_messages(created_at DESC);
CREATE INDEX idx_sms_messages_direction ON sms_messages(direction);
CREATE INDEX idx_sms_messages_provider_sid ON sms_messages(provider_message_sid);
CREATE INDEX idx_sms_messages_status ON sms_messages(status);
CREATE INDEX idx_sms_messages_is_read ON sms_messages(is_read) WHERE direction = 'inbound';

-- =====================================================
-- QUICK REPLIES (SMS TEMPLATES)
-- =====================================================

CREATE TABLE sms_quick_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Template info
  name VARCHAR(255) NOT NULL,
  shortcut VARCHAR(50) UNIQUE, -- e.g., '/thanks', '/confirm'
  message_body TEXT NOT NULL,
  
  -- Organization
  category VARCHAR(50) DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  
  -- Variables support
  variables JSONB DEFAULT '[]'::jsonb, -- [{name: 'firstName', default: ''}]
  
  -- Usage tracking
  use_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quick_replies_shortcut ON sms_quick_replies(shortcut);
CREATE INDEX idx_quick_replies_category ON sms_quick_replies(category);
CREATE INDEX idx_quick_replies_active ON sms_quick_replies(is_active);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update conversation stats when new message added
CREATE OR REPLACE FUNCTION update_conversation_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE sms_conversations
  SET 
    total_messages = total_messages + 1,
    last_message_at = NEW.created_at,
    last_message_preview = LEFT(NEW.body, 100),
    last_message_direction = NEW.direction,
    unread_count = CASE 
      WHEN NEW.direction = 'inbound' THEN unread_count + 1 
      ELSE unread_count 
    END,
    updated_at = NOW()
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_on_new_message
  AFTER INSERT ON sms_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_stats();

-- Mark conversation messages as read
CREATE OR REPLACE FUNCTION mark_conversation_read()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_read = true AND OLD.is_read = false AND NEW.direction = 'inbound' THEN
    UPDATE sms_conversations
    SET unread_count = GREATEST(0, unread_count - 1)
    WHERE id = NEW.conversation_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_unread_count
  AFTER UPDATE ON sms_messages
  FOR EACH ROW
  WHEN (OLD.is_read IS DISTINCT FROM NEW.is_read)
  EXECUTE FUNCTION mark_conversation_read();

-- Standard updated_at triggers
CREATE TRIGGER update_sms_conversations_updated_at BEFORE UPDATE ON sms_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sms_messages_updated_at BEFORE UPDATE ON sms_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quick_replies_updated_at BEFORE UPDATE ON sms_quick_replies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- RLS POLICIES
-- =====================================================

ALTER TABLE sms_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_quick_replies ENABLE ROW LEVEL SECURITY;

-- Admin users can view all conversations (customize based on your auth)
-- These are placeholder policies - adjust based on your admin auth setup

-- =====================================================
-- SEED DATA: Quick Replies
-- =====================================================

INSERT INTO sms_quick_replies (name, shortcut, message_body, category, variables) VALUES
('Thank You', '/thanks', 'Thank you for reaching out! We''ll get back to you shortly. - Studio37', 'general', '[]'::jsonb),
('Appointment Confirmed', '/confirm', 'Hi {{firstName}}! Your appointment on {{date}} at {{time}} is confirmed. Looking forward to seeing you! - Studio37', 'appointments', '[{"name":"firstName","default":""},{"name":"date","default":""},{"name":"time","default":""}]'::jsonb),
('Running Late', '/late', 'Hi! We''re running about {{minutes}} minutes behind schedule. Sorry for the delay! - Studio37', 'appointments', '[{"name":"minutes","default":"10"}]'::jsonb),
('Gallery Ready', '/gallery', 'Great news! Your photos are ready to view. Check your email for the gallery link. - Studio37', 'delivery', '[]'::jsonb),
('Pricing Request', '/pricing', 'Thanks for your interest! Our {{package}} package starts at ${{price}}. Would you like to schedule a consultation to discuss details? - Studio37', 'sales', '[{"name":"package","default":"wedding"},{"name":"price","default":"1500"}]'::jsonb),
('Schedule Consultation', '/consult', 'We''d love to chat! What day works best for a quick 15-minute call? We''re available {{days}}. - Studio37', 'sales', '[{"name":"days","default":"Mon-Fri 9am-5pm"}]'::jsonb);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get or create conversation by phone number
CREATE OR REPLACE FUNCTION get_or_create_conversation(
  p_phone VARCHAR(20),
  p_lead_id UUID DEFAULT NULL,
  p_contact_name VARCHAR(255) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_conversation_id UUID;
BEGIN
  -- Try to find existing conversation
  SELECT id INTO v_conversation_id
  FROM sms_conversations
  WHERE contact_phone = p_phone;
  
  -- Create if doesn't exist
  IF v_conversation_id IS NULL THEN
    INSERT INTO sms_conversations (contact_phone, lead_id, contact_name)
    VALUES (p_phone, p_lead_id, p_contact_name)
    RETURNING id INTO v_conversation_id;
  END IF;
  
  RETURN v_conversation_id;
END;
$$ LANGUAGE plpgsql;

-- Function to mark all messages in a conversation as read
CREATE OR REPLACE FUNCTION mark_conversation_messages_read(p_conversation_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_updated_count INTEGER;
BEGIN
  UPDATE sms_messages
  SET is_read = true, read_at = NOW()
  WHERE conversation_id = p_conversation_id 
    AND direction = 'inbound'
    AND is_read = false;
  
  GET DIAGNOSTICS v_updated_count = ROW_COUNT;
  
  -- Reset unread count on conversation
  UPDATE sms_conversations
  SET unread_count = 0
  WHERE id = p_conversation_id;
  
  RETURN v_updated_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE sms_conversations IS 'SMS conversation threads with leads and clients';
COMMENT ON TABLE sms_messages IS 'Individual SMS messages (inbound and outbound)';
COMMENT ON TABLE sms_quick_replies IS 'Saved message templates for quick responses';
COMMENT ON FUNCTION get_or_create_conversation IS 'Find existing conversation by phone or create new one';
COMMENT ON FUNCTION mark_conversation_messages_read IS 'Mark all unread messages in a conversation as read';

