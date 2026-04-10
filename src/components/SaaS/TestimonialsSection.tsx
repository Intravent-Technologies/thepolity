'use client';

import { motion } from 'framer-motion';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  image: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    quote: 'Incredible platform. The UI is so intuitive and the features are exactly what we needed.',
    author: 'Alex Chen',
    role: 'Product Manager',
    company: 'InnovateCo',
    image: '👨‍💼',
    rating: 5,
  },
  {
    quote: 'Best investment we made this year. ROI was visible within the first month.',
    author: 'Maria Garcia',
    role: 'CEO',
    company: 'GrowthLabs',
    image: '👩‍💼',
    rating: 5,
  },
  {
    quote: 'The support team is amazing. They went above and beyond to help us with our setup.',
    author: 'James Wilson',
    role: 'CTO',
    company: 'TechVision',
    image: '👨‍💻',
    rating: 5,
  },
  {
    quote: 'Finally a tool that does everything we need without the complexity.',
    author: 'Sophie Laurent',
    role: 'Operations Lead',
    company: 'StreamlineAI',
    image: '👩‍💻',
    rating: 5,
  },
];

export default function TestimonialsSection() {
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
    <section className="w-full px-6 sm:px-8 lg:px-12 py-20 lg:py-32 bg-slate-50 dark:bg-slate-900">
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
            Loved by Teams Everywhere
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            See what customers are saying about their experience with our platform.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-lg"
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-lg text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="text-5xl">{testimonial.image}</div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-3 gap-8 pt-16 border-t border-slate-200 dark:border-slate-700"
        >
          {[
            { number: '4.9/5', label: 'Average Rating' },
            { number: '98%', label: 'Satisfaction Rate' },
            { number: '500+', label: 'Active Companies' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
