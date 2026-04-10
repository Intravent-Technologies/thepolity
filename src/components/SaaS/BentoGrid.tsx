'use client';

import { motion, type Variants } from 'framer-motion';
import { Zap, BarChart3, Lock, Rocket, Users, Sparkles } from 'lucide-react';

interface BentoItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  span?: string;
  color: string;
}

const bentoItems: BentoItem[] = [
  {
    id: 'lightning',
    icon: <Zap className="w-12 h-12" />,
    title: 'Lightning Fast',
    description: 'Experience sub-millisecond response times with our optimized infrastructure.',
    gradient: 'from-yellow-400 to-orange-500',
    span: 'col-span-1 row-span-1',
    color: 'bg-yellow-50 dark:bg-yellow-950/20',
  },
  {
    id: 'analytics',
    icon: <BarChart3 className="w-12 h-12" />,
    title: 'Advanced Analytics',
    description: 'Get deep insights with real-time analytics and customizable dashboards.',
    gradient: 'from-[#001F3F] to-[#FF6B35]',
    span: 'col-span-1 row-span-2',
    color: 'bg-[#001F3F]/5 dark:bg-[#001F3F]/10',
  },
  {
    id: 'security',
    icon: <Lock className="w-12 h-12" />,
    title: 'Enterprise Security',
    description: 'Military-grade encryption and compliance with all major standards.',
    gradient: 'from-[#001F3F]/80 to-[#FF6B35]/80',
    span: 'col-span-1 row-span-1',
    color: 'bg-green-50 dark:bg-green-950/20',
  },
  {
    id: 'powered',
    icon: <Rocket className="w-12 h-12" />,
    title: 'Powered by AI',
    description: 'Intelligent automation that learns and adapts to your workflow.',
    gradient: 'from-[#001F3F] to-[#FF6B35]',
    span: 'col-span-2 row-span-1',
    color: 'bg-[#001F3F]/5 dark:bg-[#001F3F]/10',
  },
  {
    id: 'collaboration',
    icon: <Users className="w-12 h-12" />,
    title: 'Seamless Collaboration',
    description: 'Work together in real-time with powerful collaboration tools.',
    gradient: 'from-[#001F3F]/80 to-[#FF6B35]/80',
    span: 'col-span-1 row-span-1',
    color: 'bg-red-50 dark:bg-red-950/20',
  },
  {
    id: 'integration',
    icon: <Sparkles className="w-12 h-12" />,
    title: 'Smart Integrations',
    description: 'Connect with 500+ apps and services seamlessly.',
    gradient: 'from-[#001F3F]/80 to-[#FF6B35]/80',
    span: 'col-span-1 row-span-1',
    color: 'bg-[#001F3F]/5 dark:bg-[#001F3F]/10',
  },
];

export default function BentoGrid() {
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section className="w-full px-6 sm:px-8 lg:px-12 py-20 lg:py-32 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            Packed with Powerful Features
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Everything you need to succeed, all in one modern platform.
          </p>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-max"
        >
          {bentoItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className={`${item.span} ${item.color} rounded-2xl border border-slate-200 dark:border-slate-700 p-8 relative overflow-hidden group`}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

              {/* Animated border on hover */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-slate-300 dark:group-hover:border-slate-600 transition-all duration-500"
                initial={false}
                whileHover={{
                  boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
                }}
              />

              <div className="relative z-10">
                {/* Icon */}
                <motion.div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white mb-6 group-hover:shadow-lg transition-shadow duration-300`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.icon}
                </motion.div>

                {/* Content */}
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Hover shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
