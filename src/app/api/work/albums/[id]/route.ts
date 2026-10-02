import { NextRequest, NextResponse } from 'next/server';
import {
  getWorkAlbumById,
  getWorkAlbumBySlug,
  getWorkAlbumMedia,
  updateWorkAlbum,
  deleteWorkAlbum,
  getWorkAlbums,
} from '@/lib/storage';
import { parseContentBody, type ContentEntity } from '@/lib/content-schema';
import { parseDriveFolderId } from '@/lib/google-drive';
import {
  readJsonBody,
  readRouteParam,
  requireAdmin,
  toErrorResponse,
} from '@/lib/api-guard';
import { ValidationError } from '@/lib/validate';

const ENTITY: ContentEntity = 'albums';

/**
 * Album detail. Readable by anyone, since the album itself is public content.
 *
 * Next 16 resolves `params` as a Promise, so the context is awaited before the
 * segment is read.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const segment = readRouteParam((await params).id);

    // The same segment may be a uuid (admin tooling) or a slug (public links).
    const album =
      (await getWorkAlbumById(segment)) || (await getWorkAlbumBySlug(segment));
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    const media = await getWorkAlbumMedia(album.id);
    return NextResponse.json({ album, media });
  } catch (error) {
    console.error('[api:albums] GET failed:', error);
    return NextResponse.json({ error: 'Failed to fetch album' }, { status: 500 });
  }
}

/**
 * Edit an album's own metadata: title, slug, description, cover choice, or the
 * Drive folder it points at. Changing the folder does not re-sync on its own;
 * the admin presses Sync afterwards.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(request);
  if (denied) {
    return denied;
  }

  try {
    const id = readRouteParam((await params).id);
    const album = await getWorkAlbumById(id);
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    /*
     * PATCH means partial: an editor form that changes one caption should not
     * have to resend the whole record, and a blank field must not silently
     * wipe a value. The incoming body is merged over the stored album and the
     * merged result is what gets validated, so the schema stays as strict as it
     * is for creation.
     */
    const incoming = await readJsonBody(request);
    const merged = {
      title: 'title' in incoming ? incoming.title : album.title,
      slug: 'slug' in incoming ? incoming.slug : album.slug,
      category: 'category' in incoming ? incoming.category : album.category,
      description:
        'description' in incoming ? incoming.description : album.description,
      coverDriveFileId:
        'coverDriveFileId' in incoming
          ? incoming.coverDriveFileId
          : album.coverDriveFileId,
      driveFolderUrl:
        'driveFolderUrl' in incoming
          ? incoming.driveFolderUrl
          : album.driveFolderUrl,
    };
    const body = parseContentBody(ENTITY, merged);

    const slug = String(body.slug);
    if (slug !== album.slug) {
      const clash = (await getWorkAlbums()).some(
        (other) => other.slug === slug && other.id !== album.id
      );
      if (clash) {
        throw new ValidationError(
          'That slug is already used by another album. Choose a different one.'
        );
      }
    }

    // Re-parse so a folder swap is validated and the id is refreshed from the
    // new URL rather than being trusted as pasted.
    const driveFolderId = parseDriveFolderId(String(body.driveFolderUrl));
    const folderChanged = driveFolderId !== album.driveFolderId;

    const updated = await updateWorkAlbum(album.id, {
      title: String(body.title),
      slug,
      category: String(body.category || ''),
      description: String(body.description || ''),
      coverDriveFileId: String(body.coverDriveFileId || ''),
      driveFolderId,
      driveFolderUrl: String(body.driveFolderUrl).trim(),
      // Pointing at a different folder invalidates the counts and cover that
      // were derived from the old one.
      ...(folderChanged && {
        photoCount: 0,
        videoCount: 0,
        lastSyncedAt: '',
        coverDriveFileId: '',
      }),
    });

    return NextResponse.json(updated);
  } catch (error) {
    return toErrorResponse(error, 'Failed to update album');
  }
}

/** Delete the album, its media rows, and every mirrored video file. */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(request);
  if (denied) {
    return denied;
  }

  try {
    const id = readRouteParam((await params).id);
    if (!(await getWorkAlbumById(id))) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    await deleteWorkAlbum(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return toErrorResponse(error, 'Failed to delete album');
  }
}