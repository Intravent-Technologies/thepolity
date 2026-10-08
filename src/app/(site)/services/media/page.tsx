'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Camera, Calendar, Map, User, Image } from 'lucide-react';

const mediaServices = [
  { slug: 'photography', title: 'Photography', icon: Camera, description: 'Professional photography for all occasions.' },
  { slug: 'events', title: 'Events', icon: Calendar, description: 'Full event coverage with professional results.' },
  { slug: 'photo-tourism', title: 'Photo Tourism', icon: Map, description: 'Capture your journey in stunning visuals.' },
  { slug: 'portraits', title: 'Portraits', icon: User, description: 'Professional portraits for personal or business use.' },
  { slug: 'visuals', title: 'Visuals', icon: Image, description: 'Visual content that tells your story.' },
];

export default function Media() {
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
                Media
              </p>
              <h1 className="text-display text-ink">
                Capturing moments,
                <span className="text-brand-500"> creating memories.</span>
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-ink-muted sm:text-xl">
                Professional photography, events coverage, and visual storytelling.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {mediaServices.map((service, index) => (
                <motion.article
                  key={service.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group rounded-card border border-line bg-surface p-8 transition-[border-color] duration-200 hover:border-brand-500/40"
                >
                  <service.icon className="w-12 h-12 text-brand-500 mb-4" />
                  <h2 className="text-headline text-ink mb-4">{service.title}</h2>
                  <p className="mb-6 text-ink-muted">{service.description}</p>
                  <Link
                    href={`/services/media/${service.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-brand-500 hover:underline"
                  >
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-5xl rounded-card border border-line bg-surface p-10 text-center lg:p-14"
          >
            <h2 className="text-headline text-ink">Ready to capture your moments?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-muted">
              Contact us today to discuss your media needs.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-500)] px-8 py-4 font-medium text-white transition-colors hover:bg-[color:var(--color-brand-400)]"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/work"
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-8 py-4 font-medium text-ink transition-colors hover:border-brand-500 hover:text-brand-600"
              >
                View our work
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </section>
      
    </>
  );
}