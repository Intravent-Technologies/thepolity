create extension if not exists pgcrypto;

-- Portfolio Items
create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  image text not null,
  category text not null,
  created_at timestamptz not null default now()
);

-- Gallery Items
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (type in ('image', 'video')),
  url text not null,
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

-- Work Projects
create table if not exists public.work_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  client text not null,
  description text not null,
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
create index if not exists portfolio_items_created_at_idx
  on public.portfolio_items (created_at desc);

create index if not exists gallery_items_created_at_idx
  on public.gallery_items (created_at desc);

-- Storage Bucket
insert into storage.buckets (id, name, public)
values ('thepolity-media', 'thepolity-media', true)
on conflict (id) do nothing;

-- Enable RLS and add policies
alter table public.portfolio_items enable row level security;
alter table public.gallery_items enable row level security;
alter table public.blog_posts enable row level security;
alter table public.work_projects enable row level security;
alter table public.team_members enable row level security;
alter table public.reviews enable row level security;
alter table public.homepage_images enable row level security;

-- Allow public read access
create policy "Public read access - portfolio" on public.portfolio_items for select using (true);
create policy "Public read access - gallery" on public.gallery_items for select using (true);
create policy "Public read access - blog" on public.blog_posts for select using (true);
create policy "Public read access - work" on public.work_projects for select using (true);
create policy "Public read access - team" on public.team_members for select using (true);
create policy "Public read access - reviews" on public.reviews for select using (true);

-- Allow service role full access (for admin operations)
create policy "Service role access - portfolio" on public.portfolio_items for all using (true) with check (true);
create policy "Service role access - gallery" on public.gallery_items for all using (true) with check (true);
create policy "Service role access - blog" on public.blog_posts for all using (true) with check (true);
create policy "Service role access - work" on public.work_projects for all using (true) with check (true);
create policy "Service role access - team" on public.team_members for all using (true) with check (true);
create policy "Service role access - reviews" on public.reviews for all using (true) with check (true);
create policy "Service role access - homepage" on public.homepage_images for all using (true) with check (true);
