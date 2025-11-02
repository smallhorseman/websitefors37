-- Create chatbot_training table for Q&A examples
CREATE TABLE IF NOT EXISTS public.chatbot_training (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chatbot_settings table for personality/configuration
CREATE TABLE IF NOT EXISTS public.chatbot_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  personality TEXT DEFAULT 'friendly',
  tone TEXT DEFAULT 'professional',
  greeting_message TEXT DEFAULT 'Hi! 👋 I''m here to help you with your photography needs at Studio37.\n\nWhat can I help you with today?',
  fallback_message TEXT DEFAULT 'I''m here to help! Our team can answer any questions. Would you like to book a consultation or learn about our services?',
  system_instructions TEXT DEFAULT 'You are a friendly customer service assistant for Studio37 Photography in Pinehurst, TX.',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_chatbot_training_category ON public.chatbot_training(category);
CREATE INDEX IF NOT EXISTS idx_chatbot_training_created_at ON public.chatbot_training(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE public.chatbot_training ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (admin access)
CREATE POLICY "Enable read access for authenticated users" ON public.chatbot_training
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON public.chatbot_training
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON public.chatbot_training
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for authenticated users" ON public.chatbot_training
  FOR DELETE USING (true);

CREATE POLICY "Enable read access for settings" ON public.chatbot_settings
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for settings" ON public.chatbot_settings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for settings" ON public.chatbot_settings
  FOR UPDATE USING (true);

-- Insert default settings row
INSERT INTO public.chatbot_settings (personality, tone, greeting_message, fallback_message, system_instructions)
VALUES (
  'friendly',
  'professional',
  'Hi! 👋 I''m here to help you with your photography needs at Studio37.\n\nWhat can I help you with today?',
  'I''m here to help! Our team can answer any questions. Would you like to book a consultation or learn about our services?',
  'You are a friendly customer service assistant for Studio37 Photography in Pinehurst, TX.'
)
ON CONFLICT DO NOTHING;

-- Add some default training examples
INSERT INTO public.chatbot_training (question, answer, category) VALUES
('What services do you offer?', 'We offer wedding photography, portrait sessions, event photography, commercial shoots, and professional headshots. Each package is customized to your needs!', 'services'),
('How much does a wedding package cost?', 'Our wedding packages typically range from $2,000 to $5,000+ depending on coverage hours, deliverables, and add-ons. I''d love to discuss your specific needs - would you like to schedule a consultation?', 'pricing'),
('What areas do you serve?', 'We''re based in Pinehurst, TX and serve the greater Houston area including The Woodlands, Conroe, and surrounding communities. We also travel for destination weddings!', 'general'),
('How do I book a session?', 'You can book by filling out our contact form, calling us directly, or using our online booking calendar. We typically require a deposit to secure your date. What type of session are you interested in?', 'booking'),
('Do you do engagement photos?', 'Absolutely! Engagement sessions are a great way to get comfortable with the camera before your big day. They''re often included in our wedding packages or available as a standalone session.', 'services'),
('What''s your turnaround time?', 'For portraits and events, you can expect your edited photos within 2-3 weeks. Weddings typically take 4-6 weeks due to the larger volume of images. We always deliver high-quality, professionally edited photos!', 'general')
ON CONFLICT DO NOTHING;

COMMENT ON TABLE public.chatbot_training IS 'Stores Q&A training examples for the AI chatbot';
COMMENT ON TABLE public.chatbot_settings IS 'Stores chatbot personality and configuration settings';
