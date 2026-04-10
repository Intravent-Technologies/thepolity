'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
      <Header />
      <main className="overflow-x-hidden bg-[#0a0a0a] pt-20 text-white">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#001F3F]/30 via-[#0a0a0a] to-[#0a0a0a]" />
          <div className="relative mx-auto flex min-h-[60vh] max-w-7xl items-center px-6 py-24 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-4xl"
            >
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#FF6B35]">
                Gallery
              </p>
              <h1 className="text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
                Images and videos from the
                <span className="text-[#FF6B35]"> admin uploads.</span>
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-white/70 sm:text-xl">
                The gallery now shows actual uploaded pictures and videos instead of placeholder boxes.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            {loading ? (
              <p className="text-white/60">Loading gallery...</p>
            ) : items.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
                <h2 className="text-3xl font-bold">No gallery media yet</h2>
                <p className="mt-4 text-white/65">
                  Upload images or videos from the admin dashboard and they will appear here automatically.
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
                    className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02]"
                  >
                    <div className="h-72 bg-black">
                      {item.type === 'image' ? (
                        <img src={item.url} alt={item.title} className="h-full w-full object-cover" />
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
                      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#FF6B35]">
                        {item.type}
                      </p>
                      <h2 className="text-2xl font-bold">{item.title}</h2>
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
            className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-gradient-to-br from-[#001F3F] to-[#0a0a0a] p-10 text-center lg:p-14"
          >
            <h2 className="text-4xl font-bold sm:text-5xl">Want to work with a team like this?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">
              We would love to hear what you are building and where you need support.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-8 py-4 font-medium text-white transition-colors hover:bg-[#FF9F66]"
            >
              Get In Touch
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
