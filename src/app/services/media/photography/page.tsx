'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, Camera, Calendar, Map, User, Image } from 'lucide-react';

const serviceData = {
  photography: { icon: Camera, title: 'Photography', description: 'Professional photography that captures your special moments.' },
  events: { icon: Calendar, title: 'Events', description: 'Full event coverage with professional results.' },
  'photo-tourism': { icon: Map, title: 'Photo Tourism', description: 'Capture your journey in stunning visuals.' },
  portraits: { icon: User, title: 'Portraits', description: 'Professional portraits for personal or business use.' },
  visuals: { icon: Image, title: 'Visuals', description: 'Visual content that tells your story.' },
};

export default function Photography({ params }: { params: { slug: string } }) {
  const service = serviceData[params.slug as keyof typeof serviceData] || serviceData.photography;
  const Icon = service.icon;

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
                <span className="text-[#FF6B35]">{service.title}</span>
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-white/70 sm:text-xl">
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
                className="rounded-2xl border border-white/10 bg-white/5 p-8"
              >
                <Icon className="w-16 h-16 text-[#FF6B35] mb-6" />
                <h2 className="text-2xl font-bold mb-4">Professional {service.title}</h2>
                <p className="text-white/60 mb-6">
                  We deliver high-quality {service.title.toLowerCase()} services tailored to your needs. 
                  Our experienced team ensures every detail is captured perfectly.
                </p>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF6B35]" />
                    High-resolution delivery
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF6B35]" />
                    Professional editing included
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF6B35]" />
                    Quick turnaround time
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-8"
              >
                <h3 className="text-xl font-bold mb-4">What's Included</h3>
                <ul className="space-y-4 text-white/70">
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

        <section className="px-6 pb-24 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-gradient-to-br from-[#001F3F] to-[#0a0a0a] p-10 text-center lg:p-14"
          >
            <h2 className="text-4xl font-bold sm:text-5xl">Ready for {service.title}?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">
              Contact us to book your session.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-8 py-4 font-medium text-white transition-colors hover:bg-[#FF9F66]"
            >
              Book Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}