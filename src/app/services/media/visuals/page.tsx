'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, Image } from 'lucide-react';

export default function Visuals() {
  const visualImages = [
    { emoji: '🎨', title: 'Brand Design', desc: 'Identity visuals' },
    { emoji: '📱', title: 'Social Media', desc: 'Engaging content' },
    { emoji: '📦', title: 'Product', desc: 'E-commerce visuals' },
    { emoji: '🎬', title: 'Video', desc: 'Motion content' },
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
              <h1 className="text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl"><span className="text-[#FF6B35]">Visuals</span></h1>
              <p className="mt-6 max-w-3xl text-lg text-white/70 sm:text-xl">Visual content that tells your story.</p>
            </motion.div>
          </div>
        </section>
        <section className="px-6 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 md:grid-cols-2">
              <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-white/10 bg-white/5 p-8">
                <Image className="w-16 h-16 text-[#FF6B35] mb-6" />
                <h2 className="text-2xl font-bold mb-4">Visual Content</h2>
                <p className="text-white/60 mb-6">We create stunning visual content for your brand.</p>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#FF6B35]" />Brand visuals</li>
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#FF6B35]" />Product photography</li>
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#FF6B35]" />Social media content</li>
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
              <h2 className="text-4xl font-bold mb-4">Our Visuals</h2>
              <p className="text-white/70">Creative visual solutions</p>
            </motion.div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {visualImages.map((visual, index) => (
                <motion.div
                  key={visual.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                >
                  <div className="aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-[#001F3F]/30 to-[#FF6B35]/10">
                    <span className="text-6xl">{visual.emoji}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#FF6B35] transition-colors">{visual.title}</h3>
                    <p className="text-white/60 text-sm">{visual.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <section className="px-6 pb-24 sm:px-8 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-gradient-to-br from-[#001F3F] to-[#0a0a0a] p-10 text-center lg:p-14">
            <h2 className="text-4xl font-bold sm:text-5xl">Get Visual Content</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">Let's create stunning visuals for your brand.</p>
            <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-8 py-4 font-medium text-white hover:bg-[#FF9F66]">Get Started<ArrowRight className="h-5 w-5" /></Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}