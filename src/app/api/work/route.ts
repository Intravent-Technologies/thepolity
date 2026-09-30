import { NextRequest, NextResponse } from 'next/server';
import {
  getWorkProjects,
  addWorkProject,
  deleteWorkProject,
} from '@/lib/storage';
import { parseContentBody, type ContentEntity } from '@/lib/content-schema';
import { readIdParam, readJsonBody, requireAdmin, toErrorResponse } from '@/lib/api-guard';

const ENTITY: ContentEntity = 'work';

export async function GET() {
  try {
    const items = await getWorkProjects();
    return NextResponse.json(items);
  } catch (error) {
    console.error('[api:work] GET failed:', error);
    return NextResponse.json({ error: 'Failed to fetch work' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) {
    return denied;
  }

  try {
    const body = parseContentBody(ENTITY, await readJsonBody(request));
    const item = await addWorkProject(body as Parameters<typeof addWorkProject>[0]);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return toErrorResponse(error, 'Failed to create work');
  }
}

export async function DELETE(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) {
    return denied;
  }

  try {
    await deleteWorkProject(readIdParam(request));
    return NextResponse.json({ success: true });
  } catch (error) {
    return toErrorResponse(error, 'Failed to delete work');
  }
}
