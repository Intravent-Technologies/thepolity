'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      
        <section className="relative overflow-hidden">
          <div className="relative mx-auto flex min-h-[40vh] max-w-7xl items-center px-6 py-24 sm:px-8 lg:px-12">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-4xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[color:var(--color-brand-500)]">FAQ</p>
              <h1 className="text-display text-ink">Frequently asked<span className="text-[color:var(--color-brand-500)]"> questions.</span></h1>
              <p className="mt-6 max-w-3xl text-lg text-ink-muted sm:text-xl">Everything you need to know about working with The Polity.</p>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-4xl">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div key={faq.question} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="rounded-card border border-line bg-surface-sunken">
                  <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="flex w-full items-center justify-between p-6 text-left">
                    <span className="text-lg font-medium pr-4">{faq.question}</span>
                    {openIndex === index ? <Minus className="h-5 w-5 flex-shrink-0 text-[color:var(--color-brand-500)]" /> : <Plus className="h-5 w-5 flex-shrink-0 text-[color:var(--color-brand-500)]" />}
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <p className="px-6 pb-6 text-ink-muted">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 sm:px-8 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-5xl rounded-card border border-line bg-surface p-10 text-center lg:p-14">
            <h2 className="text-headline text-ink">Still have questions?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-muted">We&apos;re here to help. Reach out and we&apos;ll get back to you.</p>
            <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-500)] px-8 py-4 font-medium text-white transition-colors hover:bg-[color:var(--color-brand-400)]">Get in Touch <ArrowRight className="h-5 w-5" /></Link>
          </motion.div>
        </section>
      
    </>
  );
}