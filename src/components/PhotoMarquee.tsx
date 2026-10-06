import Image from 'next/image';
import type { ReactNode } from 'react';

export interface MarqueePhoto {
  src: string;
  alt: string;
  srcSet?: string;
}

/**
 * A full-bleed row of photographs that scrolls continuously.
 *
 * This is the site's signature band: three of these stacked with alternating
 * directions read as a woven collage, where a single row on its own just looks
 * like a carousel. Rows deliberately bleed to the viewport edge while the
 * headings above them stay inside the container, so the media feels larger than
 * the layout around it.
 *
 * Photo width is fixed per breakpoint rather than derived from a count of
 * "slides to show", so a row keeps its composition as the viewport changes and
 * stays legible on a phone.
 *
 * Tiles are cropped to a fixed aspect, so the crop anchor matters: these are
 * portraits of people, and CSS centres an object-cover by default, which slices
 * heads off at the top. Anchoring to the top keeps the face in frame on the
 * narrow, tall tiles a phone gets. Pass imagePositionClassName to override for
 * a row that is mostly architecture or landscape.
 */
export default function PhotoMarquee({
  photos,
  reverse = false,
  durationSeconds = 46,
  tileClassName = 'aspect-[4/5] w-[74vw] max-w-[340px] sm:max-w-[420px]',
  sizes = '(min-width: 640px) 420px, 74vw',
  imagePositionClassName = 'object-top',
  className = '',
  children,
}: {
  photos: MarqueePhoto[];
  reverse?: boolean;
  durationSeconds?: number;
  tileClassName?: string;
  sizes?: string;
  /** CSS object-position utility. Defaults to top so faces survive the crop. */
  imagePositionClassName?: string;
  className?: string;
  /** Rendered once per row, immediately before the track. */
  children?: ReactNode;
}) {
  if (photos.length === 0) return null;

  // One copy is enough to fill a 1440px viewport twice over on a phone, but on a
  // very wide monitor a short row would expose the seam. Repeating until the
  // row comfortably exceeds twice the viewport keeps the loop invisible at any
  // width, and the duplicates are hidden from assistive tech.
  const needed = Math.max(2, Math.ceil(10 / photos.length));
  const row = Array.from({ length: needed }, () => photos).flat();

  return (
    <div className={className}>
      {children}
      <div
        className="group relative overflow-hidden"
        style={{ '--tp-marquee-duration': `${durationSeconds}s` } as React.CSSProperties}
      >
        <div className={`tp-marquee-track${reverse ? ' tp-marquee-track-reverse' : ''}`}>
          {[false, true].map((isDuplicate) => (
            <div
              key={String(isDuplicate)}
              className="flex shrink-0 items-center gap-4 pr-4"
              aria-hidden={isDuplicate || undefined}
            >
              {row.map((photo, i) => (
                <div
                  key={`${isDuplicate ? 'copy' : 'main'}-${i}`}
                  className={`relative shrink-0 overflow-hidden rounded-card bg-navy-700 ${tileClassName}`}
                >
                  <Image
                    src={photo.src}
                    alt={isDuplicate ? '' : photo.alt}
                    fill
                    sizes={sizes}
                    {...(photo.srcSet ? { srcSet: photo.srcSet } : {})}
                    loading={isDuplicate ? 'lazy' : undefined}
                    className={`object-cover ${imagePositionClassName}`}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
