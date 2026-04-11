'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Terms() {
  return (
    <>
      <Header />
      <main className="overflow-x-hidden bg-white pt-20 text-gray-900">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#001F3F]/10 via-white to-white" />
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
              <h1 className="text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl text-gray-900">
                Terms<span className="text-[#FF6B35]"> &amp; Conditions</span>
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-gray-600 sm:text-xl">
                The terms governing your use of this website.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-16 sm:px-8 lg:px-12 bg-gray-50">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="rounded-3xl border border-gray-200 bg-white p-8 md:p-12">
                <p className="text-gray-500 text-sm mb-8">Last updated: April 2025</p>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900">1. Acceptance of Terms</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
                </p>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900">2. Intellectual Property</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  This website and its original content, features, and functionality are owned by The Polity and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900">3. User Conduct</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  You agree not to use the website in any way that is unlawful, harms the website or its users, or breaches these terms. You may not attempt to gain unauthorized access to any portion of the website.
                </p>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900">4. Limitation of Liability</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  The Polity shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the website.
                </p>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900">5. Disclaimer</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  The website is provided "as is" without any representations or warranties, express or implied. The Polity makes no representations or warranties in relation to the website.
                </p>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900">6. Governing Law</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  These terms and conditions are governed by and construed in accordance with applicable laws, and you irrevocably submit to the jurisdiction of the courts in that location.
                </p>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900">7. Changes to Terms</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  We reserve the right to modify these terms at any time. Your continued use of the website following any changes indicates your acceptance of the new terms.
                </p>

                <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900">8. Contact Us</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  If you have any questions about these terms, please contact us at hello@thepolityservices.com.
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