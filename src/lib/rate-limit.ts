import type { NextRequest } from 'next/server';
import { isSupabaseConfigured, getSupabaseAdminClient } from '@/lib/storage';

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();
const MAX_TRACKED_KEYS = 10000;
const PRIVATE_IP = /^(10\.|127\.|169\.254\.|192\.168\.|::1|fc|fd|fe80)/i;

function firstNonPrivate(candidate: string): string | null {
  const value = candidate.trim();
  if (!value) {
    return null;
  }
  if (PRIVATE_IP.test(value)) {
    return null;
  }
  return value;
}

/**
 * Resolve the caller address. Platform-set headers are preferred because a
 * client can forge `x-forwarded-for`; when several proxies append to that
 * header the right-most non-private entry is the most trustworthy one.
 */
export function clientIp(request: NextRequest): string {
  const platformHeaders = [
    'x-vercel-forwarded-for',
    'cf-connecting-ip',
    'x-real-ip',
  ];

  for (const header of platformHeaders) {
    const trusted = firstNonPrivate(request.headers.get(header) ?? '');
    if (trusted) {
      return trusted;
    }
  }

  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const parts = forwarded.split(',').map(firstNonPrivate);
    for (let i = parts.length - 1; i >= 0; i -= 1) {
      if (parts[i]) {
        return parts[i] as string;
      }
    }
  }

  return 'unknown';
}

function prune(now: number): void {
  if (buckets.size < MAX_TRACKED_KEYS) {
    return;
  }
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

/**
 * In-memory fallback. Accurate for a single long-lived process and useless
 * across a serverless fleet, so it is only reached when Supabase is unavailable
 * (local development, or a database outage). It is kept because dropping to no
 * limit at all during an outage would be worse than a weak one.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  prune(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  existing.count += 1;
  const remaining = Math.max(0, limit - existing.count);
  const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

  return {
    ok: existing.count <= limit,
    remaining,
    retryAfterSeconds: existing.count <= limit ? 0 : retryAfterSeconds,
  };
}

/** Housekeeping runs on a small share of calls so it costs almost nothing. */
function shouldPruneRemote(): boolean {
  return Math.random() < 0.02;
}

/**
 * Rate limit against a shared Postgres counter so the allowance survives cold
 * starts and is enforced identically across every instance.
 *
 * If the database cannot be reached this falls back to the in-memory limiter
 * rather than failing the request: a transient outage should not lock the site
 * owner out of their own dashboard, and the weaker local limit still catches a
 * casual spray that the durable one would have stopped. A security control that
 * fails *open* with no signal would be the wrong trade here, so the fallback is
 * logged.
 */
export async function rateLimitRequest(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  if (!isSupabaseConfigured()) {
    return rateLimit(key, limit, windowMs);
  }

  try {
    if (shouldPruneRemote()) {
      // Fire and forget: a failure here must never affect the caller's result.
      void getSupabaseAdminClient().rpc('prune_rate_limits').then(({ error }) => {
        if (error) console.error('[rate-limit] prune failed:', error.message);
      });
    }

    const { data, error } = await getSupabaseAdminClient().rpc('consume_rate_limit', {
      p_key: key,
      p_limit: limit,
      p_window_ms: windowMs,
    });

    if (error) throw new Error(error.message);

    const row = (Array.isArray(data) ? data[0] : data) as
      | { allowed?: boolean; remaining?: number; retry_after?: number }
      | null;

    if (!row || typeof row.allowed !== 'boolean') {
      throw new Error('unexpected response from consume_rate_limit');
    }

    return {
      ok: row.allowed,
      remaining: typeof row.remaining === 'number' ? row.remaining : 0,
      retryAfterSeconds: Math.max(1, Math.ceil(row.retry_after ?? 1)),
    };
  } catch (error) {
    console.error('[rate-limit] durable limiter unavailable, using local fallback:', error);
    return rateLimit(key, limit, windowMs);
  }
}
