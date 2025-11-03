-- Admin sessions table for secure cookie-based sessions
-- Run this in your Supabase SQL editor or via migrations

create table if not exists admin_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references admin_users(id) on delete cascade,
  token_hash text not null unique,
  created_at timestamptz not null default now(),
  last_used_at timestamptz,
  expires_at timestamptz not null,
  revoked boolean not null default false,
  ip text,
  user_agent text
);

-- Helpful indexes
create index if not exists idx_admin_sessions_user_id on admin_sessions(user_id);
create index if not exists idx_admin_sessions_token_hash on admin_sessions(token_hash);
create index if not exists idx_admin_sessions_expires_at on admin_sessions(expires_at);

-- (Optional) RLS policies: adjust to your setup. Example:
-- alter table admin_sessions enable row level security;
-- create policy "allow user manage own sessions" on admin_sessions
--   for all to authenticated using (auth.uid() = user_id);
-- Note: If you use anon client from server environment, you might rely on service role
-- or custom RLS that allows server-side operations from your backend only.
