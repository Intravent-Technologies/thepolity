'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface HomepageImage {
  id: string;
  section: string;
  imageUrl: string;
}

interface SlideshowProps {
  sectionKey: string;
  title: string;
}

export default function Slideshow({ sectionKey, title }: SlideshowProps) {
  const [loaded, setLoaded] = useState<{ section: string; urls: string[] } | null>(null);
  const [cursor, setCursor] = useState({ section: sectionKey, index: 0 });
  const [isOpen, setIsOpen] = useState(false);

  /*
   * Loading is derived, not stored. The previous version set a status flag
   * synchronously at the top of the effect, which cascaded an extra render on
   * every mount and on every section change. Comparing the loaded section
   * against the requested one answers "still loading?" without a second piece
   * of state that has to be reset.
   */
  const settled = loaded !== null && loaded.section === sectionKey;
  const images = settled ? loaded.urls : [];
  const status: 'loading' | 'ready' | 'empty' = !settled
    ? 'loading'
    : images.length > 0
      ? 'ready'
      : 'empty';

  useEffect(() => {
    let cancelled = false;

    fetch('/api/homepage-images')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: HomepageImage[]) => {
        if (cancelled) return;
        const urls = Array.isArray(data)
          ? data.filter((img) => img.section === sectionKey).map((img) => img.imageUrl)
          : [];
        setLoaded({ section: sectionKey, urls });
      })
      .catch(() => {
        if (cancelled) return;
        setLoaded({ section: sectionKey, urls: [] });
      });

    return () => {
      cancelled = true;
    };
  }, [sectionKey]);

  /*
   * The index is stored against the section it belongs to and read back only
   * when that section is the current one. Switching sections therefore resets
   * the position by construction, rather than through an effect that has to
   * write state back into the component and cause a second render.
   */
  const currentIndex = cursor.section === sectionKey ? cursor.index : 0;

  const goTo = (index: number) => setCursor({ section: sectionKey, index });

  // The keydown handler steps from the functional state so the listener does
  // not need to be torn down and rebuilt every time the index changes.
  useEffect(() => {
    const step = (delta: number) =>
      setCursor((c) => {
        if (images.length === 0) return c;
        const from = c.section === sectionKey ? c.index : 0;
        return {
          section: sectionKey,
          index: (from + delta + images.length) % images.length,
        };
      });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, sectionKey]);

  /*
   * Loading is a distinct state from empty. The previous version treated "no
   * images yet" as both, so on any slow connection every visitor saw "No images
   * uploaded yet" flash up before the photographs arrived.
   */
  if (status === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 py-16">
        <p className="text-ink-muted">Loading gallery…</p>
      </div>
    );
  }

  if (status === 'empty') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 py-16">
        <div className="text-center">
          <h1 className="text-headline text-ink">{title}</h1>
          <p className="mt-4 text-ink-muted">
            No images uploaded yet. Add images from the admin panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    /*
     * This is a div, not a main. The site layout already renders
     * <main id="main">, and nesting a second main landmark makes the page
     * invalid and confuses screen readers about where the content starts.
     *
     * dvh rather than vh because mobile browsers resize the viewport as their
     * chrome slides away, which makes vh either clip or overflow.
     */
    <div className="flex min-h-[calc(100dvh-4.5rem)] flex-col">
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="text-center text-2xl font-bold text-ink sm:text-3xl lg:text-4xl">
          {title}
        </h1>

        <div className="relative mt-6 sm:mt-8">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="aspect-16/9 cursor-pointer overflow-hidden rounded-card"
            onClick={() => setIsOpen(true)}
          >
            <Image
              src={images[currentIndex]}
              alt={`Slide ${currentIndex + 1} of ${images.length}`}
              fill
              sizes="(min-width: 1280px) 1280px, 100vw"
              className="object-cover"
            />
          </motion.div>

          {images.length > 1 ? (
            <>
              {/*
                Smaller on phones: at 48px each, two arrows plus their offsets
                cover a meaningful share of a 375px-wide slide and sit on top of
                the photograph rather than beside it.
              */}
              <button
                type="button"
                onClick={() => goTo((currentIndex - 1 + images.length) % images.length)}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/50 text-white transition-colors hover:bg-ink/70 sm:left-4 sm:size-12"
              >
                <ChevronLeft className="size-5 sm:size-6" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => goTo((currentIndex + 1) % images.length)}
                aria-label="Next image"
                className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/50 text-white transition-colors hover:bg-ink/70 sm:right-4 sm:size-12"
              >
                <ChevronRight className="size-5 sm:size-6" aria-hidden="true" />
              </button>
            </>
          ) : null}

          {/*
            Wraps instead of overflowing. A gallery with many images produced a
            single unbroken dot row wider than a phone screen, which pushed the
            page sideways.
          */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:mt-6 sm:gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goTo(idx)}
                aria-label={`Go to image ${idx + 1}`}
                aria-current={idx === currentIndex}
                className={`size-2 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-brand-500' : 'bg-ink/20'
                }`}
              />
            ))}
          </div>

          <div className="absolute right-3 top-3 rounded-full bg-ink/50 px-3 py-1 text-xs text-white sm:right-4 sm:top-4 sm:px-4 sm:py-2 sm:text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-ink-muted">
          Click image to view fullscreen
          <span className="hidden sm:inline"> • Use arrow keys to navigate</span>
        </p>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink p-2 sm:p-6"
            onClick={() => setIsOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className="absolute right-2 top-2 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-4 sm:top-4 sm:size-12"
            >
              <X className="size-5 sm:size-6" aria-hidden="true" />
            </button>

            <div className="relative size-full" onClick={(e) => e.stopPropagation()}>
              <Image
                src={images[currentIndex]}
                alt={`Slide ${currentIndex + 1} of ${images.length}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}