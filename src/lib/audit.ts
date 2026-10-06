import type { NextRequest } from 'next/server';
import { isSupabaseConfigured, getSupabaseAdminClient } from '@/lib/storage';
import { clientIp } from '@/lib/rate-limit';

export type AdminAction =
  | 'auth.login_failed'
  | 'auth.login_succeeded'
  | 'auth.logout'
  | 'album.create'
  | 'album.update'
  | 'album.delete'
  | 'media.upload'
  | 'media.delete'
  | 'media.reorder'
  | 'media.drive_sync'
  | 'content.update';

const MAX_DETAIL_LENGTH = 1000;
const MAX_AGENT_LENGTH = 300;

/**
 * Record an administrative action.
 *
 * Every failure mode is swallowed on purpose. An audit trail that can take the
 * admin dashboard offline is worse than no trail, so a broken or missing table
 * costs visibility and nothing else — the log records that it could not record.
 *
 * Not awaited by callers on purpose: the response should not be held open for
 * bookkeeping.
 */
export function recordAdminAction(
  request: NextRequest,
  action: AdminAction,
  targetType: string,
  targetId?: string | null,
  detail?: unknown
): void {
  void writeRow(request, action, targetType, targetId, detail);
}

async function writeRow(
  request: NextRequest,
  action: AdminAction,
  targetType: string,
  targetId?: string | null,
  detail?: unknown
): Promise<void> {
  if (!isSupabaseConfigured()) {
    return;
  }

  try {
    const serialized = detail === undefined ? null : truncate(safeStringify(detail), MAX_DETAIL_LENGTH);

    const { error } = await getSupabaseAdminClient()
      .from('admin_audit_log')
      .insert({
        action,
        target_type: targetType.slice(0, 60),
        target_id: targetId ? String(targetId).slice(0, 200) : null,
        detail: serialized,
        ip: clientIp(request),
        user_agent: truncate(request.headers.get('user-agent') ?? '', MAX_AGENT_LENGTH),
      });

    if (error) {
      console.error(`[audit] could not record ${action}:`, error.message);
    }
  } catch (error) {
    console.error(`[audit] could not record ${action}:`, error);
  }
}

/**
 * Serialize without ever throwing. A BigInt or a circular structure in a payload
 * must not take down the action being audited.
 */
function safeStringify(value: unknown): string {
  try {
    const seen = new WeakSet<object>();
    return (
      JSON.stringify(value, (_key, val) => {
        if (typeof val === 'bigint') return val.toString();
        if (typeof val === 'object' && val !== null) {
          if (seen.has(val)) return '[circular]';
          seen.add(val);
        }
        return val;
      }) ?? ''
    );
  } catch {
    return String(value);
  }
}

function truncate(value: string, max: number): string {
  return value.length <= max ? value : `${value.slice(0, max)}...`;
}

/** Read the most recent entries. Operator use only; never called from a route. */
export async function recentAdminActions(limit = 100) {
  const { data, error } = await getSupabaseAdminClient()
    .from('admin_audit_log')
    .select('*')
    .order('occurred_at', { ascending: false })
    .limit(Math.min(limit, 500));

  if (error) throw new Error(error.message);
  return data ?? [];
}
