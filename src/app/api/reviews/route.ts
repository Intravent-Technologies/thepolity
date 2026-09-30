import { NextRequest, NextResponse } from 'next/server';
import {
  getReviews,
  addReview,
  deleteReview,
} from '@/lib/storage';
import { parseContentBody, type ContentEntity } from '@/lib/content-schema';
import { readIdParam, readJsonBody, requireAdmin, toErrorResponse } from '@/lib/api-guard';

const ENTITY: ContentEntity = 'reviews';

export async function GET() {
  try {
    const items = await getReviews();
    return NextResponse.json(items);
  } catch (error) {
    console.error('[api:reviews] GET failed:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) {
    return denied;
  }

  try {
    const body = parseContentBody(ENTITY, await readJsonBody(request));
    const item = await addReview(body as Parameters<typeof addReview>[0]);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return toErrorResponse(error, 'Failed to create reviews');
  }
}

export async function DELETE(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) {
    return denied;
  }

  try {
    await deleteReview(readIdParam(request));
    return NextResponse.json({ success: true });
  } catch (error) {
    return toErrorResponse(error, 'Failed to delete reviews');
  }
}
