import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Container, Eyebrow, Section } from '@/components/ui';
import AlbumGallery from '@/components/work/AlbumGallery';
import {
  getWorkAlbumBySlug,
  getWorkAlbumMedia,
  getWorkAlbums,
} from '@/lib/storage';
import { ALBUM_COVER_WIDTH, drivePhotoUrl } from '@/lib/work-types';

export const dynamic = 'force-dynamic';

/**
 * Album detail: the full set of photos and mirrored videos for one project.
 *
 * Rendered on the server so the album heading and the first photos are in the
 * initial HTML. Only the lightbox and keyboard navigation need the client, so
 * `AlbumGallery` is the only client component here.
 */
export default async function AlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const album = await getWorkAlbumBySlug(slug);

  if (!album) {
    notFound();
  }

  const [media, albums] = await Promise.all([
    getWorkAlbumMedia(album.id),
    getWorkAlbums(),
  ]);

  // Previous/next across published albums, ordered by title so the sequence is
  // stable and predictable rather than dependent on sync timing. Albums with no
  // media are excluded here for the same reason the /work grid excludes them:
  // a draft reads as a dead end to a visitor. The admin preview link still
  // reaches the empty page directly.
  const ordered = albums
    .filter((item) => item.photoCount + item.videoCount > 0)
    .sort((a, b) => a.title.localeCompare(b.title));
  const index = ordered.findIndex((item) => item.id === album.id);
  const previous = index > 0 ? ordered[index - 1] : null;
  const next = index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : null;

  return (
    <>
      <Section tone="sunken" className="border-b border-line py-20 sm:py-28">
        <Container>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All work
          </Link>

          {album.category ? (
            <p className="mt-8 text-sm font-medium uppercase tracking-widest text-ink-subtle">
              {album.category}
            </p>
          ) : null}

          <h1 className="mt-4 max-w-4xl text-display text-ink">{album.title}</h1>

          {album.description ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
              {album.description}
            </p>
          ) : null}

          <p className="mt-8 text-sm text-ink-subtle">
            {album.photoCount > 0 ? `${album.photoCount} photographs` : null}
            {album.photoCount > 0 && album.videoCount > 0 ? ' · ' : null}
            {album.videoCount > 0
              ? `${album.videoCount} ${album.videoCount === 1 ? 'video' : 'videos'}`
              : null}
          </p>
        </Container>
      </Section>

      <Section tone="surface" className="py-16 sm:py-20">
        <Container>
          <AlbumGallery media={media} />
        </Container>
      </Section>

      {previous || next ? (
        <Section tone="sunken" className="border-t border-line py-16">
          <Container>
            <Eyebrow>More albums</Eyebrow>
            <nav className="mt-8 grid gap-6 sm:grid-cols-2">
              {previous ? (
                <Link
                  href={`/work/${previous.slug}`}
                  className="group flex items-center gap-4 rounded-card border border-line bg-surface p-5 transition-colors hover:border-line-strong"
                >
                  <ArrowLeft
                    className="size-5 shrink-0 text-ink-subtle transition-colors group-hover:text-ink"
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="block text-xs uppercase tracking-widest text-ink-subtle">
                      Previous
                    </span>
                    <span className="mt-1 block truncate text-title text-ink">
                      {previous.title}
                    </span>
                  </span>
                </Link>
              ) : (
                <span />
              )}

              {next ? (
                <Link
                  href={`/work/${next.slug}`}
                  className="group flex items-center justify-end gap-4 rounded-card border border-line bg-surface p-5 text-right transition-colors hover:border-line-strong"
                >
                  <span className="min-w-0">
                    <span className="block text-xs uppercase tracking-widest text-ink-subtle">
                      Next
                    </span>
                    <span className="mt-1 block truncate text-title text-ink">
                      {next.title}
                    </span>
                  </span>
                  <ArrowRight
                    className="size-5 shrink-0 text-ink-subtle transition-colors group-hover:text-ink"
                    aria-hidden="true"
                  />
                </Link>
              ) : null}
            </nav>
          </Container>
        </Section>
      ) : null}
    </>
  );
}

/**
 * Album pages need a live title in the browser tab and share cards. Covers come
 * from Google's CDN so a shared link still shows the album rather than a blank
 * rectangle; when an album has no cover we fall back to the site defaults.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const album = await getWorkAlbumBySlug(slug);

  if (!album) {
    return { title: 'Album not found' };
  }

  /* Only a Drive-hosted cover is advertised to social scrapers. An upload is
     served from our own bucket, which crawlers do not fetch. */
  const images = album.coverDriveFileId
    ? [drivePhotoUrl(album.coverDriveFileId, ALBUM_COVER_WIDTH)]
    : undefined;

  const description =
    album.description || `Photographs from ${album.title}.`;

  return {
    title: album.title,
    description,
    openGraph: {
      title: album.title,
      description,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: images ? 'summary_large_image' : 'summary',
      title: album.title,
      description,
      ...(images ? { images } : {}),
    },
  };
}