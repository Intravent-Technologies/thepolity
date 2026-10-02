import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, validateAdminSessionToken } from '@/lib/auth';
import { isPlainObject, ValidationError } from '@/lib/validate';

export function unauthorized(): NextResponse {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

/** Returns a 401 response when the caller has no valid admin session. */
export function requireAdmin(request: NextRequest): NextResponse | null {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return validateAdminSessionToken(token) ? null : unauthorized();
}

export async function readJsonBody(request: NextRequest): Promise<Record<string, unknown>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new ValidationError('Request body must be valid JSON');
  }

  if (!isPlainObject(body)) {
    throw new ValidationError('Request body must be a JSON object');
  }

  return body;
}

export function readIdParam(request: NextRequest): string {
  const id = new URL(request.url).searchParams.get('id');

  if (!id) {
    throw new ValidationError('Missing id parameter');
  }
  if (id.length > 200) {
    throw new ValidationError('Invalid id parameter');
  }

  return id;
}

/**
 * Read a dynamic route segment, such as the `[id]` in
 * `app/api/work/albums/[id]/route.ts`.
 *
 * Next 16 resolves route params as a Promise, so callers must await the route
 * context before passing the value in. Kept separate from `readIdParam` because
 * that one reads a query string and is not tied to the dynamic-segment shape.
 */
export function readRouteParam(value: unknown, field = 'id'): string {
  if (typeof value !== 'string' || !value) {
    throw new ValidationError(`Missing ${field}`);
  }
  if (value.length > 200) {
    throw new ValidationError(`Invalid ${field}`);
  }

  return value;
}

/** Map validation problems to 400 and anything unexpected to a generic 500. */
export function toErrorResponse(error: unknown, fallback: string): NextResponse {
  if (error instanceof ValidationError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  console.error(`[api] ${fallback}:`, error);
  return NextResponse.json({ error: fallback }, { status: 500 });
}
