'use client';

import { useState } from 'react';

/**
 * Newsletter capture.
 *
 * The input is an underline rather than a boxed field, which suits the dark
 * layout better than a filled control would: a box on a near-black background
 * reads as a hole, whereas a rule reads as part of the page. The submit button
 * is an arrow glyph rather than a labelled button, so it never competes with
 * the placeholder text for a 400px-wide line.
 */
export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setEmail('');
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
    setTimeout(() => setStatus('idle'), 4000);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-7">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="group relative flex items-center">
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 w-full border-b border-ink-inverse/25 bg-transparent pr-10 text-[0.95rem] text-ink-inverse transition-colors duration-200 placeholder:text-ink-inverse/40 hover:border-ink-inverse/50 focus:border-brand-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="absolute right-0 grid size-8 place-items-center text-ink-inverse/60 transition-[color,transform] duration-300 hover:rotate-45 hover:text-brand-500 disabled:opacity-50"
        >
          <svg
            viewBox="0 0 14 13"
            aria-hidden="true"
            className="size-3.5 fill-none stroke-current"
            strokeWidth="1.6"
          >
            <path d="M12.5 1 1 6.2l4.6 2.1L7.7 13 12.5 1Z" />
          </svg>
          <span className="sr-only">Subscribe</span>
        </button>
      </div>

      <p aria-live="polite" className="mt-4 min-h-5 text-sm">
        {status === 'success' && (
          <span className="text-brand-400">Thanks — you are on the list.</span>
        )}
        {status === 'error' && (
          <span className="text-brand-300">
            That did not work. Please check the address and try again.
          </span>
        )}
      </p>
    </form>
  );
}
