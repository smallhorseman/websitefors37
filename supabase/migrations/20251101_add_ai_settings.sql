-- Add AI settings flags to settings table
ALTER TABLE public.settings
  ADD COLUMN IF NOT EXISTS ai_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS ai_model TEXT DEFAULT 'gemini-1.5-pro',
  ADD COLUMN IF NOT EXISTS ai_key_ref TEXT;

COMMENT ON COLUMN public.settings.ai_enabled IS 'Toggle AI-powered features on or off';
COMMENT ON COLUMN public.settings.ai_model IS 'Preferred AI model identifier for server generation';
COMMENT ON COLUMN public.settings.ai_key_ref IS 'Optional reference label for the API key location (not the key itself)';
