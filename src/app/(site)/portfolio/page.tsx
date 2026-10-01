'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  createdAt: string;
}

const SERVICE_CATEGORIES = ['All', 'IT Consultancy', 'Media', 'Project Management'];

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const response = await fetch('/api/portfolio', { cache: 'no-store' });
        const data = await response.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load portfolio:', error);
      } finally {
        setLoading(false);
      }
    }

    void loadPortfolio();
  }, []);

  const filteredItems = filter === 'All' 
    ? items 
    : items.filter(item => item.category === filter);

  const categories = SERVICE_CATEGORIES;

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
                Portfolio
              </p>
              <h1 className="text-display text-ink">
                Our work speaks for 
                <span className="text-brand-500"> itself.</span>
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-ink-muted sm:text-xl">
                Browse our portfolio by service category to see how we&apos;ve helped businesses transform their digital presence and achieve measurable results.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            {/* Filter */}
            <div className="flex flex-wrap gap-3 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === cat
                      ? 'bg-[color:var(--color-brand-500)] text-white'
                      : 'border border-line-strong text-ink-muted hover:text-[color:var(--color-ink)] hover:border-ink-subtle'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <p className="text-ink-muted">Loading portfolio...</p>
            ) : filteredItems.length === 0 ? (
              <div className="rounded-card border border-line bg-surface p-10 text-center">
                <h2 className="text-headline text-ink">No projects in this category yet</h2>
                <p className="mt-4 text-ink-muted">
                  We&apos;re constantly adding new work. Check back soon or contact us to discuss your project.
                </p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {filteredItems.map((item, index) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="overflow-hidden rounded-card border border-line bg-surface"
                  >
                    <div className="relative h-64 bg-ink">
                      <Image src={item.image} alt={item.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                    </div>
                    <div className="p-8">
                      <p className="mb-3 text-sm font-semibold text-brand-500">{item.category}</p>
                      <h2 className="text-headline text-ink mb-4">{item.title}</h2>
                      <p className="leading-relaxed text-ink-muted">{item.description || 'Delivering exceptional results through strategic planning and execution.'}</p>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="px-6 pb-24 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-5xl rounded-card border border-line bg-surface p-10 text-center lg:p-14"
          >
            <h2 className="text-headline text-ink">Ready for your own success story?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-muted">
              We can help you shape the next case study with a plan that fits your team and your market.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-500)] px-8 py-4 font-medium text-white transition-colors hover:bg-[color:var(--color-brand-400)]"
            >
              Start Your Project
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </section>
      
    </>
  );
}
