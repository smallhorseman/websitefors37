-- Create leads table for CRM
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT,
  service_interest VARCHAR(100),
  budget_range VARCHAR(100),
  event_date DATE,
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- Create communication_logs table
CREATE TABLE IF NOT EXISTS communication_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('email', 'phone', 'sms', 'note', 'meeting', 'other')),
  subject TEXT,
  content TEXT NOT NULL,
  direction VARCHAR(20) CHECK (direction IN ('inbound', 'outbound', 'internal')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255) DEFAULT 'admin'
);

-- Create blog_posts table for SEO
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author TEXT DEFAULT 'Studio 37',
  category TEXT DEFAULT 'photography',
  tags TEXT[],
  meta_description TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for blog posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);

-- Enable RLS for blog posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for blog posts
CREATE POLICY "Public can read published blog posts" ON blog_posts 
  FOR SELECT USING (published = true);
CREATE POLICY "Admin can manage blog posts" ON blog_posts
  FOR ALL USING (true);

-- Add notes column if it doesn't exist
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_comm_logs_lead_id ON communication_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_comm_logs_created_at ON communication_logs(created_at DESC);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for production)
CREATE POLICY "Public can insert leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read published content" ON content_pages FOR SELECT USING (published = true);
CREATE POLICY "Public can read featured gallery images" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Public can read published blog posts" ON blog_posts 
  FOR SELECT USING (published = true);

-- Create a policy that allows all operations (for now - you can restrict this later)
CREATE POLICY "Enable all operations for all users" ON leads
  FOR ALL USING (true);

-- Create policy for communication logs
CREATE POLICY "Enable all operations for communication logs" ON communication_logs
  FOR ALL USING (true);

-- Create settings table for site configuration
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT DEFAULT 'Studio 37 Photography',
  contact_email TEXT,
  contact_phone TEXT,
  business_address TEXT,
  social_facebook TEXT,
  social_instagram TEXT,
  social_twitter TEXT,
  seo_title_template TEXT DEFAULT '%s | Studio 37 Photography',
  seo_default_description TEXT,
  theme_primary_color TEXT DEFAULT '#0f766e',
  theme_secondary_color TEXT DEFAULT '#6366f1',
  google_analytics_id TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for settings
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policy for settings (admins only)
CREATE POLICY "Enable all operations for admins only" ON settings
  FOR ALL USING (true);

