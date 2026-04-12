'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface WorkProject {
  id: string;
  title: string;
  category: string;
  client: string;
  description: string;
  image: string;
}

export default function Work() {
  const [projects, setProjects] = useState<WorkProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/work');
      const data = await response.json();
      setProjects(data.length > 0 ? data : defaultProjects);
    } catch (error) { setProjects(defaultProjects); }
    finally { setLoading(false); }
  };

  const defaultProjects: WorkProject[] = [
    { id: '1', title: 'BrightVision Website Redesign', category: 'Web Development', client: 'BrightVision', description: 'Complete website overhaul...', image: '' },
    { id: '2', title: 'TechFlow Brand Strategy', category: 'Branding', client: 'TechFlow', description: 'Strategic brand positioning...', image: '' },
    { id: '3', title: 'Innovate Labs IT Infrastructure', category: 'IT Consultancy', client: 'Innovate Labs', description: 'Cloud migration...', image: '' },
    { id: '4', title: 'Essence Co. Media Campaign', category: 'Media', client: 'Essence Co.', description: 'Multi-channel marketing...', image: '' },
    { id: '5', title: 'ScaleUp Operations Management', category: 'Project Management', client: 'ScaleUp Inc.', description: 'End-to-end project delivery...', image: '' },
    { id: '6', title: 'Horizon Ventures Digital Transformation', category: 'Strategy', client: 'Horizon Ventures', description: 'Comprehensive digital strategy...', image: '' },
  ];

  return (
    <>
      <Header />
      <main className="overflow-x-hidden bg-[#0a0a0a] pt-20 text-white">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#001F3F]/30 via-[#0a0a0a] to-[#0a0a0a]" />
          <div className="relative mx-auto flex min-h-[50vh] max-w-7xl items-center px-6 py-20 sm:px-8 lg:px-12">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-4xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#FF6B35]">Our Work</p>
              <h1 className="text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">Projects<span className="text-[#FF6B35]"> Delivered</span></h1>
              <p className="mt-6 max-w-3xl text-lg text-white/70 sm:text-xl">A showcase of our work helping businesses transform and grow.</p>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            {loading ? <div className="text-center py-20"><p className="text-white/60">Loading projects...</p></div> : (
              <div className="grid gap-8 md:grid-cols-2">
                {projects.map((project, index) => (
                  <motion.article key={project.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="group cursor-pointer">
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="h-64 w-full object-cover rounded-2xl mb-6 border border-white/10 group-hover:border-[#FF6B35]/50 transition-colors" />
                    ) : (
                      <div className="h-64 bg-gradient-to-br from-[#001F3F]/30 to-[#FF6B35]/10 rounded-2xl mb-6 border border-white/10 group-hover:border-[#FF6B35]/50 transition-colors" />
                    )}
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-[#FF6B35] text-sm font-medium">{project.category}</span>
                      <span className="text-white/40 text-sm">| {project.client}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-[#FF6B35] transition-colors">{project.title}</h3>
                    <p className="text-white/60 text-sm mb-4">{project.description}</p>
                    <Link href="#" className="inline-flex items-center gap-2 text-[#FF6B35] text-sm font-medium group-hover:gap-3 transition-all">View Case Study <ArrowRight className="w-4 h-4" /></Link>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="px-6 pb-24 sm:px-8 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-gradient-to-br from-[#001F3F] to-[#0a0a0a] p-10 text-center lg:p-14">
            <h2 className="text-4xl font-bold sm:text-5xl">Let&apos;s Create Something Great</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">Ready to start your next project? Let&apos;s discuss how we can help.</p>
            <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-8 py-4 font-medium text-white transition-colors hover:bg-[#FF9F66]">Start a Project <ArrowRight className="w-5 h-5" /></Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}