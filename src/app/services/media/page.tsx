'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
                Media
              </p>
              <h1 className="text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
                Capturing moments,
                <span className="text-[#FF6B35]"> creating memories.</span>
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-white/70 sm:text-xl">
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
                  className="group rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 transition-all duration-300 hover:border-[#FF6B35]/50"
                >
                  <service.icon className="w-12 h-12 text-[#FF6B35] mb-4" />
                  <h2 className="mb-4 text-2xl font-bold">{service.title}</h2>
                  <p className="mb-6 text-white/70">{service.description}</p>
                  <Link
                    href={`/services/media/${service.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#FF6B35] hover:underline"
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
            className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-gradient-to-br from-[#001F3F] to-[#0a0a0a] p-10 text-center lg:p-14"
          >
            <h2 className="text-4xl font-bold sm:text-5xl">Ready to capture your moments?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">
              Contact us today to discuss your media needs.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-8 py-4 font-medium text-white transition-colors hover:bg-[#FF9F66]"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}