'use client';

import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  return (
    <>
      
        <section className="relative overflow-hidden">
          <div className="relative mx-auto flex min-h-[40vh] max-w-7xl items-center px-6 py-16 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-4xl"
            >
              <p className="tp-label mb-4 text-brand-600">
                Legal
              </p>
              <h1 className="text-display text-ink">
                Privacy<span className="text-brand-500"> Policy</span>
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-ink-muted sm:text-xl">
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
              <div className="rounded-card border border-line bg-surface p-8 md:p-12">
                <p className="text-ink-muted text-sm mb-8">Last updated: April 2025</p>

                <h2 className="text-headline text-ink mt-10 mb-4 text-brand-500">1. Information We Collect</h2>
                <p className="text-ink-muted leading-relaxed mb-6">
                  We collect information you provide directly to us, including when you fill out a contact form, subscribe to our newsletter, or communicate with us through the website.
                </p>

                <h2 className="text-headline text-ink mt-10 mb-4 text-brand-500">2. How We Use Your Information</h2>
                <p className="text-ink-muted leading-relaxed mb-6">
                  We use the information we collect to provide, maintain, and improve our services; to communicate with you about our services; and to comply with legal obligations.
                </p>

                <h2 className="text-headline text-ink mt-10 mb-4 text-brand-500">3. Information Sharing</h2>
                <p className="text-ink-muted leading-relaxed mb-6">
                  We do not sell, trade, or otherwise transfer your personal information to outside parties. We may share information with service providers who assist us in operating our website.
                </p>

                <h2 className="text-headline text-ink mt-10 mb-4 text-brand-500">4. Data Security</h2>
                <p className="text-ink-muted leading-relaxed mb-6">
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>

                <h2 className="text-headline text-ink mt-10 mb-4 text-brand-500">5. Your Rights</h2>
                <p className="text-ink-muted leading-relaxed mb-6">
                  You have the right to access, correct, or delete your personal information. Contact us at hello@thepolityservices.com to exercise these rights.
                </p>

                <h2 className="text-headline text-ink mt-10 mb-4 text-brand-500">6. Changes to This Policy</h2>
                <p className="text-ink-muted leading-relaxed mb-6">
                  We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
                </p>

                <h2 className="text-headline text-ink mt-10 mb-4 text-brand-500">7. Contact Us</h2>
                <p className="text-ink-muted leading-relaxed mb-6">
                  If you have any questions about this privacy policy, please contact us at hello@thepolityservices.com.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      
    </>
  );
}