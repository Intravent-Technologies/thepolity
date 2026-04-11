'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  { question: 'What services does The Polity offer?', answer: 'We offer IT Consultancy, Media, Project Management, Business Strategy, Data Analytics, and Digital Transformation services.' },
  { question: 'How do you approach new projects?', answer: 'We begin with a discovery phase, move into execution with visible progress, and ensure growth with reusable foundations.' },
  { question: 'What industries do you work with?', answer: 'We work across technology, finance, healthcare, education, and nonprofit sectors.' },
  { question: 'How long does a typical engagement last?', answer: 'Project timelines vary based on scope - from weeks to several months.' },
  { question: 'What makes The Polity different?', answer: 'We combine strategic thinking with practical execution, delivering measurable lasting impact.' },
  { question: 'Do you offer ongoing support?', answer: 'Yes, we offer continued support and maintenance options after project completion.' },
  { question: 'How do you handle confidential information?', answer: 'We follow industry best practices and all team members sign NDAs.' },
  { question: 'How do I get started?', answer: 'Reach out through our contact page or email hello@thepolityservices.com.' },
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <Header />
      <main className="overflow-x-hidden bg-[#0a0a0a] pt-20 text-white">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#001F3F]/30 via-[#0a0a0a] to-[#0a0a0a]" />
          <div className="relative mx-auto flex min-h-[40vh] max-w-7xl items-center px-6 py-24 sm:px-8 lg:px-12">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-4xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#FF6B35]">FAQ</p>
              <h1 className="text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">Frequently asked<span className="text-[#FF6B35]"> questions.</span></h1>
              <p className="mt-6 max-w-3xl text-lg text-white/70 sm:text-xl">Everything you need to know about working with The Polity.</p>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-4xl">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div key={faq.question} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="rounded-2xl border border-white/10 bg-white/5">
                  <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="flex w-full items-center justify-between p-6 text-left">
                    <span className="text-lg font-medium pr-4">{faq.question}</span>
                    {openIndex === index ? <Minus className="h-5 w-5 flex-shrink-0 text-[#FF6B35]" /> : <Plus className="h-5 w-5 flex-shrink-0 text-[#FF6B35]" />}
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <p className="px-6 pb-6 text-white/70">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 sm:px-8 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-gradient-to-br from-[#001F3F] to-[#0a0a0a] p-10 text-center lg:p-14">
            <h2 className="text-4xl font-bold sm:text-5xl">Still have questions?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">We&apos;re here to help. Reach out and we&apos;ll get back to you.</p>
            <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-8 py-4 font-medium text-white transition-colors hover:bg-[#FF9F66]">Get in Touch <ArrowRight className="h-5 w-5" /></Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}