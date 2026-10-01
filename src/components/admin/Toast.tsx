'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

/* ==========================================================================
   Admin toasts

   The dashboard's managers are siblings rather than nested, so notifications
   are published through a module-level store instead of threaded through
   context. That keeps each manager's call site to a single function with no
   prop plumbing.
   ========================================================================== */

export type ToastKind = 'success' | 'error';

interface Toast {
  id: number;
  message: string;
  kind: ToastKind;
}

type Listener = () => void;

let toasts: Toast[] = [];
let listeners: Listener[] = [];
let nextId = 1;
let snapshot = toasts;

function emit() {
  snapshot = toasts;
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((entry) => entry !== listener);
  };
}

export function notify(message: string, kind: ToastKind = 'error') {
  const toast: Toast = { id: nextId++, message, kind };
  // Cap the stack so a burst of failures cannot cover the whole screen.
  toasts = [...toasts, toast].slice(-3);
  emit();
}

export function dismissToast(id: number) {
  toasts = toasts.filter((toast) => toast.id !== id);
  emit();
}

const TONES: Record<ToastKind, string> = {
  success: 'border-brand-500/40 bg-brand-50 text-brand-800',
  error: 'border-red-500/40 bg-red-50 text-red-800',
};

export function ToastViewport() {
  const visible = useSyncExternalStore(subscribe, () => snapshot, () => snapshot);

  useEffect(() => {
    if (visible.length === 0) return;
    const timers = visible.map((toast) =>
      setTimeout(() => dismissToast(toast.id), 5000),
    );
    return () => timers.forEach(clearTimeout);
  }, [visible]);

  if (visible.length === 0) return null;

  return (
    <div
      // Errors interrupt; confirmations wait their turn.
      aria-live={visible.some((toast) => toast.kind === 'error') ? 'assertive' : 'polite'}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
    >
      {visible.map((toast) => {
        const Icon = toast.kind === 'success' ? CheckCircle2 : AlertCircle;
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-card border p-4 shadow-[0_12px_28px_-18px_rgba(20,18,14,0.5)] ${TONES[toast.kind]}`}
          >
            <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p className="flex-1 text-sm">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="-m-1 shrink-0 rounded p-1 opacity-60 transition-opacity duration-150 hover:opacity-100"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
