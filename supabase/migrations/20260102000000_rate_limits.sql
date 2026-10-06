-- Durable rate-limit buckets.
--
-- The first version of the limiter kept counters in a Map inside the serverless
-- function. That looked like protection but was not: every cold start began with
-- an empty Map, every concurrently-running instance kept its own counters, and
-- Vercel fans traffic across instances by proximity. An attacker guessing the
-- admin password could simply spread attempts across instances and keep the
-- per-instance count under the threshold forever, so the 8-attempts-per-15
-- minutes lockout on the login route was not enforceable in production.
--
-- Counting in Postgres fixes that: every instance reads and writes the same row,
-- and `insert ... on conflict do update` is atomic, so parallel requests cannot
-- race each other into undercounting.
create table if not exists public.rate_limit_buckets (
  bucket_key text primary key,
  hits integer not null default 0,
  reset_at timestamptz not null
);

-- Buckets are operational state, never read by the browser. Row level security
-- with no policies means anon and authenticated roles see nothing; the
-- service_role key used by the API bypasses RLS, which is what `consume_rate_limit`
-- below relies on.
alter table public.rate_limit_buckets enable row level security;

create index if not exists rate_limit_buckets_reset_at_idx
  on public.rate_limit_buckets (reset_at);

-- Atomically count one hit against `p_key` and report whether the caller is
-- still inside the allowance.
--
-- `security definer` is required because the caller presents the service_role
-- key but the table is RLS-protected. `search_path` is pinned so the function
-- cannot be steered into resolving objects from an attacker-controlled schema.
create or replace function public.consume_rate_limit(
  p_key text,
  p_limit integer,
  p_window_ms integer
)
returns table (allowed boolean, remaining integer, retry_after integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hits integer;
  v_reset timestamptz;
begin
  insert into public.rate_limit_buckets as b (bucket_key, hits, reset_at)
  values (p_key, 1, now() + make_interval(secs => p_window_ms::double precision / 1000.0))
  on conflict (bucket_key) do update
    set hits = case
                 when b.reset_at <= now() then 1
                 else b.hits + 1
               end,
        reset_at = case
                     when b.reset_at <= now()
                       then now() + make_interval(secs => p_window_ms::double precision / 1000.0)
                     else b.reset_at
                   end
  returning b.hits, b.reset_at into v_hits, v_reset;

  return query
    select
      v_hits <= p_limit,
      greatest(0, p_limit - v_hits),
      greatest(1, ceil(extract(epoch from (v_reset - now()))));
end;
$$;

-- Only the service role may call it. Without this the function would be
-- executable by any role holding the public anon key, letting anyone consume
-- or, by flooding keys, exhaust other callers' allowances.
revoke all on function public.consume_rate_limit(text, integer, integer) from public;
revoke all on function public.consume_rate_limit(text, integer, integer) from anon;
revoke all on function public.consume_rate_limit(text, integer, integer) from authenticated;
grant execute on function public.consume_rate_limit(text, integer, integer) to service_role;

-- Housekeeping. Expired rows are cheap to overwrite but not free to keep, so
-- the limiter sweeps a slice of them on a small fraction of calls rather than
-- running on a schedule this project does not have.
create or replace function public.prune_rate_limits()
returns integer
language sql
security definer
set search_path = public
as $$
  with gone as (
    delete from public.rate_limit_buckets
    where reset_at <= now() - interval '1 hour'
    returning 1
  )
  select count(*)::integer from gone;
$$;

revoke all on function public.prune_rate_limits() from public;
revoke all on function public.prune_rate_limits() from anon;
revoke all on function public.prune_rate_limits() from authenticated;
grant execute on function public.prune_rate_limits() to service_role;

-- Verification: expect one row, no policies, and the function owned by the
-- function owner with a pinned search_path.
select
  (select count(*) from pg_policies
    where schemaname = 'public' and tablename = 'rate_limit_buckets') as policy_count,
  (select relrowsecurity from pg_class
    where oid = 'public.rate_limit_buckets'::regclass) as rls_enabled,
  (select proconfig from pg_proc
    where oid = 'public.consume_rate_limit(text,integer,integer)'::regprocedure) as function_config;

-- Exercising the counter: the first call in a fresh key must be allowed, and
-- once the allowance is exhausted it must stay denied while recording hits.
select
  allowed,
  remaining
from public.consume_rate_limit('verification-probe', 3, 60000);
