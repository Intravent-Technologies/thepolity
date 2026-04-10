create extension if not exists pgcrypto;

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  image text not null,
  category text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (type in ('image', 'video')),
  url text not null,
  created_at timestamptz not null default now()
);

create index if not exists portfolio_items_created_at_idx
  on public.portfolio_items (created_at desc);

create index if not exists gallery_items_created_at_idx
  on public.gallery_items (created_at desc);

insert into storage.buckets (id, name, public)
values ('thepolity-media', 'thepolity-media', true)
on conflict (id) do nothing;
