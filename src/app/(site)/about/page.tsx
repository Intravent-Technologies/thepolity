'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const values = [
  {
    title: 'Excellence',
    description:
      'We hold every strategy, delivery plan, and client partnership to a high execution standard.',
  },
  {
    title: 'Innovation',
    description:
      'We use fresh thinking and modern tools to solve business problems with clarity and speed.',
  },
  {
    title: 'Partnership',
    description:
      'We work closely with clients, align on outcomes, and stay accountable from kickoff to results.',
  },
  {
    title: 'Integrity',
    description:
      'We communicate honestly, make disciplined decisions, and build trust through consistency.',
  },
  {
    title: 'Results',
    description:
      'We focus on measurable impact, sustainable growth, and decisions that move the business forward.',
  },
  {
    title: 'Learning',
    description:
      'We keep refining our methods so our clients benefit from sharper thinking and better execution.',
  },
];

export default function About() {
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
                About The Polity
              </p>
              <h1 className="text-display text-ink">
                Our story is built on
                <span className="text-brand-500"> strategy, trust, and execution.</span>
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-ink-muted sm:text-xl">
                We help ambitious teams turn complex goals into practical plans, stronger brands, and
                measurable business progress.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
            {[
              {
                eyebrow: 'Our Mission',
                title: 'Drive sustainable growth with modern strategy and disciplined delivery.',
                body:
                  'THE POLITY combines technology, media, and project leadership to help organizations move faster and operate with more confidence.',
              },
              {
                eyebrow: 'Our Vision',
                title: 'Be the trusted partner businesses call when growth needs direction.',
                body:
                  'We aim to bring practical expertise, sharp communication, and high-clarity execution to every transformation journey.',
              },
            ].map((item) => (
              <motion.article
                key={item.eyebrow}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-card border border-line bg-surface p-8 lg:p-10"
              >
                <p className="tp-label mb-4 text-brand-600">
                  {item.eyebrow}
                </p>
                <h2 className="text-headline text-ink mb-5">{item.title}</h2>
                <p className="text-lg leading-relaxed text-ink-muted">{item.body}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="bg-surface px-6 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-14 max-w-3xl"
            >
              <p className="tp-label mb-4 text-brand-600">
                Core Values
              </p>
              <h2 className="text-headline text-ink">What guides our work</h2>
              <p className="mt-4 text-lg text-ink-muted">
                Our approach stays grounded in the same principles whether we are shaping a strategy,
                building momentum, or helping a client navigate change.
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {values.map((value, index) => (
                <motion.article
                  key={value.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-card border border-line bg-surface p-8"
                >
                  <p className="mb-4 text-sm font-semibold text-brand-500">0{index + 1}</p>
                  <h3 className="mb-3 text-2xl font-bold">{value.title}</h3>
                  <p className="leading-relaxed text-ink-muted">{value.description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-24 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto grid max-w-6xl gap-10 rounded-card border border-line bg-surface p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-12"
          >
            <div>
              <p className="tp-label mb-4 text-brand-600">
                Leadership
              </p>
              <h2 className="text-headline text-ink">Guided by visionary leadership</h2>
              <p className="mt-6 text-lg leading-relaxed text-ink-muted">
                Our CEO brings over 15 years of experience in technology, digital media, and project management.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-ink-muted">
                With a Master&apos;s degree in Project Management from the University of Wolverhampton, Temidayo leads THE POLITY with a focus on digital transformation and creative excellence.
              </p>
            </div>

            <div className="rounded-card border border-line bg-surface p-8">
              <p className="tp-label text-brand-600">
                Temidayo Ololade Awotula
              </p>
              <h3 className="mt-3 text-3xl font-bold">Chief Executive Officer & Founder</h3>
              <p className="mt-5 leading-relaxed text-ink-muted">
                An accomplished IT and Media professional with over 15 years of experience in technology, digital media, and project management.
              </p>
              <div className="mt-8 space-y-4 border-t border-line pt-6 text-sm text-ink-muted">
                <p>
                  <span className="font-semibold text-[color:var(--color-ink)]">Education:</span> Master&apos;s in Project Management, University of Wolverhampton
                </p>
                <p>
                  <span className="font-semibold text-[color:var(--color-ink)]">Origin:</span> Igbolomi, Ilaje Local Government Area, Ondo State, Nigeria
                </p>
                <p>
                  <span className="font-semibold text-[color:var(--color-ink)]">Passion:</span> Travel and photography
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="px-6 pb-24 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-5xl rounded-card border border-line bg-surface p-10 text-center lg:p-14"
          >
            <h2 className="text-headline text-ink">Ready to build with a sharper strategy?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-muted">
              We bring the same clarity, pacing, and visual identity from the homepage into every part
              of the experience, and we bring that same consistency to client work too.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center rounded-full bg-[color:var(--color-brand-500)] px-8 py-4 font-medium text-white transition-colors hover:bg-[color:var(--color-brand-400)]"
            >
              Start a Conversation
            </Link>
          </motion.div>
        </section>
      
    </>
  );
}
