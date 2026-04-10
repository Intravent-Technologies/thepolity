import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'PolityAdmin123!@#';
const ADMIN_SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || 'the-polity-admin-session-secret';
export const ADMIN_COOKIE_NAME = 'the_polity_admin_session';

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export const ADMIN_PASSWORD_HASH = hashPassword(ADMIN_PASSWORD);

export function validateAdminPassword(password: string): boolean {
  return verifyPassword(password, ADMIN_PASSWORD_HASH);
}

export function createAdminSessionToken(): string {
  return crypto
    .createHmac('sha256', ADMIN_SESSION_SECRET)
    .update(ADMIN_PASSWORD_HASH)
    .digest('hex');
}

export function validateAdminSessionToken(token?: string): boolean {
  if (!token) {
    return false;
  }

  const expected = createAdminSessionToken();
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}
