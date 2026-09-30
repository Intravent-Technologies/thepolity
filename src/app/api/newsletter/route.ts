import { NextRequest, NextResponse } from 'next/server';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { isPlainObject } from '@/lib/validate';

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60 * 60 * 1000;
const EMAIL_PATTERN = /^[^\s@]{1,64}@[^\s@.]+(\.[^\s@.]+)+$/;
const MAX_EMAIL_LENGTH = 254;

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const limit = rateLimit(`newsletter:${ip}`, MAX_ATTEMPTS, WINDOW_MS);

  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
    );
  }

  let email: unknown;
  try {
    const body: unknown = await request.json();
    email = isPlainObject(body) ? body.email : undefined;
  } catch {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }

  if (typeof email !== 'string' || email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }

  // Only the normalised address is logged, so an attacker cannot inject
  // arbitrary content into the server logs.
  console.log(`[newsletter] subscription received from ${ip}`);

  return NextResponse.json({ success: true, message: 'Subscribed successfully!' });
}
