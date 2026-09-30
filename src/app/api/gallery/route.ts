import { NextRequest, NextResponse } from 'next/server';
import {
  getGalleryItems,
  addGalleryItem,
  deleteGalleryItem,
} from '@/lib/storage';
import { parseContentBody, type ContentEntity } from '@/lib/content-schema';
import { readIdParam, readJsonBody, requireAdmin, toErrorResponse } from '@/lib/api-guard';

const ENTITY: ContentEntity = 'gallery';

export async function GET() {
  try {
    const items = await getGalleryItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error('[api:gallery] GET failed:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) {
    return denied;
  }

  try {
    const body = parseContentBody(ENTITY, await readJsonBody(request));
    const item = await addGalleryItem(body as Parameters<typeof addGalleryItem>[0]);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return toErrorResponse(error, 'Failed to create gallery');
  }
}

export async function DELETE(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) {
    return denied;
  }

  try {
    await deleteGalleryItem(readIdParam(request));
    return NextResponse.json({ success: true });
  } catch (error) {
    return toErrorResponse(error, 'Failed to delete gallery');
  }
}
