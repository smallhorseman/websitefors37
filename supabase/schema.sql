-- Create leads table for CRM
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='leads' AND xtype='U')
CREATE TABLE leads (
  id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
  name NVARCHAR(MAX) NOT NULL,
  email NVARCHAR(MAX) NOT NULL,
  phone NVARCHAR(MAX),
  message NVARCHAR(MAX),
  service_interest NVARCHAR(MAX),
  budget_range NVARCHAR(MAX),
  event_date DATE,
  status NVARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted')),
  created_at DATETIMEOFFSET DEFAULT GETDATE()
);

-- Create content_pages table for CMS
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='content_pages' AND xtype='U')
CREATE TABLE content_pages (
  id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
  title NVARCHAR(MAX) NOT NULL,
  slug NVARCHAR(450) UNIQUE NOT NULL,
  content NVARCHAR(MAX),
  meta_description NVARCHAR(MAX),
  created_at DATETIMEOFFSET DEFAULT GETDATE(),
  updated_at DATETIMEOFFSET DEFAULT GETDATE()
);

-- Create gallery_images table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='gallery_images' AND xtype='U')
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='gallery_images' AND xtype='U')
CREATE TABLE gallery_images (
  id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
  title NVARCHAR(MAX) NOT NULL,
  description NVARCHAR(MAX),
  image_url NVARCHAR(MAX) NOT NULL,
  category NVARCHAR(MAX) DEFAULT 'general',
  featured BIT DEFAULT 0,
  created_at DATETIMEOFFSET DEFAULT GETDATE()
);
-- Note: Row Level Security and Policies are PostgreSQL-specific features
-- If using a different database system, these commands should be removed or replaced with equivalent security measures

-- Insert some sample data (optional)
INSERT INTO content_pages (title, slug, content, published) VALUES
('Home Page', 'home', 'Welcome to Studio 37 Photography', true),
('About Us', 'about', 'Learn more about our photography studio', true);

INSERT INTO gallery_images (title, image_url, category, featured) VALUES
('Wedding Portrait', 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92', 'wedding', true),
('Professional Headshot', 'https://images.unsplash.com/photo-1494790108755-2616b612b5a5', 'portrait', true);
