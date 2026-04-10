'use client';

import { motion } from 'framer-motion';

interface Feature {
  number: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    number: '01',
    title: 'Intuitive Dashboard',
    description: 'Get a complete overview of everything at a glance with our beautifully designed dashboard.',
  },
  {
    number: '02',
    title: 'Real-time Collaboration',
    description: 'Work together seamlessly with live updates and intelligent notifications.',
  },
  {
    number: '03',
    title: 'Advanced Automation',
    description: 'Automate repetitive tasks and focus on what matters most to your business.',
  },
  {
    number: '04',
    title: 'Powerful APIs',
    description: 'Build custom integrations with our comprehensive and well-documented API.',
  },
  {
    number: '05',
    title: 'Enterprise Security',
    description: 'Bank-level encryption and compliance with all major security standards.',
  },
  {
    number: '06',
    title: '24/7 Support',
    description: 'Get help when you need it with our dedicated support team available round the clock.',
  },
];

export default function FeaturesSection() {
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="w-full px-6 sm:px-8 lg:px-12 py-20 lg:py-32 bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-[#001F3F]/30 to-[#FF6B35]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A comprehensive platform built for modern teams and enterprises.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              {/* Number badge */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 0.08 }}
                transition={{ delay: index * 0.1 }}
                className="absolute -top-8 -left-8 text-8xl font-bold text-slate-900 dark:text-white opacity-0 group-hover:opacity-15 transition-opacity duration-300"
              >
                {feature.number}
              </motion.div>

              <div className="relative">
                {/* Icon circle */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#001F3F] to-[#FF6B35] flex items-center justify-center mb-6 group-hover:shadow-lg transition-shadow duration-300"
                >
                  <span className="text-2xl">✨</span>
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#001F3F] to-[#FF6B35] origin-left"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
