'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  createdAt: string;
}

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      try {
        const response = await fetch('/api/gallery', { cache: 'no-store' });
        const data = await response.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load gallery:', error);
      } finally {
        setLoading(false);
      }
    }

    void loadGallery();
  }, []);

  return (
    <>
      
        <section className="relative overflow-hidden">
          <div className="relative mx-auto flex min-h-[60vh] max-w-7xl items-center px-6 py-24 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-4xl"
            >
              <p className="tp-label mb-4 text-brand-600">
                Gallery
              </p>
              <h1 className="text-display text-ink">
                Visual stories from our
                <span className="text-brand-500"> recent projects.</span>
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-ink-muted sm:text-xl">
                Explore our gallery to see the quality of our work across photography, events, and creative media services.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            {loading ? (
              <p className="text-ink-muted">Loading gallery...</p>
            ) : items.length === 0 ? (
              <div className="rounded-card border border-line bg-surface p-10 text-center">
                <h2 className="text-headline text-ink">No gallery items yet</h2>
                <p className="mt-4 text-ink-muted">
                  We&apos;re adding new content regularly. Contact us to see examples of our work.
                </p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item, index) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="overflow-hidden rounded-card border border-line bg-surface"
                  >
                    <div className="relative h-72 bg-ink">
                      {item.type === 'image' ? (
                        <Image src={item.url} alt={item.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                      ) : (
                        <video
                          src={item.url}
                          controls
                          preload="metadata"
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-6">
                      <p className="tp-label mb-3 text-brand-600">
                        {item.type}
                      </p>
                      <h2 className="text-headline text-ink">{item.title}</h2>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="px-6 pb-24 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-5xl rounded-card border border-line bg-surface p-10 text-center lg:p-14"
          >
            <h2 className="text-headline text-ink">Want to work with a team like this?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-muted">
              We would love to hear what you are building and where you need support.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-500)] px-8 py-4 font-medium text-white transition-colors hover:bg-[color:var(--color-brand-400)]"
            >
              Get In Touch
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </section>
      
    </>
  );
}
