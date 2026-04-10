'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function SaaSHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Our Services', href: '/services' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50"
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center"
        >
          <Link href="/" className="flex items-center">
            <svg 
              viewBox="0 0 240 80" 
              className="h-12 w-auto"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* TP Symbol */}
              <g>
                {/* Navy T */}
                <polygon points="20,15 20,65 30,65 30,40 40,40 40,30 30,30 30,15" fill="#001F3F"/>
                {/* Orange P */}
                <path d="M 50,15 L 50,65 L 60,65 L 60,40 L 70,40 C 75,40 80,35 80,30 C 80,20 75,15 65,15 Z M 60,25 L 65,25 C 70,25 70,30 70,30 C 70,35 65,35 60,35 Z" fill="#FF6B35"/>
              </g>
              {/* Text */}
              <text x="95" y="50" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#001F3F">
                THE POLITY
              </text>
              <text x="95" y="65" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="600" fill="#FF6B35" letterSpacing="2">
                SERVICES LIMITED
              </text>
            </svg>
          </Link>
        </motion.div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <motion.div key={item.label} whileHover={{ y: -2 }}>
              <Link
                href={item.href}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300 font-medium"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#001F3F] to-[#FF6B35] text-white font-medium hover:shadow-lg transition-all duration-300"
            >
              Free Consultation
            </motion.button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-300"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.button>
        </div>
      </nav>

      {/* Mobile menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}      
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden border-t border-slate-200/50 dark:border-slate-800/50"
      >
        <div className="px-6 py-4 space-y-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300 font-medium"        
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-6 py-2 rounded-lg bg-gradient-to-r from-[#001F3F] to-[#FF6B35] text-white font-medium hover:shadow-lg transition-all duration-300"
            >
              Free Consultation
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </motion.header>
  );
}
