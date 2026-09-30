-- ============================================================================
-- RLS REMEDIATION - run this against the LIVE Supabase project.
-- ============================================================================
-- The original schema created these policies:
--
--   create policy "Service role access - <table>" on public.<table>
--     for all using (true) with check (true);
--
-- That is a critical hole. A `for all using (true)` policy applies to EVERY
-- database role, including the public `anon` key, so anybody could INSERT,
-- UPDATE or DELETE all portfolio items, reviews, team members and site content
-- with nothing but the public project URL and the anon key.
--
-- It was also unnecessary: the `service_role` key bypasses RLS entirely, so the
-- server never needed a write policy at all. Writes are only performed by API
-- routes that require a valid admin session cookie.
--
-- The statements below are idempotent: safe to run more than once.
-- ============================================================================

do $$
declare
  policy_name text;
begin
  foreach policy_name in array array[
    'Service role access - portfolio',
    'Service role access - gallery',
    'Service role access - blog',
    'Service role access - work',
    'Service role access - team',
    'Service role access - reviews',
    'Service role access - homepage'
  ]
  loop
    if exists (
      select 1 from pg_policies
      where policyname = policy_name
        and schemaname = 'public'
    ) then
      execute format('drop policy %I on public.%I', policy_name,
        split_part(policy_name, ' - ', 2));
      raise notice 'dropped policy: %', policy_name;
    else
      raise notice 'policy already absent: %', policy_name;
    end if;
  end loop;
end $$;

-- homepage_images had no read policy, so public reads failed. Add one.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where policyname = 'Public read access - homepage'
      and schemaname = 'public'
  ) then
    create policy "Public read access - homepage"
      on public.homepage_images for select using (true);
    raise notice 'created policy: Public read access - homepage';
  end if;
end $$;

-- Verify the result: only `for select` policies should remain.
select policyname, tablename, cmd, roles
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
