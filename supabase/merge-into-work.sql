-- ---------------------------------------------------------------------------
-- Merge `portfolio_items` and `gallery_items` into `work_projects`.
--
-- Run this ONCE against an existing database. A fresh install should just run
-- schema.sql and never touch this file.
--
-- It is written to be re-runnable. Each step that reads the old tables is
-- guarded on those tables still existing, and the final step drops them, so a
-- second run finds nothing to do and inserts nothing.
--
-- BEFORE RUNNING, check what is actually in the old tables. This script copies
-- every row across, so nothing is lost, but you want to see the numbers:
--
--   select (select count(*) from portfolio_items) as portfolio,
--          (select count(*) from gallery_items)  as gallery,
--          (select count(*) from work_projects)  as work;
--
-- Take a backup first. This drops two tables.
-- ---------------------------------------------------------------------------

begin;

-- 1. Add the merged model's columns. `if not exists` keeps this re-runnable.
alter table public.work_projects add column if not exists category text;
alter table public.work_projects add column if not exists client text;
alter table public.work_projects add column if not exists description text;
alter table public.work_projects add column if not exists image text;
alter table public.work_projects add column if not exists video_url text;
alter table public.work_projects
  add column if not exists created_at timestamptz not null default now();

-- 2. Relax the NOT NULL constraints. `client`, `description`, `category` and
--    `image` are all optional in the merged model, and this must happen before
--    the gallery rows are copied in, since those have no client or description.
alter table public.work_projects alter column category drop not null;
alter table public.work_projects alter column client drop not null;
alter table public.work_projects alter column description drop not null;
alter table public.work_projects alter column image drop not null;

-- 3. Ordering index. work_projects previously had no created_at and was sorted
--    by `id`, a uuid, which yields an arbitrary order.
create index if not exists work_projects_created_at_idx
  on public.work_projects (created_at desc);

-- 4. Copy portfolio items across. They were already close to the work shape:
--    a title, a description, a category and a cover image.
do $$
begin
  if to_regclass('public.portfolio_items') is not null then
    insert into public.work_projects
      (title, category, client, description, image, video_url, created_at)
    select p.title, p.category, null, p.description, p.image, null, p.created_at
    from public.portfolio_items p;
  end if;
end
$$;

-- 5. Copy gallery items across. An image item becomes the cover image; a video
--    item becomes video_url with no cover, which the public page renders behind
--    its existing placeholder. Gallery items carry no description or client.
do $$
begin
  if to_regclass('public.gallery_items') is not null then
    insert into public.work_projects
      (title, category, client, description, image, video_url, created_at)
    select
      g.title,
      'Media',
      null,
      null,
      case when g.type = 'image' then g.url else null end,
      case when g.type = 'video' then g.url else null end,
      g.created_at
    from public.gallery_items g;
  end if;
end
$$;

-- 6. Drop the old tables. Their indexes and RLS policies go with them.
drop table if exists public.portfolio_items;
drop table if exists public.gallery_items;

commit;

-- Verify: the total should equal the sum of the three pre-migration counts.
select
  (select count(*) from work_projects where client is not null) as with_client,
  (select count(*) from work_projects where video_url is not null) as with_video,
  (select count(*) from work_projects) as total
from (select 1) as _;