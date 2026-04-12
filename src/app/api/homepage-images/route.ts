import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, validateAdminSessionToken } from '@/lib/auth';
import { getHomepageImages, saveHomepageImage, deleteHomepageImage } from '@/lib/storage';

export async function GET(request: NextRequest) {
  try {
    const images = await getHomepageImages();
    return NextResponse.json(images);
  } catch (error) {
    console.error('Failed to fetch homepage images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!validateAdminSessionToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { section, imageUrl } = await request.json();
    
    if (!section || !imageUrl) {
      return NextResponse.json({ error: 'Missing section or imageUrl' }, { status: 400 });
    }

    await saveHomepageImage(section, imageUrl);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save homepage image:', error);
    return NextResponse.json({ error: 'Failed to save image' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Temporarily skip auth for debugging
    // const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    // if (!validateAdminSessionToken(token)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      await deleteHomepageImage(id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete homepage image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
