'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Clock, Users, BarChart3, FileCheck } from 'lucide-react';

const features = [
  { icon: Clock, title: 'Timeline Management', description: 'We keep your projects on schedule and within timeline.' },
  { icon: Users, title: 'Stakeholder Alignment', description: 'Everyone stays informed and aligned throughout the project.' },
  { icon: BarChart3, title: 'Progress Tracking', description: 'Regular updates and reporting on project status.' },
  { icon: FileCheck, title: 'Quality Assurance', description: 'Ensuring deliverables meet your standards.' },
];

export default function ProjectManagement() {
  return (
    <>
      
        <section className="relative overflow-hidden">
          <div className="relative mx-auto flex min-h-[60vh] max-w-7xl items-center px-6 py-24 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-4xl"
            >
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[color:var(--color-brand-500)]">
                Project Management
              </p>
              <h1 className="text-display text-ink">
                Projects delivered
                <span className="text-[color:var(--color-brand-500)]"> on time.</span>
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-ink-muted sm:text-xl">
                Clear project structure that keeps stakeholders aligned and delivery on track.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 md:grid-cols-2">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-card border border-line bg-surface-sunken p-8"
                >
                  <feature.icon className="w-10 h-10 text-[color:var(--color-brand-500)] mb-4" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-ink-muted">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-5xl rounded-card border border-line bg-surface p-10 text-center lg:p-14"
          >
            <h2 className="text-headline text-ink">Need Project Management?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-muted">
              Let us help you deliver your projects successfully.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-500)] px-8 py-4 font-medium text-white transition-colors hover:bg-[color:var(--color-brand-400)]"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </section>
      
    </>
  );
}