-- Helper function to increment a campaign stat for SMS or Email campaigns
-- This supports fields present in either sms_campaigns or email_campaigns.
-- Called from application via: supabase.rpc('increment_campaign_stat', { campaign_id, stat_field })
-- Safe to run repeatedly (CREATE OR REPLACE).

CREATE OR REPLACE FUNCTION public.increment_campaign_stat(campaign_id uuid, stat_field text)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  updated_count integer;
BEGIN
  IF stat_field NOT IN (
    'total_sent','total_failed','total_delivered','total_clicked','total_replied',
    'total_opened','total_bounced','total_unsubscribed','total_recipients'
  ) THEN
    RAISE EXCEPTION 'Invalid stat field %', stat_field;
  END IF;

  -- Try SMS campaigns first
  EXECUTE format('UPDATE sms_campaigns SET %I = COALESCE(%I,0) + 1, updated_at = NOW() WHERE id = $1', stat_field, stat_field)
  USING campaign_id;
  GET DIAGNOSTICS updated_count = ROW_COUNT;

  -- If not an SMS campaign, try email campaigns
  IF updated_count = 0 THEN
    EXECUTE format('UPDATE email_campaigns SET %I = COALESCE(%I,0) + 1, updated_at = NOW() WHERE id = $1', stat_field, stat_field)
    USING campaign_id;
  END IF;
END;
$$;

COMMENT ON FUNCTION public.increment_campaign_stat(uuid, text) IS 'Increments a specific stat column for either an SMS or Email campaign depending on which table contains the campaign id.';
