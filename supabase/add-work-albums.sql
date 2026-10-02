-- ---------------------------------------------------------------------------
-- Add Drive-backed albums to an existing database.
--
-- Safe to run more than once: tables, indexes and policies are all guarded.
-- Run this on any database that already has the previous schema, then deploy
-- the application. It does not touch work_projects or any existing content.
--
-- Verify afterwards with the pg_tables / pg_policies query at the bottom.
-- ---------------------------------------------------------------------------

begin;

-- Albums
create table if not exists public.work_albums (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text,
  description text,
  cover_drive_file_id text,
  drive_folder_id text not null,
  drive_folder_url text,
  photo_count integer not null default 0,
  video_count integer not null default 0,
  last_synced_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.work_album_media (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.work_albums (id) on delete cascade,
  drive_file_id text not null,
  filename text not null,
  kind text not null check (kind in ('image', 'video')),
  mime_type text,
  size_bytes bigint not null default 0,
  -- Populated for mirrored videos only. Images derive their display URL from
  -- drive_file_id at render time, because the legacy Drive image URLs that
  -- used to be stored here no longer work.
  storage_path text,
  public_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (album_id, drive_file_id)
);

create index if not exists work_albums_created_at_idx
  on public.work_albums (created_at desc);

create index if not exists work_album_media_album_idx
  on public.work_album_media (album_id, sort_order);

-- Mirror videos into the same bucket as every other upload.
insert into storage.buckets (id, name, public)
values ('thepolity-media', 'thepolity-media', true)
on conflict (id) do nothing;

alter table public.work_albums enable row level security;
alter table public.work_album_media enable row level security;

-- Postgres has no `create policy if not exists`, so check first. Reading the
-- policies is intentionally public.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'work_albums'
      and policyname = 'Public read access - albums'
  ) then
    create policy "Public read access - albums"
      on public.work_albums for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'work_album_media'
      and policyname = 'Public read access - album media'
  ) then
    create policy "Public read access - album media"
      on public.work_album_media for select using (true);
  end if;
end $$;

-- No write policies on purpose: the server writes with the service_role key,
-- which bypasses RLS. A `for all using (true)` policy would hand the public
-- anon key full INSERT/UPDATE/DELETE.

commit;

-- Verification: expect two new rows here.
select tablename
from pg_tables
where schemaname = 'public' and tablename like 'work_album%'
order by tablename;

-- Verification: expect two policies, both `for select`.
select tablename, policyname, cmd
from pg_policies
where schemaname = 'public' and tablename like 'work_album%'
order by tablename, policyname;