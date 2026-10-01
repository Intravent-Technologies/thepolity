import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, validateAdminSessionToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

  return NextResponse.json({
    authenticated: validateAdminSessionToken(token),
  });
}
