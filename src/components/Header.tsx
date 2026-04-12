'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Services', href: '/services', hasDropdown: true },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Contact Us', href: '/contact' },
  { name: 'Reviews', href: '/reviews' },
];

const services = [
  { name: 'IT Consultancy', href: '/services/it-consultancy' },
  { name: 'Media', href: '/services/media', hasSubMenu: true },
  { name: 'Project Management', href: '/services/project-management' },
];

const mediaServices = [
  { name: 'Photography', href: '/services/media/photography' },
  { name: 'Events', href: '/services/media/events' },
  { name: 'Photo Tourism', href: '/services/media/photo-tourism' },
  { name: 'Portraits', href: '/services/media/portraits' },
  { name: 'Visuals', href: '/services/media/visuals' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mediaSubMenuOpen, setMediaSubMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-white">THE</span>
                <span className="text-[#FF6B35]"> POLITY</span>
              </span>
            </motion.div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative"
                onMouseEnter={() => link.hasDropdown && setServicesOpen(true)}
                onMouseLeave={() => link.hasDropdown && setServicesOpen(false)}
              >
                <Link
                  href={link.href}
                  className="text-sm font-medium text-white/80 hover:text-white transition-colors duration-200 relative group flex items-center gap-1"
                >
                  {link.name}
                  {link.hasDropdown && <ChevronDown className="w-4 h-4" />}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF6B35] transition-all duration-300 group-hover:w-full" />
                </Link>

                {link.hasDropdown && (
                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-56 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                      >
                        {services.map((service) => (
                          <div
                            key={service.name}
                            className="relative"
                            onMouseEnter={() => service.hasSubMenu && setMediaSubMenuOpen(true)}
                            onMouseLeave={() => service.hasSubMenu && setMediaSubMenuOpen(false)}
                          >
                            <Link
                              href={service.href}
                              className="flex items-center justify-between px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              {service.name}
                              {service.hasSubMenu && <ChevronDown className="w-3 h-3 -rotate-90" />}
                            </Link>
                            
                            {service.hasSubMenu && mediaSubMenuOpen && (
                              <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="absolute top-0 left-full ml-1 w-48 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                              >
                                {mediaServices.map((media) => (
                                  <Link
                                    key={media.name}
                                    href={media.href}
                                    className="block px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                  >
                                    {media.name}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.div>
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:block"
          >
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-2.5 rounded-full bg-[#FF6B35] text-white text-sm font-medium hover:bg-[#FF9F66] transition-colors duration-200"
            >
              Free consultation
            </Link>
          </motion.div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0a0a] border-t border-white/10"
          >
            <nav className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white/80 hover:text-white py-2 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#FF6B35] text-white text-sm font-medium mt-2"
              >
                Free consultation
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}