'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, Building2, Leaf, Map, Mountain, Waves } from 'lucide-react';

interface HomepageImages {
  [key: string]: string;
}

const defaultImages = {
  'photo-tourism-1': '',
  'photo-tourism-2': '',
  'photo-tourism-3': '',
  'photo-tourism-4': '',
};

export default function PhotoTourism() {
  const [images, setImages] = useState<HomepageImages>(defaultImages);

  useEffect(() => {
    fetch('/api/homepage-images')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const imgs: HomepageImages = {};
          data.forEach((item: { section: string; imageUrl: string }) => {
            imgs[item.section] = item.imageUrl;
          });
          setImages(prev => ({ ...prev, ...imgs }));
        }
      })
      .catch(console.error);
  }, []);

  const tourImages = [
    { key: 'photo-tourism-1', title: 'Mountain Adventures', desc: 'Peak experiences', icon: Mountain },
    { key: 'photo-tourism-2', title: 'Beach & Coast', desc: 'Seaside escapes', icon: Waves },
    { key: 'photo-tourism-3', title: 'City Exploration', desc: 'Urban journeys', icon: Building2 },
    { key: 'photo-tourism-4', title: 'Nature & Wildlife', desc: 'Wild encounters', icon: Leaf },
  ];

  return (
    <>
      
        <section className="relative overflow-hidden">
          <div className="relative mx-auto flex min-h-[60vh] max-w-7xl items-center px-6 py-24 sm:px-8 lg:px-12">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-4xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[color:var(--color-brand-500)]">Media</p>
              <h1 className="text-display text-ink"><span className="text-[color:var(--color-brand-500)]">Photo Tourism</span></h1>
              <p className="mt-6 max-w-3xl text-lg text-ink-muted sm:text-xl">Capture your journey in stunning visuals.</p>
            </motion.div>
          </div>
        </section>
        <section className="px-6 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 md:grid-cols-2">
              <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-card border border-line bg-surface-sunken p-8">
                <Map className="w-16 h-16 text-[color:var(--color-brand-500)] mb-6" />
                <h2 className="text-headline text-ink mb-4">Photo Tourism</h2>
                <p className="text-ink-muted mb-6">We capture your travels in beautiful, professional photographs.</p>
                <ul className="space-y-3 text-ink-muted">
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[color:var(--color-brand-500)]" />Location scouting</li>
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[color:var(--color-brand-500)]" />Travel photography</li>
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[color:var(--color-brand-500)]" />Adventure shoots</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="px-6 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <h2 className="text-headline text-ink mb-4">Our Photo Tours</h2>
              <p className="text-ink-muted">Adventure photography worldwide</p>
            </motion.div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {tourImages.map((tour, index) => {
                const Icon = tour.icon;
                return (
                <motion.div
                  key={tour.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-card border border-line bg-surface-sunken"
                >
                  {images[tour.key] ? (
                    <img src={images[tour.key]} alt={tour.title} className="w-full aspect-[4/3] object-cover" />
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center bg-surface-sunken">
                      <Icon className="size-10 text-brand-500/50" aria-hidden="true" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[color:var(--color-brand-500)] transition-colors">{tour.title}</h3>
                    <p className="text-ink-muted text-sm">{tour.desc}</p>
                  </div>
                </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-6 pb-12 sm:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <Link href="/services/media/photo-tourism/slideshow" className="inline-flex items-center gap-2 px-8 py-4 bg-[color:var(--color-brand-500)] text-white rounded-full font-medium hover:bg-[color:var(--color-brand-400)] transition-colors">
              View Full Gallery <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <section className="px-6 pb-24 sm:px-8 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-5xl rounded-card border border-line bg-surface p-10 text-center lg:p-14">
            <h2 className="text-headline text-ink">Book Your Photo Tourism</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-muted">Let&apos;s capture your journey.</p>
            <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-500)] px-8 py-4 font-medium text-white hover:bg-[color:var(--color-brand-400)]">Book Now<ArrowRight className="h-5 w-5" /></Link>
          </motion.div>
        </section>
      
    </>
  );
}