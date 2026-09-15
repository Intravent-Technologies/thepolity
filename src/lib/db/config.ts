import fs from 'fs';
import path from 'path';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const SUPABASE_STORAGE_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET || 'thepolity-media';

const BUILD_ENV = process.env.VERCEL_ENV || process.env.NODE_ENV || 'development';

// Log Supabase availability once per cold start so config problems
// are visible in serverless logs immediately.
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  console.log(`[DB] Supabase configured for ${SUPABASE_URL} (${BUILD_ENV})`);
} else {
  const reasons: string[] = [];
  if (!SUPABASE_URL) reasons.push('SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL is not set');
  if (!SUPABASE_SERVICE_ROLE_KEY) reasons.push('SUPABASE_SERVICE_ROLE_KEY is not set');
  console.warn(
    `[DB] Supabase NOT configured (${BUILD_ENV}). Falling back to local JSON for reads. ${reasons.join('; ')}`
  );
}

export function isSupabaseConfigured(): boolean {
  return !!(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseAdminClient(): SupabaseClient {
  if (!SUPABASE_URL) {
    throw new Error('Supabase URL is not configured');
  }
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
  }

  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return supabaseClient;
}

// --- Local JSON fallback (local dev only; not available on serverless) ---

let DATA_DIR: string;
let UPLOADS_DIR: string;

try {
  DATA_DIR = path.join(process.cwd(), 'public', 'data');
  UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch {
  DATA_DIR = '';
  UPLOADS_DIR = '';
}

export function localJsonFilePath(fileName: string): string {
  return path.join(DATA_DIR, fileName);
}

export function readLocalJson<T>(filePath: string): T[] {
  if (!DATA_DIR || !filePath) {
    throw new Error('Local storage not available in serverless. Use Supabase.');
  }
  if (!fs.existsSync(filePath)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T[];
}

export function writeLocalJson<T>(filePath: string, items: T[]): void {
  if (!DATA_DIR || !filePath) {
    throw new Error('Local storage not available in serverless. Use Supabase.');
  }
  fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
}

export function localUploadsDir(): string {
  return UPLOADS_DIR;
}