'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function SaaSComponentShowcase() {
  const [copied, setCopied] = useState<string | null>(null);

  const components = [
    {
      name: 'SaaSHero',
      description: 'Hero section with animated gradient orbs, large headline, and CTA buttons',
      features: ['Animated orbs', 'Gradient text', 'Stats section', 'Staggered animations'],
      file: 'SaaSHero.tsx',
      lines: 450,
    },
    {
      name: 'BentoGrid',
      description: '6-item feature grid with custom layouts and hover animations',
      features: ['Responsive grid', 'Icon animations', 'Gradient on hover', 'Shine effect'],
      file: 'BentoGrid.tsx',
      lines: 280,
    },
    {
      name: 'FeaturesSection',
      description: 'Detailed features with numbered cards (01-06) and hover effects',
      features: ['Numbered cards', 'Icon badges', 'Underline animation', 'Background orbs'],
      file: 'FeaturesSection.tsx',
      lines: 320,
    },
    {
      name: 'TestimonialsSection',
      description: '4 customer testimonials with 5-star ratings and company info',
      features: ['Star ratings', 'Emoji avatars', 'Company details', 'Stats row'],
      file: 'TestimonialsSection.tsx',
      lines: 280,
    },
    {
      name: 'PricingSection',
      description: '3-tier pricing cards with featured "Most Popular" plan',
      features: ['3 pricing tiers', 'Featured plan', 'Feature lists', 'Checkmarks'],
      file: 'PricingSection.tsx',
      lines: 350,
    },
    {
      name: 'CTASection',
      description: 'Call-to-action section with floating testimonial and animated orbs',
      features: ['Large headline', 'Floating card', 'Dual CTAs', 'Animated background'],
      file: 'CTASection.tsx',
      lines: 180,
    },
    {
      name: 'SaaSHeader',
      description: 'Fixed navigation header with mobile menu and responsive design',
      features: ['Fixed position', 'Mobile menu', 'Blur backdrop', 'Sign In/Get Started'],
      file: 'SaaSHeader.tsx',
      lines: 200,
    },
    {
      name: 'SaaSFooter',
      description: '4-column footer with social links and language selector',
      features: ['4 columns', 'Social icons', 'Brand section', 'Language selector'],
      file: 'SaaSFooter.tsx',
      lines: 250,
    },
  ];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            SaaS Template Components
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Modern, premium UI components with Framer Motion animations
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 p-8 rounded-2xl bg-gradient-to-r from-[#001F3F]/10 to-[#FF6B35]/10 border border-[#FF6B35]/20 dark:border-[#FF6B35]/30"
        >
          <div className="flex items-center justify-between flex-col md:flex-row gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                View the Live Template
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                See all components in action on the full landing page
              </p>
            </div>
            <Link href="/saas-template">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#001F3F] to-[#FF6B35] text-white font-semibold flex items-center gap-2 hover:shadow-lg transition-all duration-300 whitespace-nowrap"
              >
                View Full Template
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12 p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Technology Stack
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Next.js', value: '16.2.2' },
              { label: 'React', value: '19.2.4' },
              { label: 'Tailwind CSS', value: '4' },
              { label: 'Framer Motion', value: '12.38.0' },
            ].map((tech) => (
              <div key={tech.label}>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  {tech.label}
                </p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {tech.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Components Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {components.map((component, index) => (
            <motion.div
              key={component.name}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {component.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {component.description}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    copyToClipboard(
                      `import ${component.name} from '@/components/SaaS/${component.file}';`,
                      component.name
                    )
                  }
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-300"
                  title="Copy import statement"
                >
                  {copied === component.name ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-slate-500" />
                  )}
                </motion.button>
              </div>

              {/* Features */}
              <div className="mb-6">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3 font-semibold">
                  Key Features
                </p>
                <div className="flex flex-wrap gap-2">
                  {component.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* File info */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400">
                  <span>📄 {component.file}</span>
                  <span>📏 {component.lines} lines</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm font-medium text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-300"
                >
                  View Code
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Design Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            { label: 'Total Components', value: '8' },
            { label: 'Total Lines of Code', value: '2,180+' },
            { label: 'Animation Variants', value: '50+' },
            { label: 'Design System Colors', value: '12' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center"
            >
              <p className="text-3xl font-bold bg-gradient-to-r from-[#001F3F] to-[#FF6B35] bg-clip-text text-transparent mb-2">
                {stat.value}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-700 text-center"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to Build?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
            All components are production-ready, fully customizable, and optimized for performance.
            Check out the documentation to get started.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/saas-template">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#001F3F] to-[#FF6B35] text-white font-semibold hover:shadow-lg transition-all duration-300"
              >
                View Live Demo
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-lg border-2 border-slate-400 dark:border-slate-600 text-slate-900 dark:text-white font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300"
            >
              Read Documentation
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
