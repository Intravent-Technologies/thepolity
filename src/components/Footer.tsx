'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Contact Us', href: '/contact' },
  { name: 'Reviews', href: '/reviews' },
];

const discoverLinks = [
  { name: 'Work', href: '/work' },
  { name: 'Blog', href: '/blog' },
  { name: 'Pricing Plans', href: '/pricing' },
  { name: 'Team', href: '/team' },
  { name: 'FAQ', href: '/faqs' },
];

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        {/* Email CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Link
            href="mailto:hello@thepolityservices.com"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white hover:text-[#FF6B35] transition-colors"
          >
            hello@thepolityservices.com
          </Link>
        </motion.div>

        {/* Main footer content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {/* Brand column */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-bold">
                <span className="text-white">THE</span>
                <span className="text-[#FF6B35]"> POLITY</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Innovative strategies powered by technology and media expertise, delivering measurable results and sustainable growth for your organization.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B35] text-white rounded-full text-sm font-medium hover:bg-[#FF9F66] transition-colors"
            >
              Free consultation
            </Link>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Discover More */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold mb-6">Discover More</h3>
            <ul className="space-y-4">
              {discoverLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Follow Us */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold mb-6">Follow us</h3>
            <div className="flex gap-4">
              {['LinkedIn', 'Twitter', 'Instagram'].map((social) => (
                <Link
                  key={social}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-[#FF6B35] hover:border-[#FF6B35] hover:text-white transition-all text-xs font-medium"
                >
                  {social[0]}
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              © 2025 — All rights reserved | Powered by{' '}
              <Link href="/" className="text-[#FF6B35] hover:underline">
                KIPS Media.
              </Link>
            </p>
            <p className="text-white/40 text-sm">
              Crafted by{' '}
              <Link href="/" className="text-[#FF6B35] hover:underline">
                INTRAVENT
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
