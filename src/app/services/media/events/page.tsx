'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, Calendar } from 'lucide-react';

interface HomepageImages {
  [key: string]: string;
}

const defaultImages = {
  'events-1': '',
  'events-2': '',
  'events-3': '',
  'events-4': '',
};

export default function Events() {
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

  const eventImages = [
    { key: 'events-1', title: 'Weddings', desc: 'Capture your special day' },
    { key: 'events-2', title: 'Birthdays', desc: 'Celebrate milestones' },
    { key: 'events-3', title: 'Graduations', desc: 'Achievement moments' },
    { key: 'events-4', title: 'Corporate', desc: 'Business events' },
  ];

  return (
    <>
      <Header />
      <main className="overflow-x-hidden bg-[#0a0a0a] pt-20 text-white">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#001F3F]/30 via-[#0a0a0a] to-[#0a0a0a]" />
          <div className="relative mx-auto flex min-h-[60vh] max-w-7xl items-center px-6 py-24 sm:px-8 lg:px-12">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-4xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#FF6B35]">Media</p>
              <h1 className="text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl"><span className="text-[#FF6B35]">Events</span></h1>
              <p className="mt-6 max-w-3xl text-lg text-white/70 sm:text-xl">Full event coverage with professional results.</p>
            </motion.div>
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
              <h2 className="text-4xl font-bold mb-4">Our Events</h2>
              <p className="text-white/70">We capture all types of events</p>
            </motion.div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {eventImages.map((event, index) => (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                >
                  {images[event.key] ? (
                    <img src={images[event.key]} alt={event.title} className="w-full aspect-[4/3] object-cover" />
                  ) : (
                    <div className="aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-[#001F3F]/30 to-[#FF6B35]/10">
                      <span className="text-6xl">💒</span>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#FF6B35] transition-colors">{event.title}</h3>
                    <p className="text-white/60 text-sm">{event.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <section className="px-6 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 md:grid-cols-2">
              <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-white/10 bg-white/5 p-8">
                <Calendar className="w-16 h-16 text-[#FF6B35] mb-6" />
                <h2 className="text-2xl font-bold mb-4">Event Coverage</h2>
                <p className="text-white/60 mb-6">We provide comprehensive event coverage for weddings, corporate events, parties, and more.</p>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#FF6B35]" />Full day coverage</li>
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#FF6B35]" />Multiple photographers</li>
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#FF6B35]" />Quick delivery</li>
                </ul>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="rounded-2xl border border-white/10 bg-white/5 p-8">
                <h3 className="text-xl font-bold mb-4">What's Included</h3>
                <ul className="space-y-4 text-white/70">
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
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-gradient-to-br from-[#001F3F] to-[#0a0a0a] p-10 text-center lg:p-14">
            <h2 className="text-4xl font-bold sm:text-5xl">Book Your Event Coverage</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">Contact us to discuss your event.</p>
            <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-8 py-4 font-medium text-white hover:bg-[#FF9F66]">Book Now<ArrowRight className="h-5 w-5" /></Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}