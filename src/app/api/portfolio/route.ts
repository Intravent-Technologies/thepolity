import { NextRequest, NextResponse } from 'next/server';
import {
  getPortfolioItems,
  addPortfolioItem,
  deletePortfolioItem,
} from '@/lib/storage';
import { parseContentBody, type ContentEntity } from '@/lib/content-schema';
import { readIdParam, readJsonBody, requireAdmin, toErrorResponse } from '@/lib/api-guard';

const ENTITY: ContentEntity = 'portfolio';

export async function GET() {
  try {
    const items = await getPortfolioItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error('[api:portfolio] GET failed:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) {
    return denied;
  }

  try {
    const body = parseContentBody(ENTITY, await readJsonBody(request));
    const item = await addPortfolioItem(body as Parameters<typeof addPortfolioItem>[0]);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return toErrorResponse(error, 'Failed to create portfolio');
  }
}

export async function DELETE(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) {
    return denied;
  }

  try {
    await deletePortfolioItem(readIdParam(request));
    return NextResponse.json({ success: true });
  } catch (error) {
    return toErrorResponse(error, 'Failed to delete portfolio');
  }
}
