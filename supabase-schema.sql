-- ═══════════════════════════════════════════════════════════════
-- Review Copilot — Supabase Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor → New query
-- ═══════════════════════════════════════════════════════════════

-- ── 1. Profiles table ────────────────────────────────────────────
-- Mirrors auth.users but stores app-specific data.
-- Auto-created via trigger when a user signs up.
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  name            text,
  biz             text,
  biz_type        text    default 'Business',
  google_connected boolean default false,
  google_account  text    default '',
  google_connected_at timestamptz,
  created_at      timestamptz default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Users can only read/write their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ── 2. Auto-create profile on signup ────────────────────────────
-- This trigger fires immediately after a new user is created in auth.users.
-- It reads the metadata passed during signUp() and inserts into profiles.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, biz, biz_type)
  values (
    new.id,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'biz',
    coalesce(new.raw_user_meta_data->>'biz_type', 'Business')
  );
  return new;
end;
$$;

-- Drop existing trigger if it exists, then recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ── 3. Reviews table ─────────────────────────────────────────────
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  author      text not null,
  avatar      text default '',
  rating      integer not null check (rating between 1 and 5),
  text        text not null,
  sentiment   text default 'neutral' check (sentiment in ('positive','neutral','negative')),
  replied     boolean default false,
  reply       text default '',
  replied_at  timestamptz,
  flagged     boolean default false,
  source      text default 'manual',   -- 'google' | 'manual' | 'imported'
  created_at  timestamptz default now()
);

-- Enable Row Level Security
alter table public.reviews enable row level security;

-- Users can only access their own reviews
create policy "Users can view own reviews"
  on public.reviews for select
  using (auth.uid() = user_id);

create policy "Users can insert own reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update own reviews"
  on public.reviews for update
  using (auth.uid() = user_id);

create policy "Users can delete own reviews"
  on public.reviews for delete
  using (auth.uid() = user_id);


-- ── 4. Indexes for performance ───────────────────────────────────
create index if not exists reviews_user_id_idx       on public.reviews (user_id);
create index if not exists reviews_created_at_idx    on public.reviews (created_at desc);
create index if not exists reviews_user_created_idx  on public.reviews (user_id, created_at desc);


-- ── 5. Verify ────────────────────────────────────────────────────
-- Run this to confirm everything was created:
-- select table_name from information_schema.tables where table_schema = 'public';
