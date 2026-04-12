import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, validateAdminSessionToken } from '@/lib/auth';
import { uploadMediaFile, saveHomepageImage } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!validateAdminSessionToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'portfolio', 'gallery', or 'homepage'
    const section = formData.get('section') as string; // For homepage images

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!['portfolio', 'gallery', 'homepage'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid upload type' },
        { status: 400 }
      );
    }

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const isValidPortfolioFile = type === 'portfolio' && isImage;
    const isValidGalleryFile = type === 'gallery' && (isImage || isVideo);
    const isValidHomepageFile = type === 'homepage' && isImage;

    if (!isValidPortfolioFile && !isValidGalleryFile && !isValidHomepageFile) {
      return NextResponse.json(
        { error: 'Unsupported file type for this upload' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let directory: 'portfolio' | 'gallery' = type === 'homepage' ? 'gallery' : (type as 'portfolio' | 'gallery');
    
    const uploaded = await uploadMediaFile({
      buffer,
      contentType: file.type,
      filename: file.name,
      directory,
    });

    // If homepage type, save the mapping
    if (type === 'homepage' && section) {
      try {
        console.log('[Upload] Saving homepage image:', section, uploaded.url);
        await saveHomepageImage(section, uploaded.url);
        console.log('[Upload] Homepage image saved successfully');
      } catch (e) {
        console.error('[Upload] Failed to save homepage image mapping:', e);
      }
    }

    return NextResponse.json(uploaded, { status: 200 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details:error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
