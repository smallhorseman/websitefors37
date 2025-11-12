-- Lead Scoring Migration
-- Adds lead scoring fields and auto-scoring logic

-- Add lead_score column to leads table if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'leads' 
    AND column_name = 'lead_score'
  ) THEN
    ALTER TABLE public.leads ADD COLUMN lead_score INTEGER DEFAULT 0;
  END IF;
END$$;

-- Add score_details JSONB column to track score breakdown
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'leads' 
    AND column_name = 'score_details'
  ) THEN
    ALTER TABLE public.leads ADD COLUMN score_details JSONB DEFAULT '{}'::jsonb;
  END IF;
END$$;

-- Add last_activity_at for recency scoring
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'leads' 
    AND column_name = 'last_activity_at'
  ) THEN
    ALTER TABLE public.leads ADD COLUMN last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END$$;

-- Create index on lead_score for fast sorting
CREATE INDEX IF NOT EXISTS idx_leads_score ON public.leads(lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_last_activity ON public.leads(last_activity_at DESC);

-- Function to calculate lead score (returns score and details via OUT params)
CREATE OR REPLACE FUNCTION calculate_lead_score(lead_row leads, OUT score INTEGER, OUT details JSONB)
LANGUAGE plpgsql
AS $$
DECLARE
  days_since_created INTEGER;
  days_since_activity INTEGER;
  comm_count INTEGER;
BEGIN
  -- Initialize
  score := 10; -- Base score
  details := jsonb_build_object('base', 10);

  -- Source scoring
  CASE lead_row.source
    WHEN 'referral' THEN 
      score := score + 20;
      details := details || jsonb_build_object('source', 20);
    WHEN 'chatbot-quote-form' THEN 
      score := score + 15;
      details := details || jsonb_build_object('source', 15);
    WHEN 'google' THEN 
      score := score + 15;
      details := details || jsonb_build_object('source', 15);
    WHEN 'social-media' THEN 
      score := score + 10;
      details := details || jsonb_build_object('source', 10);
    ELSE 
      score := score + 5;
      details := details || jsonb_build_object('source', 5);
  END CASE;

  -- Budget range scoring
  IF lead_row.budget_range IS NOT NULL THEN
    IF lead_row.budget_range LIKE '%5000%' OR lead_row.budget_range LIKE '%10000%' THEN
      score := score + 25;
      details := details || jsonb_build_object('budget', 25);
    ELSIF lead_row.budget_range LIKE '%3000%' OR lead_row.budget_range LIKE '%4000%' THEN
      score := score + 20;
      details := details || jsonb_build_object('budget', 20);
    ELSIF lead_row.budget_range LIKE '%2000%' THEN
      score := score + 15;
      details := details || jsonb_build_object('budget', 15);
    ELSE
      score := score + 10;
      details := details || jsonb_build_object('budget', 10);
    END IF;
  END IF;

  -- Event date proximity (if exists)
  IF lead_row.event_date IS NOT NULL THEN
    days_since_created := EXTRACT(EPOCH FROM (lead_row.event_date::timestamp - lead_row.created_at)) / 86400;
    IF days_since_created > 0 AND days_since_created <= 30 THEN
      score := score + 30;
      details := details || jsonb_build_object('event_proximity', 30);
    ELSIF days_since_created > 30 AND days_since_created <= 90 THEN
      score := score + 20;
      details := details || jsonb_build_object('event_proximity', 20);
    ELSIF days_since_created > 90 AND days_since_created <= 180 THEN
      score := score + 10;
      details := details || jsonb_build_object('event_proximity', 10);
    END IF;
  END IF;

  -- Status scoring
  CASE lead_row.status
    WHEN 'qualified' THEN 
      score := score + 15;
      details := details || jsonb_build_object('status', 15);
    WHEN 'contacted' THEN 
      score := score + 10;
      details := details || jsonb_build_object('status', 10);
    WHEN 'converted' THEN 
      score := score + 30;
      details := details || jsonb_build_object('status', 30);
    ELSE 
      score := score + 5;
      details := details || jsonb_build_object('status', 5);
  END CASE;

  -- Communication frequency (check communication_logs if table exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'communication_logs') THEN
    SELECT COUNT(*) INTO comm_count
    FROM communication_logs
    WHERE lead_id = lead_row.id;
    
    IF comm_count >= 5 THEN
      score := score + 15;
      details := details || jsonb_build_object('engagement', 15);
    ELSIF comm_count >= 3 THEN
      score := score + 10;
      details := details || jsonb_build_object('engagement', 10);
    ELSIF comm_count >= 1 THEN
      score := score + 5;
      details := details || jsonb_build_object('engagement', 5);
    END IF;
  END IF;

  -- Recency penalty (older leads get lower scores)
  days_since_activity := EXTRACT(EPOCH FROM (NOW() - COALESCE(lead_row.last_activity_at, lead_row.created_at))) / 86400;
  IF days_since_activity > 60 THEN
    score := score - 20;
    details := details || jsonb_build_object('recency_penalty', -20);
  ELSIF days_since_activity > 30 THEN
    score := score - 10;
    details := details || jsonb_build_object('recency_penalty', -10);
  END IF;

  -- Ensure score is never negative
  IF score < 0 THEN
    score := 0;
  END IF;
END;
$$;

-- Trigger to auto-update lead score on insert/update
CREATE OR REPLACE FUNCTION trigger_update_lead_score()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  calc_score INTEGER;
  calc_details JSONB;
BEGIN
  -- Calculate score without triggering another update
  SELECT * INTO calc_score, calc_details FROM calculate_lead_score(NEW);
  
  NEW.lead_score := calc_score;
  NEW.score_details := calc_details;
  NEW.last_activity_at := NOW();
  
  RETURN NEW;
END;
$$;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_lead_score_trigger ON public.leads;
CREATE TRIGGER update_lead_score_trigger
  BEFORE INSERT OR UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_lead_score();

-- Backfill scores for existing leads (one-time safe update)
DO $$
DECLARE
  lead_record leads%ROWTYPE;
  calc_score INTEGER;
  calc_details JSONB;
BEGIN
  FOR lead_record IN SELECT * FROM public.leads LOOP
    SELECT score, details INTO calc_score, calc_details FROM calculate_lead_score(lead_record);
    UPDATE public.leads 
    SET lead_score = calc_score, 
        score_details = calc_details,
        last_activity_at = COALESCE(last_activity_at, NOW())
    WHERE id = lead_record.id;
  END LOOP;
END $$;

-- Add comment
COMMENT ON COLUMN public.leads.lead_score IS 'Auto-calculated lead score based on source, budget, status, engagement, and recency';
COMMENT ON COLUMN public.leads.score_details IS 'Breakdown of score calculation for transparency';
COMMENT ON COLUMN public.leads.last_activity_at IS 'Last time the lead was active or updated';

