-- Missing performance indexes for common filters/sorts
-- Safe-guarded with table existence checks to avoid errors in environments

-- Helper: create index if table exists
DO $$
BEGIN
  -- appointments.status
  IF to_regclass('public.appointments') IS NOT NULL THEN
    CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
  END IF;

  -- communication_logs.type
  IF to_regclass('public.communication_logs') IS NOT NULL THEN
    CREATE INDEX IF NOT EXISTS idx_comm_logs_type ON public.communication_logs(type);
  END IF;

  -- email_campaigns.sent_at DESC
  IF to_regclass('public.email_campaigns') IS NOT NULL THEN
    CREATE INDEX IF NOT EXISTS idx_email_campaigns_sent_at ON public.email_campaigns(sent_at DESC);
  END IF;

  -- sms_campaigns.sent_at DESC
  IF to_regclass('public.sms_campaigns') IS NOT NULL THEN
    CREATE INDEX IF NOT EXISTS idx_sms_campaigns_sent_at ON public.sms_campaigns(sent_at DESC);
  END IF;

  -- leads.lead_score DESC
  IF to_regclass('public.leads') IS NOT NULL THEN
    CREATE INDEX IF NOT EXISTS idx_leads_score ON public.leads(lead_score DESC);
  END IF;
END $$;
