-- Purpose: Add homepage hero customization fields to the `settings` table
-- Safe to run multiple times (IF NOT EXISTS guards)

begin;

-- Ensure table exists before altering (no-op if it doesn't)
-- If your schema uses a different schema than public, adjust accordingly
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'settings'
  ) then
    -- Text fields for content and CSS colors/lengths
    execute 'alter table public.settings add column if not exists hero_title text';
    execute 'alter table public.settings add column if not exists hero_subtitle text';
    execute 'alter table public.settings add column if not exists hero_title_color text';
    execute 'alter table public.settings add column if not exists hero_subtitle_color text';
    execute 'alter table public.settings add column if not exists hero_min_height text';

    -- Numeric overlay opacity (0-100)
    execute 'alter table public.settings add column if not exists hero_overlay_opacity integer';

    -- Toggle for inverting MDX/prose on dark backgrounds
    execute 'alter table public.settings add column if not exists home_prose_invert boolean';
  end if;
end $$;

commit;

-- Notes:
-- - Columns are nullable and have no defaults to avoid surprising existing data.
-- - App code provides sensible UI defaults; set defaults here if you want DB-level behavior.
-- - If your RLS policies restrict updates/selects on public.settings, ensure the admin role has access.
