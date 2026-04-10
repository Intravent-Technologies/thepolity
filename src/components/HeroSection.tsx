'use client';

import { motion, type Variants } from 'framer-motion';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  badge?: string;
}

export function HeroSection({ title, subtitle, badge }: HeroSectionProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
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
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center overflow-hidden px-4">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#FF6B35] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#001F3F] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </motion.div>

      <motion.div
        className="relative z-10 text-center max-w-3xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {badge && (
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block px-4 py-2 bg-orange-500/20 border border-orange-500/40 text-orange-300 rounded-full text-sm font-medium">
              {badge}
            </span>
          </motion.div>
        )}

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-orange-300 to-orange-500 bg-clip-text text-transparent mb-6"
        >
          {title}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-300 mb-8"
        >
          {subtitle}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg transition"
          >
            Get Started
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border border-orange-500 text-orange-400 font-semibold rounded-lg hover:bg-orange-500/10 transition"
          >
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
