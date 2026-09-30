import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_SECURE,
  createAdminSessionToken,
  isAdminAuthConfigured,
  validateAdminPassword,
} from '@/lib/auth';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { isPlainObject } from '@/lib/validate';

const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: NextRequest) {
  if (!isAdminAuthConfigured()) {
    console.error(
      '[auth] Admin login disabled: ADMIN_PASSWORD and ADMIN_SESSION_SECRET (32+ chars) must be set.'
    );
    return NextResponse.json(
      { error: 'Admin login is not configured on this server.' },
      { status: 503 }
    );
  }

  const ip = clientIp(request);
  const limit = rateLimit(`auth:${ip}`, MAX_ATTEMPTS, WINDOW_MS);

  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(limit.retryAfterSeconds) },
      }
    );
  }

  let password: unknown;
  try {
    const body: unknown = await request.json();
    password = isPlainObject(body) ? body.password : undefined;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (!(await validateAdminPassword(password))) {
    console.warn(`[auth] Failed admin login attempt from ${ip}`);
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const token = createAdminSessionToken();
  if (!token) {
    return NextResponse.json(
      { error: 'Admin login is not configured on this server.' },
      { status: 503 }
    );
  }

  const response = NextResponse.json({ success: true, authenticated: true });

  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: ADMIN_COOKIE_SECURE,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  });

  return response;
}
