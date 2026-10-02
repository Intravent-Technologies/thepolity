'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import {
  ALBUM_GRID_WIDTHS,
  ALBUM_LIGHTBOX_WIDTH,
  drivePhotoSrcSet,
  drivePhotoUrl,
  type WorkAlbumMedia,
} from '@/lib/work-types';

/**
 * Fallback host for a Drive-hosted photo.
 *
 * `lh3.googleusercontent.com` is Google's image CDN but it is undocumented,
 * so every photo needs a way out that costs us nothing. The `thumbnailLink`
 * from the Drive API is not an option because it is short-lived and
 * CORS-restricted, but `drive.google.com/thumbnail` is a plain image request
 * and still works.
 */
function thumbnailFallbackUrl(driveFileId: string, width: number): string {
  return `https://drive.google.com/thumbnail?id=${driveFileId}&sz=w${width}`;
}

/**
 * Load stages, in order. One `onError` steps to the next, and the last stage
 * gives up and renders a placeholder instead of a broken-image icon.
 */
const STAGE_PRIMARY = 0;
const STAGE_FALLBACK = 1;
const STAGE_GONE = 2;

/**
 * A photo that stays in Google Drive.
 *
 * Renders a plain `<img>` rather than `next/image`. `next/image` would have to
 * be pointed at an undocumented host, and its optimizer proxies every byte
 * through this app — exactly the cost this feature exists to avoid. Google's
 * CDN already resizes, so `srcSet` lets each visitor fetch one right-sized file
 * instead of a ~3 MB original.
 */
function DrivePhoto({
  media,
  width,
  sizes,
  className,
  stage,
  setStage,
}: {
  media: WorkAlbumMedia;
  width: number;
  sizes: string;
  className?: string;
  stage: number;
  setStage: (stage: number) => void;
}) {
  if (stage >= STAGE_GONE) {
    return (
      <div
        className={`flex aspect-4/3 items-center justify-center bg-surface-sunken text-sm text-ink-subtle ${className ?? ''}`}
      >
        Image unavailable
      </div>
    );
  }

  const failed = stage === STAGE_FALLBACK;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={
        failed
          ? thumbnailFallbackUrl(media.driveFileId, width)
          : drivePhotoUrl(media.driveFileId, width)
      }
      {...(failed
        ? {}
        : { srcSet: drivePhotoSrcSet(media.driveFileId, ALBUM_GRID_WIDTHS) })}
      sizes={sizes}
      alt={media.filename}
      loading="lazy"
      decoding="async"
      onError={() => setStage(STAGE_FALLBACK)}
      className={className}
    />
  );
}

/** Grid variant with its own failure state, so a bad photo never leaks out. */
function GridPhoto({ media }: { media: WorkAlbumMedia }) {
  const [stage, setStage] = useState(STAGE_PRIMARY);

  return (
    <DrivePhoto
      media={media}
      width={1200}
      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      stage={stage}
      setStage={setStage}
      className="w-full"
    />
  );
}

/**
 * A mirrored video, played in place.
 *
 * The file is in our own Supabase bucket, so the browser streams it with range
 * requests and can seek without downloading the whole thing. `preload="metadata"`
 * pulls just enough for a poster frame and duration.
 */
function VideoPlayer({ media }: { media: WorkAlbumMedia }) {
  // A video row only exists once sync has mirrored it, so `publicUrl` is set.
  // The guard covers a sync interrupted between rows.
  if (!media.publicUrl) {
    return (
      <p className="rounded-card border border-line bg-surface px-6 py-10 text-center text-sm text-ink-muted">
        {media.filename} has not been mirrored yet. Run a sync.
      </p>
    );
  }

  return (
    <figure>
      <video
        src={media.publicUrl}
        controls
        preload="metadata"
        playsInline
        className="w-full rounded-card border border-line bg-ink"
      >
        Your browser cannot play this video.
      </video>
      <figcaption className="mt-3 text-sm text-ink-subtle">{media.filename}</figcaption>
    </figure>
  );
}

/**
 * The album gallery: a masonry grid of Drive-hosted photos, mirrored videos
 * beneath it, and a lightbox for full-size viewing.
 *
 * Videos sit inline rather than in the lightbox. A video a visitor chose to play
 * should not be a modal they have to dismiss.
 */
