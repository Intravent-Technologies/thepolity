'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Code2, MessageCircle, Share2 } from 'lucide-react';

export default function SaaSFooter() {
  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#' },
        { label: 'Pricing', href: '#' },
        { label: 'Security', href: '#' },
        { label: 'Updates', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Contact', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#' },
        { label: 'API Docs', href: '#' },
        { label: 'Help Center', href: '#' },
        { label: 'Community', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
        { label: 'Cookies', href: '#' },
        { label: 'License', href: '#' },
      ],
    },
  ];

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
    <footer className="w-full bg-[#001F3F] dark:bg-[#000814] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        {/* Footer content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12 pb-12 border-b border-slate-700"
        >
          {/* Brand section */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-white to-[#FF6B35] rounded-lg flex items-center justify-center">
                <span className="text-[#001F3F] font-bold text-sm">TP</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                The Polity
              </h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Transform your business through innovative strategies powered by technology and media expertise, delivering measurable results and sustainable growth.
            </p>
            {/* Social links */}
            <div className="flex gap-4">
              {[
                { icon: Code2, label: 'GitHub' },
                { icon: MessageCircle, label: 'Twitter' },
                { icon: Share2, label: 'LinkedIn' },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href="#"
                  whileHover={{ scale: 1.2, y: -2 }}
                  className="w-10 h-10 rounded-lg bg-[#FF6B35]/20 hover:bg-[#FF6B35]/40 flex items-center justify-center transition-colors duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer links */}
          {footerSections.map((section) => (
            <motion.div key={section.title} variants={itemVariants}>
              <h4 className="font-semibold mb-6 text-white">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-[#FF6B35] transition-colors duration-300 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <p className="text-slate-400 text-sm">
            © 2024 The Polity. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <select className="bg-[#003D66] text-white text-sm px-4 py-2 rounded-lg border border-[#FF6B35]/30 hover:border-[#FF6B35] transition-colors duration-300 cursor-pointer">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
