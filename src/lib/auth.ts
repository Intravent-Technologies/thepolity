import crypto from 'crypto';

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEYLEN = 64;
const SCRYPT_MAXMEM = 64 * 1024 * 1024;
const SCRYPT_PREFIX = 'scrypt';

const TOKEN_VERSION = 'v1';
const MAX_TTL_HOURS = 24;
const DEFAULT_TTL_HOURS = 8;
const MAX_PASSWORD_LENGTH = 1024;

function readEnv(name: string): string {
  return (process.env[name] ?? '').trim();
}

const ADMIN_PASSWORD = readEnv('ADMIN_PASSWORD');
const ADMIN_SESSION_SECRET = readEnv('ADMIN_SESSION_SECRET');

export const ADMIN_COOKIE_SECURE = readEnv('ADMIN_COOKIE_SECURE')
  ? readEnv('ADMIN_COOKIE_SECURE') === 'true'
  : process.env.NODE_ENV === 'production';

// __Host- prefix is only honoured by browsers when the cookie is Secure and
// has no Domain attribute, which means it cannot be set over plain HTTP.
export const ADMIN_COOKIE_NAME = ADMIN_COOKIE_SECURE
  ? '__Host-the_polity_admin_session'
  : 'the_polity_admin_session';

export function isAdminAuthConfigured(): boolean {
  return ADMIN_PASSWORD.length > 0 && ADMIN_SESSION_SECRET.length >= 32;
}

function sessionTtlSeconds(): number {
  const raw = Number(readEnv('ADMIN_SESSION_TTL_HOURS'));
  const hours = Number.isFinite(raw) && raw > 0 ? Math.min(raw, MAX_TTL_HOURS) : DEFAULT_TTL_HOURS;
  return Math.floor(hours * 3600);
}

type ScryptOptions = { N: number; r: number; p: number };

function scryptAsync(password: string, salt: Buffer, options: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(
      password,
      salt,
      SCRYPT_KEYLEN,
      { N: options.N, r: options.r, p: options.p, maxmem: SCRYPT_MAXMEM },
      (error, derivedKey) => (error ? reject(error) : resolve(derivedKey))
    );
  });
}

function normalize(password: string): string {
  return password.normalize('NFKC');
}

async function hashPassword(password: string, salt: Buffer): Promise<string> {
  const derivedKey = await scryptAsync(normalize(password), salt, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  });

  return [
    SCRYPT_PREFIX,
    SCRYPT_N,
    SCRYPT_R,
    SCRYPT_P,
    salt.toString('base64'),
    derivedKey.toString('base64'),
  ].join('$');
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== SCRYPT_PREFIX) {
    return false;
  }

  const N = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  if (!Number.isInteger(N) || !Number.isInteger(r) || !Number.isInteger(p)) {
    return false;
  }

  // Reject absurd parameters so a tampered stored hash cannot be used to
  // turn a login attempt into a memory/CPU exhaustion attack.
  if (N > 1 << 20 || r > 32 || p > 16) {
    return false;
  }

  const salt = Buffer.from(parts[4], 'base64');
  const expected = Buffer.from(parts[5], 'base64');
  if (salt.length === 0 || expected.length !== SCRYPT_KEYLEN) {
    return false;
  }

  const actual = await scryptAsync(normalize(password), salt, { N, r, p });
  return timingSafeEqual(actual, expected);
}

function timingSafeEqual(a: Buffer, b: Buffer): boolean {
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

let cachedPasswordHash: string | null = null;

async function getAdminPasswordHash(): Promise<string | null> {
  if (!isAdminAuthConfigured()) {
    return null;
  }
  if (!cachedPasswordHash) {
    cachedPasswordHash = await hashPassword(ADMIN_PASSWORD, crypto.randomBytes(16));
  }
  return cachedPasswordHash;
}

let cachedPasswordBinding: string | null = null;

function passwordBinding(): string {
  if (!cachedPasswordBinding) {
    cachedPasswordBinding = crypto
      .createHmac('sha256', ADMIN_SESSION_SECRET)
      .update(`pw:${ADMIN_PASSWORD}`)
      .digest('hex');
  }
  return cachedPasswordBinding;
}

export async function validateAdminPassword(password: unknown): Promise<boolean> {
  if (typeof password !== 'string') {
    return false;
  }
  if (password.length === 0 || password.length > MAX_PASSWORD_LENGTH) {
    return false;
  }

  const stored = await getAdminPasswordHash();
  if (!stored) {
    return false;
  }

  return verifyPassword(password, stored);
}

export function createAdminSessionToken(): string | null {
  if (!isAdminAuthConfigured()) {
    return null;
  }

  const expiry = Math.floor(Date.now() / 1000) + sessionTtlSeconds();
  const signature = crypto
    .createHmac('sha256', ADMIN_SESSION_SECRET)
    .update(`${TOKEN_VERSION}:${expiry}:${passwordBinding()}`)
    .digest('hex');

  return `${TOKEN_VERSION}.${expiry}.${signature}`;
}

export function validateAdminSessionToken(token?: string): boolean {
  if (!isAdminAuthConfigured() || !token) {
    return false;
  }

  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== TOKEN_VERSION) {
    return false;
  }

  const expiry = Number(parts[1]);
  if (!Number.isInteger(expiry)) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  if (expiry <= now) {
    return false;
  }
  if (expiry > now + (MAX_TTL_HOURS + 1) * 3600) {
    return false;
  }

  const expected = crypto
    .createHmac('sha256', ADMIN_SESSION_SECRET)
    .update(`${TOKEN_VERSION}:${expiry}:${passwordBinding()}`)
    .digest('hex');

  return timingSafeEqual(Buffer.from(parts[2]), Buffer.from(expected));
}
