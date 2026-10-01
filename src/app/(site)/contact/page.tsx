'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'hello@thepolityservices.com' },
  { icon: Phone, label: 'Phone', value: '+44 7881 168479' },
  { icon: MapPin, label: 'Location', value: '86 Glebe Street, Walsall' },
  { icon: Clock, label: 'Hours', value: 'Mon - Fri: 9 AM - 6 PM GMT' },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
    }, 3000);
  };

  return (
    <>
      
        <section className="relative overflow-hidden">
          <div className="relative mx-auto flex min-h-[55vh] max-w-7xl items-center px-6 py-24 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-4xl"
            >
              <p className="tp-label mb-4 text-brand-600">
                Contact
              </p>
              <h1 className="text-display text-ink">
                Let&apos;s talk about what your
                <span className="text-brand-500"> next move requires.</span>
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-ink-muted sm:text-xl">
                Ready to transform your business? Let&apos;s discuss how we can help you achieve your goals.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-card border border-line bg-surface p-8"
            >
              <h2 className="text-headline text-ink">Reach us directly</h2>
              <p className="mt-4 text-ink-muted">
                If you already know what you need, send us a note and we will follow up quickly.
              </p>

              <div className="mt-10 space-y-6">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex gap-4 rounded-card border border-line bg-surface p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-card bg-[color:var(--color-brand-500)]">
                      <info.icon className="h-5 w-5 text-[color:var(--color-ink)]" />
                    </div>
                    <div>
                      <p className="tp-label text-ink-subtle">
                        {info.label}
                      </p>
                      <p className="mt-1 text-lg text-[color:var(--color-ink)]">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-card border border-line bg-surface p-8"
            >
              <h2 className="text-headline text-ink">Send a message</h2>
              <p className="mt-4 text-ink-muted">
                Tell us about your goals, current challenges, or the support you are looking for.
              </p>

              {submitted && (
                <div className="mt-6 rounded-card border border-[color:var(--color-brand-500)]/30 bg-[color:var(--color-brand-500)]/10 px-5 py-4 text-[color:var(--color-brand-400)]">
                  Thank you. We&apos;ve received your message and will get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Full Name">
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="w-full rounded-card border border-line bg-surface px-5 py-4 text-[color:var(--color-ink)] placeholder:text-ink-subtle focus:border-[color:var(--color-brand-500)] focus:outline-none"
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="w-full rounded-card border border-line bg-surface px-5 py-4 text-[color:var(--color-ink)] placeholder:text-ink-subtle focus:border-[color:var(--color-brand-500)] focus:outline-none"
                    />
                  </Field>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Phone">
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      className="w-full rounded-card border border-line bg-surface px-5 py-4 text-[color:var(--color-ink)] placeholder:text-ink-subtle focus:border-[color:var(--color-brand-500)] focus:outline-none"
                    />
                  </Field>
                  <Field label="Company">
                    <input
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your company"
                      className="w-full rounded-card border border-line bg-surface px-5 py-4 text-[color:var(--color-ink)] placeholder:text-ink-subtle focus:border-[color:var(--color-brand-500)] focus:outline-none"
                    />
                  </Field>
                </div>

                <Field label="Message">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Tell us how we can help..."
                    className="w-full resize-none rounded-card border border-line bg-surface px-5 py-4 text-[color:var(--color-ink)] placeholder:text-ink-subtle focus:border-[color:var(--color-brand-500)] focus:outline-none"
                  />
                </Field>

                <button
                  type="submit"
                  className="inline-flex rounded-full bg-[color:var(--color-brand-500)] px-8 py-4 font-medium text-white transition-colors hover:bg-[color:var(--color-brand-400)]"
                >
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </section>
      
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="tp-label mb-2 block text-ink-muted">
        {label}
      </span>
      {children}
    </label>
  );
}