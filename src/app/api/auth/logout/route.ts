import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_SECURE } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    secure: ADMIN_COOKIE_SECURE,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
