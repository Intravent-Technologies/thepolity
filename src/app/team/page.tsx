'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/team');
      const data = await response.json();
      setMembers(data.length > 0 ? data : defaultMembers);
    } catch (error) { setMembers(defaultMembers); }
    finally { setLoading(false); }
  };

  const defaultMembers: TeamMember[] = [
    { id: '1', name: 'Sarah Mitchell', role: 'CEO & Founder', bio: 'Leading strategic direction with 15+ years...', image: '' },
    { id: '2', name: 'James Chen', role: 'Head of Technology', bio: 'Driving innovation through technology...', image: '' },
    { id: '3', name: 'Emily Rodriguez', role: 'Creative Director', bio: 'Crafting compelling brand stories...', image: '' },
    { id: '4', name: 'Michael Thompson', role: 'Head of Operations', bio: 'Ensuring seamless project delivery...', image: '' },
    { id: '5', name: 'Lisa Anderson', role: 'Strategy Lead', bio: 'Developing data-driven strategies...', image: '' },
    { id: '6', name: 'David Park', role: 'Head of Media', bio: 'Creating impactful media campaigns...', image: '' },
  ];

  return (
    <>
      <Header />
      <main className="overflow-x-hidden bg-[#0a0a0a] pt-20 text-white">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#001F3F]/30 via-[#0a0a0a] to-[#0a0a0a]" />
          <div className="relative mx-auto flex min-h-[50vh] max-w-7xl items-center px-6 py-20 sm:px-8 lg:px-12">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-4xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#FF6B35]">Our Team</p>
              <h1 className="text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">Meet the<span className="text-[#FF6B35]"> Experts</span></h1>
              <p className="mt-6 max-w-3xl text-lg text-white/70 sm:text-xl">The talented people behind The Polity, dedicated to your success.</p>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            {loading ? <div className="text-center py-20"><p className="text-white/60">Loading team...</p></div> : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {members.map((member, index) => (
                  <motion.div key={member.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="group rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 transition-all duration-300 hover:border-[#FF6B35]/50">
                    <div className="h-40 w-40 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#FF6B35]/30 to-[#001F3F]/30 border border-white/10 flex items-center justify-center">
                      {member.image ? <img src={member.image} alt={member.name} className="w-full h-full rounded-full object-cover" /> : <span className="text-4xl font-bold text-white/40">{member.name[0]}</span>}
                    </div>
                    <h3 className="text-xl font-bold text-center mb-2">{member.name}</h3>
                    <p className="text-[#FF6B35] text-sm text-center mb-4">{member.role}</p>
                    <p className="text-white/60 text-sm text-center leading-relaxed">{member.bio}</p>
                    <div className="flex justify-center gap-4 mt-6">
                      <Link href="mailto:hello@thepolityservices.com" className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-[#FF6B35] hover:border-[#FF6B35] hover:text-white transition-all"><Mail className="w-5 h-5" /></Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="px-6 pb-24 sm:px-8 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-gradient-to-br from-[#001F3F] to-[#0a0a0a] p-10 text-center lg:p-14">
            <h2 className="text-4xl font-bold sm:text-5xl">Join Our Team</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">We&apos;re always looking for talented individuals to join our mission.</p>
            <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-8 py-4 font-medium text-white transition-colors hover:bg-[#FF9F66]">Get in Touch <ArrowRight className="w-5 h-5" /></Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}