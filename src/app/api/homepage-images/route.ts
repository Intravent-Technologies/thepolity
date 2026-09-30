import { NextRequest, NextResponse } from 'next/server';
import {
  getHomepageImages,
  saveHomepageImage,
  deleteHomepageImage,
} from '@/lib/storage';
import { parseContentBody } from '@/lib/content-schema';
import {
  readIdParam,
  readJsonBody,
  requireAdmin,
  toErrorResponse,
} from '@/lib/api-guard';

export async function GET() {
  try {
    const images = await getHomepageImages();
    return NextResponse.json(images);
  } catch (error) {
    console.error('[api:homepage-images] GET failed:', error);
    // Return empty array so a storage outage cannot take the homepage down.
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) {
    return denied;
  }

  try {
    const { section, imageUrl } = parseContentBody(
      'homepage-images',
      await readJsonBody(request)
    ) as { section: string; imageUrl: string };

    await saveHomepageImage(section, imageUrl);
    return NextResponse.json({ success: true });
  } catch (error) {
    return toErrorResponse(error, 'Failed to save homepage image');
  }
}

export async function DELETE(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) {
    return denied;
  }

  try {
    await deleteHomepageImage(readIdParam(request));
    return NextResponse.json({ success: true });
  } catch (error) {
    return toErrorResponse(error, 'Failed to delete homepage image');
  }
}
