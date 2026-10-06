import { NextRequest, NextResponse } from 'next/server';
import {
  getWorkAlbums,
  getWorkAlbumBySlug,
  addWorkAlbum,
} from '@/lib/storage';
import { parseContentBody, type ContentEntity } from '@/lib/content-schema';
import { parseDriveFolderId } from '@/lib/google-drive';
import {
  readJsonBody,
  requireAdmin,
  toErrorResponse,
} from '@/lib/api-guard';
import { ValidationError } from '@/lib/validate';
import { recordAdminAction } from '@/lib/audit';

const ENTITY: ContentEntity = 'albums';

/**
 * Public album list. Returns albums with their counts so the grid renders
 * without loading media rows.
 *
 * Albums are returned with `coverDriveFileId` rather than a finished image URL;
 * the client derives the URL with `drivePhotoUrl()`. That keeps the invariant
 * that no Google URL is ever persisted.
 */
export async function GET(request: NextRequest) {
  try {
    const slug = new URL(request.url).searchParams.get('slug');
    if (slug) {
      const album = await getWorkAlbumBySlug(slug);
      if (!album) {
        return NextResponse.json({ error: 'Album not found' }, { status: 404 });
      }
      return NextResponse.json(album);
    }

    return NextResponse.json(await getWorkAlbums());
  } catch (error) {
    console.error('[api:albums] GET failed:', error);
    return NextResponse.json({ error: 'Failed to fetch albums' }, { status: 500 });
  }
}

/**
 * Create an album. The Drive link is only parsed and validated here; nothing is
 * fetched from Google until the admin presses Sync, so creating an album costs
 * no Drive quota.
 */
export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) {
    return denied;
  }

  try {
    const body = parseContentBody(ENTITY, await readJsonBody(request));

    const driveFolderUrl = String(body.driveFolderUrl || '').trim();

    /* The Drive link is optional now. When present it is parsed strictly and a
       bad link fails the request with a readable message rather than creating an
       album that can never sync. When absent the album is simply filled by
       uploads from the admin. */
    const driveFolderId = driveFolderUrl ? parseDriveFolderId(driveFolderUrl) : '';

    const slug = String(body.slug);
    const existing = await getWorkAlbums();
    if (existing.some((album) => album.slug === slug)) {
      throw new ValidationError(
        'That slug is already used by another album. Choose a different one.'
      );
    }

    const album = await addWorkAlbum({
      title: String(body.title),
      slug,
      category: String(body.category || ''),
      description: String(body.description || ''),
      coverDriveFileId: String(body.coverDriveFileId || ''),
      driveFolderId,
      driveFolderUrl,
    });

    recordAdminAction(request, 'album.create', 'album', album.id, { title: album.title });
    return NextResponse.json(album, { status: 201 });
  } catch (error) {
    return toErrorResponse(error, 'Failed to create album');
  }
}