-- Admin audit trail.
--
-- This site authenticates with one shared password, so there is no per-person
-- identity to log. That is exactly why an action trail matters: it answers
-- "what changed, when, and from where" after the fact, which is the only
-- reliable signal when a single credential is the whole perimeter.
--
-- Rows are written on a best-effort basis by src/lib/audit.ts. The helper is
-- deliberately unable to fail a request, so an unavailable audit table costs
-- observability rather than functionality.
create table if not exists public.admin_audit_log (
  id bigint generated always as identity primary key,
  occurred_at timestamptz not null default now(),
  action text not null,
  target_type text not null,
  target_id text,
  detail text,
  ip text,
  user_agent text
);

-- Reads are an operator concern, handled with the service role key. No policies
-- are created, so anon and authenticated roles can neither read nor forge rows.
alter table public.admin_audit_log enable row level security;

-- Retention queries are always "most recent first, within a time window".
create index if not exists admin_audit_log_occurred_at_idx
  on public.admin_audit_log (occurred_at desc);

create index if not exists admin_audit_log_action_idx
  on public.admin_audit_log (action);

-- Keep detail text bounded so a malformed client cannot bloat the table; the
-- writer already truncates, this is the backstop.
alter table public.admin_audit_log
  add constraint admin_audit_log_detail_length check (detail is null or length(detail) <= 1000);

-- Verification: expect one row, RLS on, and no policies.
select
  (select relrowsecurity from pg_class
    where oid = 'public.admin_audit_log'::regclass) as rls_enabled,
  (select count(*) from pg_policies
    where schemaname = 'public' and tablename = 'admin_audit_log') as policy_count,
  (select count(*) from pg_indexes
    where tablename = 'admin_audit_log') as index_count;
