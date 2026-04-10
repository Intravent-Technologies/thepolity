'use client';

import { motion, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function SaaSHero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-[#001F3F]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
            delay: 2,
          }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#FF6B35]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center py-20 lg:py-32"
      >
        {/* Badge */}
        <motion.div variants={itemVariants}>
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-[#001F3F]/10 to-[#FF6B35]/10 dark:from-[#001F3F]/20 dark:to-[#FF6B35]/20 border border-[#FF6B35]/30 dark:border-[#FF6B35]/30">
            <span className="text-sm font-medium text-[#001F3F] dark:text-[#FF6B35] flex items-center justify-center gap-2">
              ✨ Introducing the Future of SaaS
            </span>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight"
        >
          The Modern Platform for
          <br />
          <span className="bg-gradient-to-r from-[#001F3F] via-[#FF6B35] to-[#FF9F66] dark:from-[#001F3F] dark:via-[#FF6B35] dark:to-[#FF9F66] bg-clip-text text-transparent">
            Everything You Need
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Experience the next generation of platform design. Built with performance, aesthetics, and user experience at the core.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-[#001F3F] to-[#FF6B35] text-white font-semibold flex items-center gap-2 hover:shadow-2xl transition-shadow duration-300"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-lg border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors duration-300"
          >
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Floating stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-slate-200 dark:border-slate-800"
        >
          {[
            { number: '10M+', label: 'Users' },
            { number: '99.9%', label: 'Uptime' },
            { number: '150+', label: 'Countries' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
