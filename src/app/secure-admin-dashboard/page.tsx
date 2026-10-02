'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Button, CategoryLabel, Eyebrow } from '@/components/ui';

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
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="rounded-card border border-line bg-surface p-8 sm:p-10">
          <div className="border-b border-line pb-8">
            <CategoryLabel className="text-2xl">
              Admin <span className="text-brand-500">access</span>
            </CategoryLabel>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-muted">
              Sign in to manage work, blog, team, reviews and homepage
              content.
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

          <p className="mt-8 border-t border-line pt-6 text-center">
            <Eyebrow>Authorized administrators only</Eyebrow>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
