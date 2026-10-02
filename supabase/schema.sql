create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Showcase content lives in a single `work_projects` table.
--
-- This table previously coexisted with `portfolio_items` and `gallery_items`,
-- which were three overlapping ways to show the same thing to a visitor. Every
-- field except `title` is nullable: a curated case study fills in `client` and
-- `description`, while a loose media item may carry only a `video_url` and
-- nothing else. The public page already falls back to a placeholder when
-- `image` is absent.
--
-- Database note: this file describes a FRESH install. An existing database
-- must run supabase/merge-into-work.sql instead, because `create table if not
-- exists` will not add the new columns to a table that already exists.
-- ---------------------------------------------------------------------------

-- Work Projects
create table if not exists public.work_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  client text,
  description text,
  image text,
  video_url text,
  created_at timestamptz not null default now()
);

-- Blog Posts
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  date text not null,
  excerpt text not null,
  image text not null
);

-- Team Members
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text not null,
  image text not null
);

-- Reviews
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  content text not null,
  rating integer not null
);

-- Homepage Images
create table if not exists public.homepage_images (
  id text primary key,
  section text not null,
  image_url text not null,
  updated_at timestamptz
);

-- Indexes
create index if not exists work_projects_created_at_idx
  on public.work_projects (created_at desc);

-- Storage Bucket
insert into storage.buckets (id, name, public)
values ('thepolity-media', 'thepolity-media', true)
on conflict (id) do nothing;

-- Enable RLS and add policies
alter table public.work_projects enable row level security;
alter table public.blog_posts enable row level security;
alter table public.team_members enable row level security;
alter table public.reviews enable row level security;
alter table public.homepage_images enable row level security;

-- Allow public read access (site content is intentionally public)
create policy "Public read access - work" on public.work_projects for select using (true);
create policy "Public read access - blog" on public.blog_posts for select using (true);
create policy "Public read access - team" on public.team_members for select using (true);
create policy "Public read access - reviews" on public.reviews for select using (true);
create policy "Public read access - homepage" on public.homepage_images for select using (true);

-- No write policies are created on purpose.
-- Writes are performed exclusively by the server with the service_role key,
-- which bypasses RLS entirely. Adding a `for all using (true)` policy here
-- would grant the public `anon` key full INSERT/UPDATE/DELETE on every table.