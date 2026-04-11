'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      const data = await response.json();
      setPosts(data.length > 0 ? data : defaultPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts(defaultPosts);
    } finally {
      setLoading(false);
    }
  };

  const defaultPosts: BlogPost[] = [
    { id: '1', title: 'The Future of Digital Strategy in 2025', category: 'Strategy', date: 'April 8, 2025', excerpt: 'Explore the emerging trends...', image: '' },
    { id: '2', title: 'Maximizing ROI with IT Solutions', category: 'Technology', date: 'April 2, 2025', excerpt: 'Learn how strategic IT...', image: '' },
    { id: '3', title: 'Building Brands That Last', category: 'Branding', date: 'March 25, 2025', excerpt: 'Discover the principles...', image: '' },
    { id: '4', title: 'Data-Driven Decision Making', category: 'Analytics', date: 'March 18, 2025', excerpt: 'How to leverage data...', image: '' },
    { id: '5', title: 'The Art of Project Management', category: 'Management', date: 'March 10, 2025', excerpt: 'Best practices for...', image: '' },
    { id: '6', title: 'Media Strategy for Modern Business', category: 'Media', date: 'March 3, 2025', excerpt: 'Crafting effective...', image: '' },
  ];

  return (
    <>
      <Header />
      <main className="overflow-x-hidden bg-[#0a0a0a] pt-20 text-white">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#001F3F]/30 via-[#0a0a0a] to-[#0a0a0a]" />
          <div className="relative mx-auto flex min-h-[50vh] max-w-7xl items-center px-6 py-20 sm:px-8 lg:px-12">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-4xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#FF6B35]">Blog</p>
              <h1 className="text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">Insights &<span className="text-[#FF6B35]"> Ideas</span></h1>
              <p className="mt-6 max-w-3xl text-lg text-white/70 sm:text-xl">Expert perspectives on business strategy, technology, and growth.</p>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            {loading ? <div className="text-center py-20"><p className="text-white/60">Loading posts...</p></div> : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, index) => (
                  <motion.article key={post.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="group cursor-pointer">
                    <div className="h-48 bg-gradient-to-br from-[#001F3F]/30 to-[#FF6B35]/10 rounded-2xl mb-6 border border-white/10 group-hover:border-[#FF6B35]/50 transition-colors" />
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-[#FF6B35] text-sm font-medium">{post.category}</span>
                      <span className="text-white/40 text-sm">{post.date}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-[#FF6B35] transition-colors">{post.title}</h3>
                    <p className="text-white/60 text-sm mb-4">{post.excerpt}</p>
                    <Link href="#" className="inline-flex items-center gap-2 text-[#FF6B35] text-sm font-medium group-hover:gap-3 transition-all">Read More <ArrowRight className="w-4 h-4" /></Link>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="px-6 pb-24 sm:px-8 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-gradient-to-br from-[#001F3F] to-[#0a0a0a] p-10 text-center lg:p-14">
            <h2 className="text-4xl font-bold sm:text-5xl">Stay Ahead of the Curve</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">Subscribe to our newsletter for the latest insights delivered to your inbox.</p>
            <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-8 py-4 font-medium text-white transition-colors hover:bg-[#FF9F66]">Subscribe Now <ArrowRight className="w-5 h-5" /></Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}