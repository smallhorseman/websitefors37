-- Optional table for persisting Web Vitals metrics
CREATE TABLE IF NOT EXISTS web_vitals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_id TEXT NOT NULL,
  name TEXT NOT NULL,
  value DOUBLE PRECISION NOT NULL,
  rating TEXT,
  delta DOUBLE PRECISION,
  navigation_type TEXT,
  url TEXT,
  path TEXT,
  user_agent TEXT,
  ip TEXT,
  ts TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS but allow inserts from anon (optional; restrict in production)
ALTER TABLE web_vitals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert web vitals" ON web_vitals FOR INSERT WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_web_vitals_ts ON web_vitals(ts DESC);
CREATE INDEX IF NOT EXISTS idx_web_vitals_name ON web_vitals(name);