export default function AlbumGallery({ media }: { media: WorkAlbumMedia[] }) {
  const photos = media.filter((item) => item.kind === 'image');
  const videos = media.filter((item) => item.kind === 'video');

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [lightboxStage, setLightboxStage] = useState(STAGE_PRIMARY);

const total = photos.length;

  /*
   * Stepping is a pure function of the current index and the photo count, so it
   * is derived rather than stored: there is no second source of truth to drift.
   * `stage` resets alongside the index, so a photo that fell back to the
   * thumbnail host gets a clean attempt if the visitor returns to it after
   * Google recovers.
   */
  const stepTo = (delta: number) => {
    setLightboxStage(STAGE_PRIMARY);
    setOpenIndex((current) =>
      current === null || total === 0
        ? null
        : (current + delta + total) % total
    );
  };

  const openPhoto = (index: number) => {
    setLightboxStage(STAGE_PRIMARY);
    setOpenIndex(index);
  };

  useEffect(() => {
    if (openIndex === null) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenIndex(null);
      } else if (event.key === 'ArrowRight') {
        setLightboxStage(STAGE_PRIMARY);
        setOpenIndex((current) =>
          current === null || total === 0 ? null : (current + 1) % total
        );
      } else if (event.key === 'ArrowLeft') {
        setLightboxStage(STAGE_PRIMARY);
        setOpenIndex((current) =>
          current === null || total === 0 ? null : (current - 1 + total) % total
        );
      }
    };

    window.addEventListener('keydown', onKeyDown);

    // Stop the page behind the overlay from scrolling with the arrow keys.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [openIndex, total]);

  if (media.length === 0) {
    return <p className="py-16 text-center text-ink-muted">This album has no media yet.</p>;
  }

  const active =
    openIndex === null ? null : photos[openIndex] ?? null;
  const activeNumber = active && openIndex !== null ? openIndex + 1 : 1;

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => openPhoto(index)}
            className="block w-full cursor-zoom-in overflow-hidden rounded-card border border-line bg-surface transition-colors duration-200 hover:border-line-strong"
            aria-label={`View ${photo.filename}, photo ${index + 1} of ${total}`}
          >
            <GridPhoto media={photo} />
          </button>
        ))}
      </div>

      {videos.length > 0 ? (
        <div className="mt-16">
          <h2 className="text-headline text-ink">
            {videos.length === 1 ? 'Video' : `Videos (${videos.length})`}
          </h2>
          <div className="mt-8 space-y-10">
            {videos.map((video) => (
              <VideoPlayer key={video.id} media={video} />
            ))}
          </div>
        </div>
      ) : null}

      {active ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4 sm:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={active.filename}
          onClick={() => setOpenIndex(null)}
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            className="absolute right-4 top-4 z-10 rounded-full bg-cream/10 p-2 text-cream transition-colors hover:bg-cream/20"
            aria-label="Close"
          >
            <X className="size-6" aria-hidden="true" />
          </button>

          {total > 1 ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  stepTo(-1);
                }}
                className="absolute left-2 z-10 rounded-full bg-cream/10 p-2 text-cream transition-colors hover:bg-cream/20 sm:left-6"
                aria-label="Previous photo"
              >
                <ChevronLeft className="size-7" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  stepTo(1);
                }}
                className="absolute right-2 z-10 rounded-full bg-cream/10 p-2 text-cream transition-colors hover:bg-cream/20 sm:right-6"
                aria-label="Next photo"
              >
                <ChevronRight className="size-7" aria-hidden="true" />
              </button>
            </>
          ) : null}

          <div className="flex h-full w-full flex-col items-center justify-center gap-4">
            <div
              className="flex min-h-0 w-full flex-1 items-center justify-center"
              onClick={(event) => event.stopPropagation()}
            >
              <DrivePhoto
                media={active}
                width={ALBUM_LIGHTBOX_WIDTH}
                sizes="100vw"
                stage={lightboxStage}
                setStage={setLightboxStage}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="flex items-center gap-4 text-sm text-cream/80">
              <span>
                {activeNumber} / {total}
              </span>
              <span className="hidden sm:inline">{active.filename}</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}