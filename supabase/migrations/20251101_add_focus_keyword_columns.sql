-- Add focus_keyword column to content_pages and blog_posts for persistent SEO targeting
-- This allows the SEO analyzer to remember the target keyword for each piece of content

-- Add focus_keyword to content_pages
alter table public.content_pages
  add column if not exists focus_keyword text;

-- Add focus_keyword to blog_posts
alter table public.blog_posts
  add column if not exists focus_keyword text;

-- Add helpful indexes for searching/filtering by keyword
create index if not exists content_pages_focus_keyword_idx 
  on public.content_pages (focus_keyword) 
  where focus_keyword is not null;

create index if not exists blog_posts_focus_keyword_idx 
  on public.blog_posts (focus_keyword) 
  where focus_keyword is not null;

-- Add comments for documentation
comment on column public.content_pages.focus_keyword is 'Primary SEO target keyword for this page';
comment on column public.blog_posts.focus_keyword is 'Primary SEO target keyword for this blog post';
