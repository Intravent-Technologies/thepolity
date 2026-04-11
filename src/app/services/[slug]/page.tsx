'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, ArrowLeft, CheckCircle2, Clock, Target, Zap, BarChart3, Globe } from 'lucide-react';

const servicesData: Record<string, {
  title: string;
  description: string;
  details: string;
  features: string[];
  icon: React.ElementType;
}> = {
  'it-consultancy': {
    title: 'IT Consultancy',
    description: 'Technology direction, systems planning, and practical solutions that remove friction.',
    details: 'We help teams choose the right tools, modernize workflows, and make smarter technical decisions with confidence.',
    features: [
      'Technology roadmapping and architecture planning',
      'Systems integration and automation',
      'Technical debt assessment and mitigation',
      'Vendor evaluation and management',
      'Cloud migration strategy',
      'Security and compliance frameworks',
    ],
    icon: Zap,
  },
  'media': {
    title: 'Media',
    description: 'Strategic messaging and content systems that strengthen visibility and trust.',
    details: 'From positioning to campaign support, we shape communication that feels consistent, credible, and memorable.',
    features: [
      'Brand messaging and positioning',
      'Content strategy and creation',
      'Campaign development and management',
      'Social media strategy',
      'Media relations and PR',
      'Video and multimedia production',
    ],
    icon: Globe,
  },
  'project-management': {
    title: 'Project Management',
    description: 'Clear project structure that keeps stakeholders aligned and delivery on track.',
    details: 'We bring planning discipline, execution visibility, and reporting clarity to complex initiatives.',
    features: [
      'Project planning and scoping',
      'Stakeholder management and communication',
      'Agile and waterfall methodologies',
      'Risk management and mitigation',
      'Resource allocation and scheduling',
      'Progress reporting and deliverables',
    ],
    icon: Clock,
  },
  'business-strategy': {
    title: 'Business Strategy',
    description: 'Growth planning rooted in market reality, opportunity mapping, and operational fit.',
    details: 'Our strategy work helps businesses set direction, prioritize decisions, and execute with fewer blind spots.',
    features: [
      'Market analysis and opportunity identification',
      'Business model development',
      'Competitive positioning',
      'Growth strategy and scaling',
      'Operational efficiency optimization',
      'Strategic partnerships',
    ],
    icon: Target,
  },
  'data-analytics': {
    title: 'Data Analytics',
    description: 'Insight frameworks that turn information into action and action into measurable wins.',
    details: 'We organize data into decision-ready narratives so leaders can move quickly with stronger evidence.',
    features: [
      'Data strategy and governance',
      'Analytics implementation',
      'Dashboard and reporting design',
      'Predictive analytics',
      'Performance metrics and KPIs',
      'Data-driven decision making',
    ],
    icon: BarChart3,
  },
  'digital-transformation': {
    title: 'Digital Transformation',
    description: 'Modern operating models that improve efficiency, experience, and long-term resilience.',
    details: 'We support digital change across process, tooling, and team adoption so transformation actually sticks.',
    features: [
      'Digital strategy and vision',
      'Process automation and optimization',
      'Tool and platform implementation',
      'Change management and training',
      'Customer experience improvement',
      'Innovation and continuous improvement',
    ],
    icon: Zap,
  },
};

export default function ServiceDetail() {
  const params = useParams();
  const slug = params?.slug as string;
  const service = servicesData[slug];

  if (!service) {
    return (
      <>
        <Header />
        <main className="overflow-x-hidden bg-[#0a0a0a] pt-20 text-white min-h-screen">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <h1 className="text-3xl font-bold">Service Not Found</h1>
            <Link href="/services" className="mt-4 inline-flex items-center gap-2 text-[#FF6B35]">
              <ArrowLeft className="h-4 w-4" /> Back to Services
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const Icon = service.icon;

  return (
    <>
      <Header />
      <main className="overflow-x-hidden bg-[#0a0a0a] pt-20 text-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Link href="/services" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to Services
          </Link>
        </div>

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#001F3F]/30 via-[#0a0a0a] to-[#0a0a0a]" />
          <div className="relative mx-auto flex min-h-[50vh] max-w-7xl items-center px-6 py-16 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-4xl"
            >
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#FF6B35]">
                Service
              </p>
              <div className="flex items-center gap-4 mb-4">
                <Icon className="h-10 w-10 text-[#FF6B35]" />
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">{service.title}</h1>
              </div>
              <p className="mt-4 text-xl text-white/70 max-w-2xl">{service.description}</p>
              <p className="mt-6 text-lg text-white/55 max-w-3xl leading-relaxed">{service.details}</p>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold">What&apos;s Included</h2>
              <p className="mt-3 text-white/60">Comprehensive components designed to deliver results.</p>
            </motion.div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {service.features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-[#FF6B35]" />
                  <span className="text-white/90">{feature}</span>
                </motion.div>
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
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-8">
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
            <h2 className="text-4xl font-bold sm:text-5xl">Ready to get started?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">
              Let&apos;s discuss how we can help with your {service.title.toLowerCase()} needs.
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