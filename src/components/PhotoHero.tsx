import Image from 'next/image';
import { Container } from './ui';

/**
 * Full-viewport opening section with a photograph behind it.
 *
 * The photograph drifts slowly rather than sitting still. This is not decoration:
 * a still full-bleed image reads as a flat colour block on a phone, and the
 * drift gives the impression of video, which is what a photography business
 * wants to say. A 50% black scrim carries the contrast for the copy, and the
 * content sits at the bottom rather than centred so the photograph stays
 * unobstructed.
 *
 * `imageSrc` is a plain string rather than next/image's static import because
 * the source is usually a Drive-hosted album cover, which is not known at build
 * time. Remote hosts must be allow-listed in next.config for this to render at
 * all, so a missing entry shows the fallback silently rather than throwing.
 */
export default function PhotoHero({
  imageSrc,
  imageSrcSet,
  imageAlt = '',
  priority = false,
  eyebrow,
  title,
  lede,
  actions,
  detail,
  children,
}: {
  imageSrc: string;
  imageSrcSet?: string;
  imageAlt?: string;
  priority?: boolean;
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  actions?: React.ReactNode;
  /** Rendered under the actions, e.g. the reassurance checklist. */
  detail?: React.ReactNode;
  /** Rendered between the lede and the actions. */
  children?: React.ReactNode;
}) {
  return (
    <section       className="relative isolate flex min-h-[92svh] flex-col justify-end overflow-hidden bg-navy-800">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority={priority}
          sizes="100vw"
          {...(imageSrcSet ? { srcSet: imageSrcSet } : {})}
          className="tp-kenburns object-cover"
        />
      </div>

      {/* Scrim. Two stops rather than one flat wash so the top of the frame,
          where the transparent header sits, stays darker than the copy area. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-navy-800 via-navy-800/75 to-navy-800/55"
      />
      {/* Closes the hero with the brand accent, the way the reference brackets
          its dark run with two accent rules. */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-brand-500" />

      <div className="relative pb-16 pt-28 sm:pb-20 sm:pt-36">
        <Container>
          {eyebrow && (
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-brand-400">
              {eyebrow}
            </p>
          )}

          <h1 className="mt-6 max-w-[16ch] text-hero font-medium text-ink-inverse">
            {title}
          </h1>

          {lede && (
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-inverse/75 sm:text-xl">
              {lede}
            </p>
          )}

          {children}

          {actions && <div className="mt-10 flex flex-wrap items-center gap-3">{actions}</div>}

          {detail && <div className="mt-12">{detail}</div>}
        </Container>
      </div>
    </section>
  );
}
