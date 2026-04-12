'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';

const mediaServices = [
  { slug: 'photography', title: 'Photography', description: 'Professional photography for all occasions.' },
  { slug: 'events', title: 'Events', description: 'Capture your special moments.' },
  { slug: 'photo-tourism', title: 'Photo Tourism', description: 'Travel photography adventures.' },
  { slug: 'portraits', title: 'Portraits', description: 'Professional portrait sessions.' },
  { slug: 'visuals', title: 'Visuals', description: 'High-quality visual content.' },
];

export default function Media() {
  return (
    <>
      <Header />
      <main className="overflow-x-hidden bg-[#0a0a0a] pt-20 text-white">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#001F3F]/30 via-[#0a0a0a] to-[#0a0a0a]" />
          <div className="relative mx-auto flex min-h-[40vh] max-w-7xl items-center px-6 py-16 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-4xl"
            >
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#FF6B35]">
                Services
              </p>
              <h1 className="text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
                <span className="text-[#FF6B35]">Media</span> Services
              </h1>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8">
              {mediaServices.map((service, index) => (
                <motion.div
                  key={service.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/services/media/${service.slug}`}>
                    <div className="group h-full p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-[#FF6B35]/50 transition-all duration-300">
                      <h3 className="text-2xl font-bold mb-4 group-hover:text-[#FF6B35] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-white/70 mb-4">{service.description}</p>
                      <div className="mt-6 flex items-center gap-2 text-[#FF6B35]">
                        <span>Learn more</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}