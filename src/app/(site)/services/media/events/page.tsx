'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';

export default function Events() {
  return (
    <>
      
        <section className="relative overflow-hidden">
          <div className="relative mx-auto flex min-h-[60vh] max-w-7xl items-center px-6 py-24 sm:px-8 lg:px-12">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-4xl">
              <p className="tp-label mb-4 text-brand-600">Media</p>
              <h1 className="text-display text-ink"><span className="text-brand-500">Events</span></h1>
              <p className="mt-6 max-w-3xl text-lg text-ink-muted sm:text-xl">Full event coverage with professional results.</p>
            </motion.div>
          </div>
        </section>
        <section className="px-6 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 md:grid-cols-2">
              <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-card border border-line bg-surface p-8">
                <Calendar className="w-16 h-16 text-brand-500 mb-6" />
                <h2 className="text-headline text-ink mb-4">Event Coverage</h2>
                <p className="text-ink-muted mb-6">We provide comprehensive event coverage for weddings, corporate events, parties, and more.</p>
                <ul className="space-y-3 text-ink-muted">
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[color:var(--color-brand-500)]" />Full day coverage</li>
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[color:var(--color-brand-500)]" />Multiple photographers</li>
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[color:var(--color-brand-500)]" />Quick delivery</li>
                </ul>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="rounded-card border border-line bg-surface p-8">
                <h3 className="text-xl font-bold mb-4">What&apos;s Included</h3>
                <ul className="space-y-4 text-ink-muted">
                  <li>• Professional photographers</li>
                  <li>• High-resolution photos</li>
                  <li>• Online gallery</li>
                  <li>• Print releases</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>
        <section className="px-6 pb-24 sm:px-8 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-5xl rounded-card border border-line bg-surface p-10 text-center lg:p-14">
            <h2 className="text-headline text-ink">Book Your Event Coverage</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-muted">Contact us to discuss your event.</p>
            <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-500)] px-8 py-4 font-medium text-white hover:bg-[color:var(--color-brand-400)]">Book Now<ArrowRight className="h-5 w-5" /></Link>
          </motion.div>
        </section>
      
    </>
  );
}