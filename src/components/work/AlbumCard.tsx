import Link from 'next/link';
import { Images } from 'lucide-react';
import { Badge } from '@/components/ui';
import { ALBUM_COVER_WIDTH, drivePhotoUrl, type WorkAlbum } from '@/lib/work-types';

/**
 * One album, rendered as a case study in the `/work` grid.
 *
 * An album is not a separate kind of page that sits apart from the work. It is
 * the visual record of a project, so it takes the same card shape as a written
 * case study and links to its own page of photographs.
 *
 * A narrow cover width is deliberate: cards sit two-up, so a 1600px image would
 * be wasted bytes.
 */
export default function AlbumCard({ album }: { album: WorkAlbum }) {
  const photos = album.photoCount;
  const videos = album.videoCount;

  return (
    <article>
      <Link href={`/work/${album.slug}`} className="group block">
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
            // Reachable only between adding an album and its first sync.
            <div className="flex size-full items-center justify-center bg-surface-sunken">
              <Images className="size-8 text-ink-subtle" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {album.category ? <Badge>{album.category}</Badge> : null}
          {photos + videos > 0 ? (
            <span className="text-sm text-ink-subtle">
              {photos > 0 ? `${photos} photograph${photos === 1 ? '' : 's'}` : null}
              {photos > 0 && videos > 0 ? ' · ' : null}
              {videos > 0 ? `${videos} video${videos === 1 ? '' : 's'}` : null}
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
}