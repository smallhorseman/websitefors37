-- Migration: Add navigation_items column to settings table
-- This stores the site navigation menu structure as JSONB

ALTER TABLE settings ADD COLUMN IF NOT EXISTS navigation_items JSONB DEFAULT '[]'::jsonb;

-- Add a helpful comment
COMMENT ON COLUMN settings.navigation_items IS 'Array of navigation menu items with label, href, order, and optional icon';

-- Initialize with current hardcoded navigation structure
UPDATE settings 
SET navigation_items = '[
  {
    "id": "home",
    "label": "Home",
    "href": "/",
    "order": 1,
    "visible": true
  },
  {
    "id": "gallery",
    "label": "Gallery",
    "href": "/gallery",
    "order": 2,
    "visible": true
  },
  {
    "id": "services",
    "label": "Services",
    "href": "/services",
    "order": 3,
    "visible": true
  },
  {
    "id": "blog",
    "label": "Blog",
    "href": "/blog",
    "order": 4,
    "visible": true
  },
  {
    "id": "about",
    "label": "About",
    "href": "/about",
    "order": 5,
    "visible": true
  },
  {
    "id": "contact",
    "label": "Contact",
    "href": "/contact",
    "order": 6,
    "visible": true
  },
  {
    "id": "book",
    "label": "Book a Session",
    "href": "/book-a-session",
    "order": 7,
    "visible": true,
    "highlighted": true
  }
]'::jsonb
WHERE navigation_items = '[]'::jsonb OR navigation_items IS NULL;
