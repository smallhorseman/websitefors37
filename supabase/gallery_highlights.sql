-- Gallery highlight sets and items, plus additional organization fields on images

-- 1) Highlight sets
create table if not exists gallery_highlight_sets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  is_active boolean not null default true,
  config jsonb, -- stores filter-based config from the editor
  slide_duration_ms integer default 4000,
  transition text default 'fade',
  layout text default 'grid',
  created_by uuid references admin_users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_gallery_highlight_sets_slug on gallery_highlight_sets(slug);

-- 2) Optional curated items (manual ordering/overrides)
create table if not exists gallery_highlight_items (
  id uuid primary key default gen_random_uuid(),
  set_id uuid not null references gallery_highlight_sets(id) on delete cascade,
  image_id uuid not null references gallery_images(id) on delete cascade,
  position integer not null default 0,
  caption_override text,
  link_url text,
  overlay_color text,
  overlay_opacity numeric,
  duration_ms integer,
  created_at timestamptz not null default now()
);

create index if not exists idx_gallery_highlight_items_set_id on gallery_highlight_items(set_id);
create index if not exists idx_gallery_highlight_items_position on gallery_highlight_items(set_id, position);

-- 3) Add organization fields to gallery_images (all optional)
alter table gallery_images
  add column if not exists orientation text check (orientation in ('landscape','portrait','square')),
  add column if not exists collection text,
  add column if not exists hero boolean default false,
  add column if not exists color_dominant text,
  add column if not exists color_palette text[];

-- Trigger to auto-update updated_at on sets
create or replace function set_updated_at_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger trg_update_gallery_highlight_sets_updated
before update on gallery_highlight_sets
for each row execute function set_updated_at_timestamp();
