'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Camera, Calendar, Map, User, Image } from 'lucide-react';

const services = [
  {
    slug: 'it-consultancy',
    title: 'IT Consultancy',
    description: 'Technology direction, systems planning, and practical solutions that remove friction.',
    details: 'We help teams choose the right tools, modernize workflows, and make smarter technical decisions with confidence.',
  },
  {
    slug: 'media',
    title: 'Media',
    description: 'Professional photography, events coverage, and visual storytelling.',
    details: 'From photoshoots to events, we capture moments that tell your story.',
    hasSubMenu: true,
    subServices: [
      { slug: 'photography', title: 'Photography', icon: Camera },
      { slug: 'events', title: 'Events', icon: Calendar },
      { slug: 'photo-tourism', title: 'Photo Tourism', icon: Map },
      { slug: 'portraits', title: 'Portraits', icon: User },
      { slug: 'visuals', title: 'Visuals', icon: Image },
    ],
  },
  {
    slug: 'project-management',
    title: 'Project Management',
    description: 'Clear project structure that keeps stakeholders aligned and delivery on track.',
    details: 'We bring planning discipline, execution visibility, and reporting clarity to complex initiatives.',
  },
];

export default function Services() {
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
              <p className="tp-label mb-4 text-brand-600">
                Our Services
              </p>
              <h1 className="text-display text-ink">
                Expert support for
                <span className="text-brand-500"> your business.</span>
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-ink-muted sm:text-xl">
                IT Consultancy, Media services, and Project Management tailored to your needs.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 md:grid-cols-3">
              {services.map((service, index) => (
                <motion.article
                  key={service.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group rounded-card border border-line bg-surface p-8 transition-[border-color] duration-200 hover:border-brand-500/40"
                >
                  <p className="tp-label mb-5 text-brand-600">
                    Service 0{index + 1}
                  </p>
                  <h2 className="text-headline text-ink mb-4">{service.title}</h2>
                  <p className="mb-4 text-ink-muted">{service.description}</p>
                  <p className="text-sm leading-relaxed text-ink-muted">{service.details}</p>
                  
                  {service.hasSubMenu && (
                    <div className="mt-4 space-y-2">
                      {service.subServices?.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/services/media/${sub.slug}`}
                          className="flex items-center gap-2 text-sm text-ink-muted hover:text-[color:var(--color-ink)] transition-colors"
                        >
                          <sub.icon className="w-4 h-4" />
                          {sub.title}
                        </Link>
                      ))}
                    </div>
                  )}
                  
                  <Link
                    href={`/services/${service.slug}`}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-brand-500 hover:underline"
                  >
                    Explore service <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface px-6 py-24 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3"
          >
            {[
              ['Discovery', 'We align on business context, constraints, timelines, and expected outcomes.'],
              ['Execution', 'We deliver with visible progress, structured communication, and steady momentum.'],
              ['Delivery', 'We leave teams with clearer systems, stronger positioning, and reusable foundations.'],
            ].map(([title, copy]) => (
              <div
                key={title}
                className="rounded-card border border-line bg-surface p-8"
              >
                <h3 className="mb-3 text-2xl font-bold">{title}</h3>
                <p className="leading-relaxed text-ink-muted">{copy}</p>
              </div>
            ))}
          </motion.div>
        </section>

        <section className="px-6 pb-24 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-5xl rounded-card border border-line bg-surface p-10 text-center lg:p-14"
          >
            <h2 className="text-headline text-ink">Ready to get started?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-muted">
              Contact us today for a free consultation.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-500)] px-8 py-4 font-medium text-white transition-colors hover:bg-[color:var(--color-brand-400)]"
            >
              Book a Consultation
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </section>
      
    </>
  );
}