-- Insert sample data
INSERT INTO content_pages (title, slug, content, published) VALUES
('Home Page', 'home', 'Welcome to Studio 37 Photography', true),
('About Us', 'about', 'Learn more about our photography studio', true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO gallery_images (title, image_url, category, featured) VALUES
('Wedding Portrait', 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92', 'wedding', true),
('Professional Headshot', 'https://images.unsplash.com/photo-1494790108755-2616b612b5a5', 'portrait', true)
ON CONFLICT DO NOTHING;

INSERT INTO blog_posts (title, slug, excerpt, content, featured_image, tags, published, published_at)
VALUES
('Top 10 Wedding Photography Tips', 
'top-10-wedding-photography-tips',
'Learn our favorite techniques for capturing stunning wedding photos that couples will cherish forever.',
'# Top 10 Wedding Photography Tips

## 1. Meet with the Couple Beforehand
Getting to know the couple and understanding their vision is crucial for capturing their special day exactly as they envision it.

## 2. Scout the Location
Visit the venue before the wedding to identify the best spots for photos, lighting conditions, and potential challenges.

## 3. Create a Shot List
Work with the couple to create a comprehensive shot list to ensure you capture all the important moments.

## 4. Pack Backup Equipment
Always bring backup cameras, lenses, batteries, and memory cards to prevent any technical issues from ruining the day.

## 5. Capture Candid Moments
Some of the most cherished photos are the genuine, unposed moments of joy, laughter, and tears.

## 6. Master Low Light Photography
Wedding venues often have challenging lighting conditions, so practice your low light photography skills.

## 7. Coordinate with Other Vendors
Work with the wedding planner, videographer, and DJ to ensure everyone can do their job without interference.

## 8. Be Unobtrusive
The best wedding photographers can capture amazing shots without being noticed or disrupting the ceremony.

## 9. Shoot in RAW
RAW files give you more flexibility in post-processing to correct exposure, white balance, and other settings.

## 10. Edit Consistently
Develop a consistent editing style for the entire wedding collection to create a cohesive story.',
'https://images.unsplash.com/photo-1519741497674-611481863552',
ARRAY['wedding', 'photography', 'tips'],
true,
NOW()),

('How to Choose the Right Portrait Photographer', 
'how-to-choose-right-portrait-photographer',
'Finding the perfect portrait photographer for your needs involves more than just looking at portfolios.',
'# How to Choose the Right Portrait Photographer

Selecting a portrait photographer is a personal decision that depends on several factors. Here are some tips to help you find the right professional for your needs:

## 1. Define Your Style Preferences
Before beginning your search, decide what style of portraiture appeals to you. Do you prefer classic and formal portraits, candid lifestyle images, artistic and creative shots, or perhaps a documentary approach? Understanding your own preferences will help narrow down photographers whose work aligns with your vision.

## 2. Research and Review Portfolios
Look at the portfolios of several photographers to assess their:
- Technical skill (lighting, composition, focus)
- Consistency across different shoots
- Style and artistic approach
- Experience with your specific type of portrait (family, corporate, senior, etc.)

## 3. Check Reviews and Testimonials
Read what previous clients have to say about their experience. Pay attention to comments about:
- Professionalism
- Communication
- Ability to make subjects comfortable
- Timeliness in delivery
- Overall satisfaction with the final images

## 4. Consider Your Budget
Portrait photography prices vary widely. Determine your budget beforehand, but remember that higher quality work often commands higher prices. Ask about:
- Session fees
- Print/digital file pricing
- Packages available
- Additional costs (travel, extra editing, props)

## 5. Schedule a Consultation
Meet with your top choices either in person or virtually. This gives you a chance to:
- Discuss your vision
- Assess their personality and communication style
- Ask questions about their process
- See if you feel comfortable with them

## 6. Ask the Right Questions
During your consultation, be sure to ask:
- How they prepare for sessions
- Their approach to posing and direction
- What happens if weather affects outdoor sessions
- Turnaround time for final images
- Retouching and editing policies

## 7. Trust Your Instincts
Ultimately, choose someone whose work you love and whose personality makes you feel comfortable. The best portraits happen when subjects are relaxed and confident in their photographer.',
'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
ARRAY['portrait', 'photography', 'hiring tips'],
true,
NOW())
ON CONFLICT (slug) DO NOTHING;

-- Add indexes to gallery_images table for better query performance
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_gallery_images_featured ON gallery_images(featured);

-- Create specific admin policy for gallery management
CREATE POLICY "Admin can manage gallery images" ON gallery_images
  FOR ALL USING (true);

-- Create a gallery_categories table for better category management
CREATE TABLE IF NOT EXISTS gallery_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for gallery categories
ALTER TABLE gallery_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for gallery_categories
CREATE POLICY "Public can view gallery categories" ON gallery_categories 
  FOR SELECT USING (true);
CREATE POLICY "Admin can manage gallery categories" ON gallery_categories
  FOR ALL USING (true);

-- Add default categories
INSERT INTO gallery_categories (name, slug, display_order) VALUES
('Wedding', 'wedding', 10),
('Portrait', 'portrait', 20),
('Event', 'event', 30),
('Commercial', 'commercial', 40),
('General', 'general', 50)
ON CONFLICT (slug) DO NOTHING;

-- Create storage configuration for gallery images
-- Run this in the Supabase SQL editor separately if not already configured:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);
-- CREATE POLICY "Public can view gallery images" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
-- CREATE POLICY "Authenticated users can upload gallery images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery');
