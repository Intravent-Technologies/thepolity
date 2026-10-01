'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, Briefcase, Palette, User, UserRound, Users } from 'lucide-react';

interface HomepageImages {
  [key: string]: string;
}

const defaultImages = {
  'portraits-1': '',
  'portraits-2': '',
  'portraits-3': '',
  'portraits-4': '',
};

export default function Portraits() {
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

  const portraitImages = [
    { key: 'portraits-1', title: 'Corporate', desc: 'Business professional', icon: Briefcase },
    { key: 'portraits-2', title: 'Family', desc: 'Cherished moments', icon: Users },
    { key: 'portraits-3', title: 'Headshots', desc: 'Professional profiles', icon: UserRound },
    { key: 'portraits-4', title: 'Creative', desc: 'Artistic portraits', icon: Palette },
  ];

  return (
    <>
      
        <section className="relative overflow-hidden">
          <div className="relative mx-auto flex min-h-[60vh] max-w-7xl items-center px-6 py-24 sm:px-8 lg:px-12">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-4xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[color:var(--color-brand-500)]">Media</p>
              <h1 className="text-display text-ink"><span className="text-[color:var(--color-brand-500)]">Portraits</span></h1>
              <p className="mt-6 max-w-3xl text-lg text-ink-muted sm:text-xl">Professional portraits for personal or business use.</p>
            </motion.div>
          </div>
        </section>
        <section className="px-6 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 md:grid-cols-2">
              <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-card border border-line bg-surface-sunken p-8">
                <User className="w-16 h-16 text-[color:var(--color-brand-500)] mb-6" />
                <h2 className="text-headline text-ink mb-4">Professional Portraits</h2>
                <p className="text-ink-muted mb-6">We create professional portraits for LinkedIn, business cards, and personal use.</p>
                <ul className="space-y-3 text-ink-muted">
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[color:var(--color-brand-500)]" />Corporate portraits</li>
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[color:var(--color-brand-500)]" />Family portraits</li>
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[color:var(--color-brand-500)]" />Headshots</li>
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
              <h2 className="text-headline text-ink mb-4">Our Portraits</h2>
              <p className="text-ink-muted">Professional portrait photography</p>
            </motion.div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {portraitImages.map((portrait, index) => {
                const Icon = portrait.icon;
                return (
                <motion.div
                  key={portrait.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-card border border-line bg-surface-sunken"
                >
                  {images[portrait.key] ? (
                    <img src={images[portrait.key]} alt={portrait.title} className="w-full aspect-[4/3] object-cover" />
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center bg-surface-sunken">
                      <Icon className="size-10 text-brand-500/50" aria-hidden="true" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[color:var(--color-brand-500)] transition-colors">{portrait.title}</h3>
                    <p className="text-ink-muted text-sm">{portrait.desc}</p>
                  </div>
                </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-6 pb-12 sm:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <Link href="/services/media/portraits/slideshow" className="inline-flex items-center gap-2 px-8 py-4 bg-[color:var(--color-brand-500)] text-white rounded-full font-medium hover:bg-[color:var(--color-brand-400)] transition-colors">
              View Full Gallery <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <section className="px-6 pb-24 sm:px-8 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-5xl rounded-card border border-line bg-surface p-10 text-center lg:p-14">
            <h2 className="text-headline text-ink">Book Your Portrait Session</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-muted">Get professional portraits today.</p>
            <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-500)] px-8 py-4 font-medium text-white hover:bg-[color:var(--color-brand-400)]">Book Now<ArrowRight className="h-5 w-5" /></Link>
          </motion.div>
        </section>
      
    </>
  );
}