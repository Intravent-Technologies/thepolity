'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';

const services = [
  {
    slug: 'it-consultancy',
    title: 'IT Consultancy',
    description: 'Technology direction, systems planning, and practical solutions that remove friction.',
    details:
      'We help teams choose the right tools, modernize workflows, and make smarter technical decisions with confidence.',
  },
  {
    slug: 'media',
    title: 'Media',
    description: 'Strategic messaging and content systems that strengthen visibility and trust.',
    details:
      'From positioning to campaign support, we shape communication that feels consistent, credible, and memorable.',
    subServices: [
      { title: 'Photography', description: 'Professional photography for events, portraits, and brand visuals.' },
      { title: 'Events', description: 'Comprehensive event coverage and documentation.' },
      { title: 'Photo Tourism', description: 'Location-based photography experiences.' },
      { title: 'Portraits', description: 'Professional portrait sessions for individuals and teams.' },
      { title: 'Visuals', description: 'Creative visual content for marketing and branding.' },
    ],
  },
  {
    slug: 'project-management',
    title: 'Project Management',
    description: 'Clear project structure that keeps stakeholders aligned and delivery on track.',
    details:
      'We bring planning discipline, execution visibility, and reporting clarity to complex initiatives.',
  },
];

export default function Services() {
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
                Our Services
              </p>
              <h1 className="text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
                Expert support for teams ready to
                <span className="text-[#FF6B35]"> move with purpose.</span>
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-white/70 sm:text-xl">
                Every service now shares the same visual language as the homepage: bold contrast,
                warm accents, and a focused, premium feel.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service, index) => (
                <motion.article
                  key={service.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 transition-all duration-300 hover:border-[#FF6B35]/50"
                >
                  <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-[#FF6B35]">
                    Service 0{index + 1}
                  </p>
                  <h2 className="mb-4 text-3xl font-bold">{service.title}</h2>
                  <p className="mb-4 text-white/70">{service.description}</p>
                  <p className="text-sm leading-relaxed text-white/55">{service.details}</p>
                  
                  {service.subServices && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/50">Includes:</p>
                      <ul className="space-y-2">
                        {service.subServices.map((sub) => (
                          <li key={sub.title} className="text-sm text-white/70 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
                            {sub.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <Link
                    href={`/services/${service.slug}`}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#FF6B35] hover:underline"
                  >
                    Explore service <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f] px-6 py-24 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3"
          >
            {[
              ['Discovery', 'We align on business context, constraints, timelines, and expected outcomes.'],
              ['Execution', 'We deliver with visible progress, structured communication, and steady momentum.'],
              ['Growth', 'We leave teams with clearer systems, stronger positioning, and reusable foundations.'],
            ].map(([title, copy]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/5 p-8"
              >
                <h3 className="mb-3 text-2xl font-bold">{title}</h3>
                <p className="leading-relaxed text-white/65">{copy}</p>
              </div>
            ))}
          </motion.div>
        </section>

        <section className="px-6 pb-24 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-gradient-to-br from-[#001F3F] to-[#0a0a0a] p-10 text-center lg:p-14"
          >
            <h2 className="text-4xl font-bold sm:text-5xl">Need a tailored strategy instead of a generic package?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">
              We can shape a custom engagement around your goals, internal capacity, and timeline.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-8 py-4 font-medium text-white transition-colors hover:bg-[#FF9F66]"
            >
              Book a Consultation
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}