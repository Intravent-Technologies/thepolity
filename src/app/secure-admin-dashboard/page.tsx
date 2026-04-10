'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <motion.div
          className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
          whileHover={{ scale: 1.02 }}
        >
          <div className="mb-8 text-center">
            <motion.div
              className="mx-auto mb-4 h-16 w-16 rotate-45 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600"
              animate={{ rotate: [45, 50, 45] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <h1 className="mb-2 text-3xl font-bold text-white">Admin Access</h1>
            <p className="text-gray-300">THE POLITY Secure Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Admin Password
              </label>
              <motion.input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter admin password"
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                whileFocus={{ scale: 1.02 }}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-lg border border-red-500/50 bg-red-500/20 p-4"
              >
                <p className="text-sm text-red-300">{error}</p>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 font-semibold text-white transition hover:from-orange-600 hover:to-orange-700 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Access Dashboard'}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            Authorized administrators can upload portfolio items, gallery images, and gallery videos.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
