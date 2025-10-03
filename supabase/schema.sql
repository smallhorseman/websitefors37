-- Create leads table for CRM
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  service_interest TEXT,
  budget_range TEXT,
  event_date DATE,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create content_pages table for CMS
CREATE TABLE IF NOT EXISTS content_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  meta_description TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for production)
CREATE POLICY "Public can insert leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read published content" ON content_pages FOR SELECT USING (published = true);
CREATE POLICY "Public can read featured gallery images" ON gallery_images FOR SELECT USING (true);

-- Insert sample data
INSERT INTO content_pages (title, slug, content, published) VALUES
('Home Page', 'home', 'Welcome to Studio 37 Photography', true),
('About Us', 'about', 'Learn more about our photography studio', true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO gallery_images (title, image_url, category, featured) VALUES
('Wedding Portrait', 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92', 'wedding', true),
('Professional Headshot', 'https://images.unsplash.com/photo-1494790108755-2616b612b5a5', 'portrait', true)
ON CONFLICT DO NOTHING;
