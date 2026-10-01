'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, Camera, Calendar, Map, User, Image as ImageIcon } from 'lucide-react';

interface HomepageImages {
  [key: string]: string;
}

const serviceData = {
  photography: { icon: Camera, title: 'Photography', description: 'Professional photography that captures your special moments.' },
  events: { icon: Calendar, title: 'Events', description: 'Full event coverage with professional results.' },
  'photo-tourism': { icon: Map, title: 'Photo Tourism', description: 'Capture your journey in stunning visuals.' },
  portraits: { icon: User, title: 'Portraits', description: 'Professional portraits for personal or business use.' },
  visuals: { icon: ImageIcon, title: 'Visuals', description: 'Visual content that tells your story.' },
};

const defaultImages = {
  'photography-1': '',
  'photography-2': '',
  'photography-3': '',
  'photography-4': '',
};

export default function Photography({ params }: { params: { slug: string } }) {
  const service = serviceData[params.slug as keyof typeof serviceData] || serviceData.photography;
  const Icon = service.icon;
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

  const galleryImages = [
    { key: 'photography-1', title: 'Product Shots', desc: 'Showcase your products' },
    { key: 'photography-2', title: 'Real Estate', desc: 'Property photography' },
    { key: 'photography-3', title: 'Food & Drink', desc: 'Restaurant visuals' },
    { key: 'photography-4', title: 'Fashion', desc: 'Style shoots' },
  ];

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
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[color:var(--color-brand-500)]">
                Media
              </p>
              <h1 className="text-display text-ink">
                <span className="text-[color:var(--color-brand-500)]">{service.title}</span>
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-ink-muted sm:text-xl">
                {service.description}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-card border border-line bg-surface-sunken p-8"
              >
                <Icon className="w-16 h-16 text-[color:var(--color-brand-500)] mb-6" />
                <h2 className="text-headline text-ink mb-4">Professional {service.title}</h2>
                <p className="text-ink-muted mb-6">
                  We deliver high-quality {service.title.toLowerCase()} services tailored to your needs. 
                  Our experienced team ensures every detail is captured perfectly.
                </p>
                <ul className="space-y-3 text-ink-muted">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[color:var(--color-brand-500)]" />
                    High-resolution delivery
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[color:var(--color-brand-500)]" />
                    Professional editing included
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[color:var(--color-brand-500)]" />
                    Quick turnaround time
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="rounded-card border border-line bg-surface-sunken p-8"
              >
                <h3 className="text-xl font-bold mb-4">What&apos;s Included</h3>
                <ul className="space-y-4 text-ink-muted">
                  <li>• Professional {service.title.toLowerCase()}</li>
                  <li>• Multiple locations (where applicable)</li>
                  <li>• High-resolution digital files</li>
                  <li>• Online gallery for sharing</li>
                  <li>• Print-ready versions</li>
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
              <h2 className="text-headline text-ink mb-4">Our Photography</h2>
              <p className="text-ink-muted">Professional shots for every need</p>
            </motion.div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {galleryImages.map((img, index) => (
                <motion.div
                  key={img.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-card border border-line bg-surface-sunken"
                >
                  {images[img.key] ? (
                    <Image
                      src={images[img.key]}
                      alt={img.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center bg-surface-sunken">
                      <Camera className="size-10 text-brand-500/50" aria-hidden="true" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[color:var(--color-brand-500)] transition-colors">{img.title}</h3>
                    <p className="text-ink-muted text-sm">{img.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-12 sm:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <Link href="/services/media/photography/slideshow" className="inline-flex items-center gap-2 px-8 py-4 bg-[color:var(--color-brand-500)] text-white rounded-full font-medium hover:bg-[color:var(--color-brand-400)] transition-colors">
              View Full Gallery <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <section className="px-6 pb-24 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-5xl rounded-card border border-line bg-surface p-10 text-center lg:p-14"
          >
            <h2 className="text-headline text-ink">Ready for {service.title}?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-muted">
              Contact us to book your session.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-500)] px-8 py-4 font-medium text-white transition-colors hover:bg-[color:var(--color-brand-400)]"
            >
              Book Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </section>
      
    </>
  );
}