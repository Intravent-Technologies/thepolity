'use client';

import { motion, type Variants } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  icon?: string;
}

const plans: PricingPlan[] = [
  {
    name: 'Starter',
    price: '$29',
    description: 'Perfect for getting started',
    features: [
      'Up to 5 projects',
      '10GB storage',
      'Basic support',
      'Core features',
      'Email support',
    ],
    cta: 'Get Started',
    icon: '🚀',
  },
  {
    name: 'Professional',
    price: '$99',
    description: 'Best for growing teams',
    features: [
      'Unlimited projects',
      '500GB storage',
      'Priority support',
      'Advanced features',
      'API access',
      'Custom integrations',
      'Analytics dashboard',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
    icon: '⭐',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: [
      'Everything in Pro',
      'Unlimited storage',
      '24/7 dedicated support',
      'Custom development',
      'SLA guarantee',
      'Advanced security',
      'On-premise option',
    ],
    cta: 'Contact Sales',
    icon: '👑',
  },
];

export default function PricingSection() {
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
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
    <section className="w-full px-6 sm:px-8 lg:px-12 py-20 lg:py-32 bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900">
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
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Always flexible to scale.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={plan.highlighted ? { y: -8 } : { y: -4 }}
              className={`relative rounded-2xl p-8 sm:p-10 transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-[#001F3F]/90 to-[#FF6B35]/90 ring-2 ring-white dark:ring-slate-700 shadow-2xl scale-105 md:scale-110'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-xl'
              }`}
            >
              {/* Featured badge */}
              {plan.highlighted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                >
                  <span className="bg-white dark:bg-slate-900 text-[#FF6B35] dark:text-[#FF6B35] px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </motion.div>
              )}

              {/* Icon */}
              <div className="text-4xl mb-4">{plan.icon}</div>

              {/* Plan name */}
              <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                {plan.name}
              </h3>

              {/* Description */}
              <p className={`text-sm mb-6 ${plan.highlighted ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-8">
                <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                  {plan.price}
                </span>
                {plan.price !== 'Custom' && (
                  <span className={`text-sm ml-2 ${plan.highlighted ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                    /month
                  </span>
                )}
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-3 px-6 rounded-lg font-semibold mb-8 flex items-center justify-center gap-2 transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-white text-[#001F3F] hover:bg-slate-100'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              {/* Features list */}
              <div className="space-y-4">
                {plan.features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <Check className={`w-5 h-5 flex-shrink-0 ${plan.highlighted ? 'text-white' : 'text-green-500'}`} />
                    <span className={`text-sm ${plan.highlighted ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
