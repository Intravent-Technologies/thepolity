'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Star, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Review {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      const data = await response.json();
      setReviews(data.length > 0 ? data : defaultReviews);
    } catch (error) { setReviews(defaultReviews); }
    finally { setLoading(false); }
  };

  const defaultReviews: Review[] = [
    { id: '1', name: 'Alex R.', role: 'Founder & CEO, BrightVision', content: "Working with THE POLITY transformed our website's impact...", rating: 5 },
    { id: '2', name: 'Sarah M.', role: 'Marketing Director, TechFlow', content: 'Their team delivered beyond our expectations...', rating: 5 },
    { id: '3', name: 'James L.', role: 'CTO, Innovate Labs', content: 'Outstanding IT consultancy...', rating: 5 },
    { id: '4', name: 'Emily K.', role: 'Brand Manager, Essence Co.', content: "The Polity's media strategy completely revitalized our brand...", rating: 5 },
    { id: '5', name: 'Michael T.', role: 'Operations Head, ScaleUp Inc.', content: 'Their project management expertise is second to none...', rating: 5 },
    { id: '6', name: 'Lisa R.', role: 'CEO, Horizon Ventures', content: 'Exceptional business strategy support...', rating: 5 },
  ];

  const stats = [
    { number: '4.97/5', label: 'Average Rating' },
    { number: '600+', label: 'Client Reviews' },
    { number: '98%', label: 'Client Satisfaction' },
    { number: '50+', label: 'Industries Served' },
  ];

  return (
    <>
      <Header />
      <main className="overflow-x-hidden bg-[#0a0a0a] pt-20 text-white">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#001F3F]/30 via-[#0a0a0a] to-[#0a0a0a]" />
          <div className="relative mx-auto flex min-h-[50vh] max-w-7xl items-center px-6 py-20 sm:px-8 lg:px-12">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-4xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#FF6B35]">Client Reviews</p>
              <h1 className="text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">Trusted by<span className="text-[#FF6B35]"> businesses</span> worldwide</h1>
              <p className="mt-6 max-w-3xl text-lg text-white/70 sm:text-xl">Don&apos;t just take our word for it. Here&apos;s what our clients have to say about working with The Polity.</p>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center p-6 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10">
                  <div className="text-3xl sm:text-4xl font-bold text-[#FF6B35] mb-2">{stat.number}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            {loading ? <div className="text-center py-20"><p className="text-white/60">Loading reviews...</p></div> : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {reviews.map((review, index) => (
                  <motion.article key={review.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="group rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 transition-all duration-300 hover:border-[#FF6B35]/50">
                    <div className="flex gap-1 mb-6">{[...Array(review.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-[#FF6B35] text-[#FF6B35]" />)}</div>
                    <Quote className="w-10 h-10 text-[#FF6B35]/30 mb-4" />
                    <p className="text-white/70 leading-relaxed mb-8">{review.content}</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#FF9F66] rounded-full flex items-center justify-center text-white font-bold">{review.name[0]}</div>
                      <div><div className="font-semibold">{review.name}</div><div className="text-white/50 text-sm">{review.role}</div></div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="px-6 pb-24 sm:px-8 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-gradient-to-br from-[#001F3F] to-[#0a0a0a] p-10 text-center lg:p-14">
            <h2 className="text-4xl font-bold sm:text-5xl">Ready to join our satisfied clients?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">Let&apos;s discuss how we can help transform your business.</p>
            <a href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-8 py-4 font-medium text-white transition-colors hover:bg-[#FF9F66]">Get in Touch</a>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}