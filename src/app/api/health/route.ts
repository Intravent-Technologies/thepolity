import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  validateAdminSessionToken,
} from '@/lib/auth';
import {
  isSupabaseConfigured,
  SUPABASE_STORAGE_BUCKET,
  getSupabaseAdminClient,
  SUPABASE_URL,
} from '@/lib/db';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!validateAdminSessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  interface StorageReport {
    supabaseUrlSet: boolean;
    configured: boolean;
    bucket: string;
    reason?: string;
    recommendation?: string;
    bucketListError?: string | null;
    buckets?: string[];
    bucketExists?: boolean;
    reviewsTable?: { error: string | null; exists: boolean };
    exception?: string;
  }

  interface HealthReport {
    auth: { adminPasswordSet: boolean; adminSessionSecretSet: boolean };
    storage: StorageReport;
  }

  const report: HealthReport = {
    auth: {
      adminPasswordSet: !!process.env.ADMIN_PASSWORD,
      adminSessionSecretSet: !!process.env.ADMIN_SESSION_SECRET,
    },
    storage: {
      supabaseUrlSet: !!SUPABASE_URL,
      configured: isSupabaseConfigured(),
      bucket: SUPABASE_STORAGE_BUCKET,
    },
  };

  if (!isSupabaseConfigured()) {
    report.storage.reason =
      'SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set. Uploads and writes will fail without them.';
    report.storage.recommendation =
      'Set these env vars in Vercel (Production, Preview, Development), then run supabase/schema.sql on the project.';
    return NextResponse.json(report);
  }

  try {
    const supabase = getSupabaseAdminClient();

    // 1) Can we authenticate and reach the project? List storage buckets.
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    report.storage.bucketListError = bucketError?.message ?? null;
    report.storage.buckets = (buckets || []).map((b) => b.name);
    report.storage.bucketExists = (buckets || []).some(
      (b) => b.name === SUPABASE_STORAGE_BUCKET
    );

    // 2) Do the tables exist? Probe the reviews table (smallest).
    const { data: reviewsProbe, error: tableError } = await supabase
      .from('reviews')
      .select('id', { count: 'exact', head: true });
    report.storage.reviewsTable = {
      error: tableError?.message ?? null,
      exists: !tableError && Array.isArray(reviewsProbe),
    };
  } catch (error) {
    report.storage.exception =
      error instanceof Error ? error.message : String(error);
  }

  report.storage.recommendation =
    'If bucketExists is false, run supabase/schema.sql (creates the thepolity-media bucket + tables). If the project URL is dead (NXDOMAIN), create a new Supabase project and update the env vars.';

  return NextResponse.json(report);
}