'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="w-full px-6 sm:px-8 lg:px-12 py-20 lg:py-32 bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#001F3F]/30 to-[#FF6B35]/30 rounded-full mix-blend-multiply filter blur-3xl"
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-[#001F3F]/10 to-[#FF6B35]/10 dark:from-[#001F3F]/20 dark:to-[#FF6B35]/20 border border-[#FF6B35]/30 dark:border-[#FF6B35]/30"
          >
            <span className="text-sm font-medium text-[#001F3F] dark:text-[#FF6B35] flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" />
              Ready to transform your business?
            </span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            Join thousands of happy customers
          </h2>

          <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
            Start your free trial today and experience the difference. No credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-[#001F3F] to-[#FF6B35] text-white font-semibold flex items-center gap-2 hover:shadow-2xl hover:shadow-[#FF6B35]/50 transition-all duration-300"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
            >
              Schedule Demo
            </motion.button>
          </div>

          {/* Floating testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 max-w-2xl mx-auto"
          >
            <div className="flex gap-4">
              <div className="text-3xl">💬</div>
              <div className="text-left">
                <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                  "This platform has completely transformed how we work. The ease of use combined with powerful features makes it an absolute game-changer for our team."
                </p>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Sarah Johnson</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">CEO at TechStartup Co.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
