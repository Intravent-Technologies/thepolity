import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, validateAdminSessionToken } from '@/lib/auth';
import { uploadMediaFile } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!validateAdminSessionToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'portfolio' or 'gallery'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!['portfolio', 'gallery'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid upload type' },
        { status: 400 }
      );
    }

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const isValidPortfolioFile = type === 'portfolio' && isImage;
    const isValidGalleryFile = type === 'gallery' && (isImage || isVideo);

    if (!isValidPortfolioFile && !isValidGalleryFile) {
      return NextResponse.json(
        { error: 'Unsupported file type for this upload' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploaded = await uploadMediaFile({
      buffer,
      contentType: file.type,
      filename: file.name,
      directory: type as 'portfolio' | 'gallery',
    });

    return NextResponse.json(uploaded, { status: 200 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
