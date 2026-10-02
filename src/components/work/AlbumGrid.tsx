import Link from 'next/link';
import { Images } from 'lucide-react';
import { Badge } from '@/components/ui';
import { ALBUM_COVER_WIDTH, drivePhotoUrl, type WorkAlbum } from '@/lib/work-types';

/**
 * Album cards on `/work`.
 *
 * A card shows the admin-chosen cover at a small width, because album covers
 * render in a two-column grid and a 1600px image there would be wasted bytes.
 * An album with no cover yet gets a neutral tile rather than a broken image,
 * which is the common state right after an admin adds a folder but before
 * their first sync.
 */
export default function AlbumGrid({ albums }: { albums: WorkAlbum[] }) {
  if (albums.length === 0) {
    return null;
  }

  return (
    <>
      {albums.map((album) => {
        const count = album.photoCount + album.videoCount;

        return (
          <article key={album.id}>
            <Link
              href={`/work/${album.slug}`}
              className="group block"
              aria-label={`View ${album.title}`}
            >
              <div className="relative aspect-16/10 overflow-hidden rounded-card border border-line bg-surface transition-colors duration-200 group-hover:border-line-strong">
                {album.coverDriveFileId ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={drivePhotoUrl(album.coverDriveFileId, ALBUM_COVER_WIDTH)}
                    alt={album.title}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-surface-sunken">
                    <Images className="size-8 text-ink-subtle" aria-hidden="true" />
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {album.category ? <Badge>{album.category}</Badge> : null}
                {count > 0 ? (
                  <span className="text-sm text-ink-subtle">
                    {album.photoCount > 0 ? `${album.photoCount} photographs` : null}
                    {album.photoCount > 0 && album.videoCount > 0 ? ' · ' : null}
                    {album.videoCount > 0
                      ? `${album.videoCount} ${album.videoCount === 1 ? 'video' : 'videos'}`
                      : null}
                  </span>
                ) : null}
              </div>

              <h2 className="mt-3 text-title text-ink">{album.title}</h2>
              {album.description ? (
                <p className="mt-3 max-w-prose text-[0.95rem] leading-relaxed text-ink-muted">
                  {album.description}
                </p>
              ) : null}
            </Link>
          </article>
        );
      })}
    </>
  );
}