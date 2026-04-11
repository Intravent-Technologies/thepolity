'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <main className="overflow-x-hidden bg-[#0a0a0a] pt-20 text-white">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#001F3F]/30 via-[#0a0a0a] to-[#0a0a0a]" />
          <div className="relative mx-auto flex min-h-[40vh] max-w-7xl items-center px-6 py-16 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-4xl"
            >
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#FF6B35]">
                Legal
              </p>
              <h1 className="text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
                Privacy<span className="text-[#FF6B35]"> Policy</span>
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-white/70 sm:text-xl">
                How we collect, use, and protect your information.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
                <p className="text-white/60 text-sm mb-8">Last updated: April 2025</p>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-[#FF6B35]">1. Information We Collect</h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  We collect information you provide directly to us, including when you fill out a contact form, subscribe to our newsletter, or communicate with us through the website.
                </p>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-[#FF6B35]">2. How We Use Your Information</h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  We use the information we collect to provide, maintain, and improve our services; to communicate with you about our services; and to comply with legal obligations.
                </p>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-[#FF6B35]">3. Information Sharing</h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  We do not sell, trade, or otherwise transfer your personal information to outside parties. We may share information with service providers who assist us in operating our website.
                </p>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-[#FF6B35]">4. Data Security</h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-[#FF6B35]">5. Your Rights</h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  You have the right to access, correct, or delete your personal information. Contact us at hello@thepolityservices.com to exercise these rights.
                </p>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-[#FF6B35]">6. Changes to This Policy</h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                </p>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-[#FF6B35]">7. Contact Us</h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  If you have any questions about this privacy policy, please contact us at hello@thepolityservices.com.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}