'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, Camera, Calendar, Map, User, Image } from 'lucide-react';

interface HomepageImages {
  [key: string]: string;
}

const serviceData = {
  photography: { icon: Camera, title: 'Photography', description: 'Professional photography that captures your special moments.' },
  events: { icon: Calendar, title: 'Events', description: 'Full event coverage with professional results.' },
  'photo-tourism': { icon: Map, title: 'Photo Tourism', description: 'Capture your journey in stunning visuals.' },
  portraits: { icon: User, title: 'Portraits', description: 'Professional portraits for personal or business use.' },
  visuals: { icon: Image, title: 'Visuals', description: 'Visual content that tells your story.' },
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

        <section className="px-6 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <h2 className="text-4xl font-bold mb-4">Our Photography</h2>
              <p className="text-white/70">Professional shots for every need</p>
            </motion.div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {galleryImages.map((img, index) => (
                <motion.div
                  key={img.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                >
                  {images[img.key] ? (
                    <img src={images[img.key]} alt={img.title} className="w-full aspect-[4/3] object-cover" />
                  ) : (
                    <div className="aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-[#001F3F]/30 to-[#FF6B35]/10">
                      <span className="text-6xl">📷</span>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#FF6B35] transition-colors">{img.title}</h3>
                    <p className="text-white/60 text-sm">{img.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-12 sm:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <Link href="/services/media/photography/slideshow" className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF6B35] text-white rounded-full font-medium hover:bg-[#FF9F66] transition-colors">
              View Full Gallery <ArrowRight className="w-5 h-5" />
            </Link>
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