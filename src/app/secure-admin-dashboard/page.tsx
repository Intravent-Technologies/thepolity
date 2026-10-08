'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Button, Eyebrow } from '@/components/ui';
import Logo from '@/components/Logo';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setError('Invalid password. Please try again.');
        return;
      }

      router.push('/secure-admin-dashboard/dashboard');
      router.refresh();
    } catch {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel: pure atmosphere, hidden on small screens where it would
         just push the form below the fold. */}
      <aside
        className="relative hidden flex-col justify-between overflow-hidden bg-navy-700 p-12 lg:flex"
        aria-hidden="true"
      >
        <div
          className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-brand-500/10 blur-3xl"
        />
        <div
          className="pointer-events-none absolute -bottom-40 -left-24 size-[28rem] rounded-full bg-brand-500/5 blur-3xl"
        />
        <Logo variant="inverse" className="h-7" />
        <div className="relative max-w-sm">
          <div className="mb-6 h-1 w-12 rounded-full bg-brand-500" />
          <p className="text-display text-ink-inverse">
            The Polity
            <br />
            <span className="text-brand-400">admin</span>
          </p>
          <p className="mt-5 text-[0.95rem] leading-relaxed text-ink-inverse/70">
            Photo albums from Google Drive, blog posts and client reviews —
            all in one place.
          </p>
        </div>
        <p className="text-xs text-ink-inverse/40">
          thepolityservices.com
        </p>
      </aside>

      {/* Form side */}
      <main className="flex items-center justify-center bg-cream px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="rounded-card border border-line bg-surface p-8 shadow-[0_1px_2px_rgba(20,18,14,0.04)] sm:p-10">
            <div className="border-b border-line pb-8">
              <div className="lg:hidden">
                <Logo className="h-7" />
              </div>
              <h1 className="mt-6 text-display text-ink lg:mt-0">
                Admin <span className="text-brand-500">access</span>
              </h1>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-muted">
                Sign in to manage photo albums, blog posts and reviews.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-ink">
                  Admin password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter admin password"
                  className="h-12 w-full rounded-card border border-line-strong bg-cream px-4 text-[0.95rem] text-ink placeholder:text-ink-subtle transition-[border-color,box-shadow] duration-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25"
                />
              </div>

              {error ? (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-card border border-red-500/40 bg-red-500/10 p-4"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600" aria-hidden="true" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              ) : null}

              <Button type="submit" size="lg" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Verifying…
                  </>
                ) : (
                  <>
                    Access dashboard
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 border-t border-line pt-6 text-center">
              <Eyebrow>Authorized administrators only</Eyebrow>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
