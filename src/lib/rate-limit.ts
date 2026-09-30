import type { NextRequest } from 'next/server';

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
