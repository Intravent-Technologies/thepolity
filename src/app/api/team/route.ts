import { NextRequest, NextResponse } from 'next/server';
import {
  getTeamMembers,
  addTeamMember,
  deleteTeamMember,
} from '@/lib/storage';
import { parseContentBody, type ContentEntity } from '@/lib/content-schema';
import { readIdParam, readJsonBody, requireAdmin, toErrorResponse } from '@/lib/api-guard';

const ENTITY: ContentEntity = 'team';

export async function GET() {
  try {
    const items = await getTeamMembers();
    return NextResponse.json(items);
  } catch (error) {
    console.error('[api:team] GET failed:', error);
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) {
    return denied;
  }

  try {
    const body = parseContentBody(ENTITY, await readJsonBody(request));
    const item = await addTeamMember(body as Parameters<typeof addTeamMember>[0]);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return toErrorResponse(error, 'Failed to create team');
  }
}

export async function DELETE(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) {
    return denied;
  }

  try {
    await deleteTeamMember(readIdParam(request));
    return NextResponse.json({ success: true });
  } catch (error) {
    return toErrorResponse(error, 'Failed to delete team');
  }
}
