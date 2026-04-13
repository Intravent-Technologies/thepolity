'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
                About The Polity
              </p>
              <h1 className="text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
                Our story is built on
                <span className="text-[#FF6B35]"> strategy, trust, and execution.</span>
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-white/70 sm:text-xl">
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
                className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/6 to-white/[0.02] p-8 lg:p-10"
              >
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#FF6B35]">
                  {item.eyebrow}
                </p>
                <h2 className="mb-5 text-3xl font-bold leading-tight sm:text-4xl">{item.title}</h2>
                <p className="text-lg leading-relaxed text-white/70">{item.body}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f] px-6 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-14 max-w-3xl"
            >
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#FF6B35]">
                Core Values
              </p>
              <h2 className="text-4xl font-bold sm:text-5xl">What guides our work</h2>
              <p className="mt-4 text-lg text-white/70">
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
                  className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8"
                >
                  <p className="mb-4 text-sm font-semibold text-[#FF6B35]">0{index + 1}</p>
                  <h3 className="mb-3 text-2xl font-bold">{value.title}</h3>
                  <p className="leading-relaxed text-white/65">{value.description}</p>
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
            className="mx-auto grid max-w-6xl gap-10 rounded-3xl border border-white/10 bg-gradient-to-br from-[#001F3F]/45 to-[#0a0a0a] p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-12"
          >
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#FF6B35]">
                Leadership
              </p>
              <h2 className="text-4xl font-bold sm:text-5xl">Guided by visionary leadership</h2>
              <p className="mt-6 text-lg leading-relaxed text-white/70">
                Our CEO brings over 15 years of experience in technology, digital media, and project management.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-white/70">
                With a Master's degree in Project Management from the University of Wolverhampton, Temidayo leads THE POLITY with a focus on digital transformation and creative excellence.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#FF6B35]">
                Temidayo Ololade Awotula
              </p>
              <h3 className="mt-3 text-3xl font-bold">Chief Executive Officer & Founder</h3>
              <p className="mt-5 leading-relaxed text-white/70">
                An accomplished IT and Media professional with over 15 years of experience in technology, digital media, and project management.
              </p>
              <div className="mt-8 space-y-4 border-t border-white/10 pt-6 text-sm text-white/65">
                <p>
                  <span className="font-semibold text-white">Education:</span> Master's in Project Management, University of Wolverhampton
                </p>
                <p>
                  <span className="font-semibold text-white">Origin:</span> Igbolomi, Ilaje Local Government Area, Ondo State, Nigeria
                </p>
                <p>
                  <span className="font-semibold text-white">Passion:</span> Travel and photography
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
            className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-[#FF6B35]/10 p-10 text-center lg:p-14"
          >
            <h2 className="text-4xl font-bold sm:text-5xl">Ready to build with a sharper strategy?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">
              We bring the same clarity, pacing, and visual identity from the homepage into every part
              of the experience, and we bring that same consistency to client work too.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center rounded-full bg-[#FF6B35] px-8 py-4 font-medium text-white transition-colors hover:bg-[#FF9F66]"
            >
              Start a Conversation
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
