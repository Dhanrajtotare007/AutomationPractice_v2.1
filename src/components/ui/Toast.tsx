/**
 * Toast system: context, provider and hooks.
 * Colours are chosen so the same component can be reused for the
 * "Notifications" practice module.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { clsx } from '@/lib/clsx';

export type ToastKind = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  title: string;
  description?: string;
  kind?: ToastKind;
  /** Duration in ms. 0 keeps the toast until it is dismissed. */
  duration?: number;
  /** Optional custom data-testid for the rendered toast. */
  testId?: string;
}

export interface ToastRecord extends Required<Omit<ToastOptions, 'description' | 'testId'>> {
  id: number;
  description?: string;
  testId?: string;
}

export interface ToastApi {
  push: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
  clear: () => void;
  toasts: ToastRecord[];
}

const KIND_STYLES: Record<ToastKind, { icon: ReactNode; ring: string; bar: string }> = {
  success: { icon: <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" aria-hidden />, ring: 'border-emerald-200 dark:border-emerald-900', bar: 'bg-emerald-500' },
  error: { icon: <XCircle className="h-5 w-5 shrink-0 text-red-500" aria-hidden />, ring: 'border-red-200 dark:border-red-900', bar: 'bg-red-500' },
  warning: { icon: <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" aria-hidden />, ring: 'border-amber-200 dark:border-amber-900', bar: 'bg-amber-500' },
  info: { icon: <Info className="h-5 w-5 shrink-0 text-cyan-500" aria-hidden />, ring: 'border-cyan-200 dark:border-cyan-900', bar: 'bg-cyan-500' },
};

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const counter = useRef(0);
  const timers = useRef(new Map<number, number>());

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const clear = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current.clear();
    setToasts([]);
  }, []);

  const push = useCallback((options: ToastOptions) => {
    counter.current += 1;
    const id = counter.current;
    const record: ToastRecord = {
      id,
      title: options.title,
      description: options.description,
      kind: options.kind ?? 'info',
      duration: options.duration ?? 4000,
      testId: options.testId,
    };
    // Keep at most five concurrent toasts, dropping the oldest.
    setToasts((current) => [...current, record].slice(-5));
    if (record.duration > 0) {
      const timer = window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
        timers.current.delete(id);
      }, record.duration);
      timers.current.set(id, timer);
    }
    return id;
  }, []);

  useEffect(() => {
    const activeTimers = timers.current;
    return () => activeTimers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const value = useMemo<ToastApi>(() => ({ push, dismiss, clear, toasts }), [push, dismiss, clear, toasts]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(92vw,380px)] flex-col gap-2"
        aria-live="polite"
        data-testid="toast-stack"
        role="region"
        aria-label="Toast notifications"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            data-testid={toast.testId ?? 'toast-item'}
            data-kind={toast.kind}
            role={toast.kind === 'error' ? 'alert' : 'status'}
            className={clsx(
              'pointer-events-auto relative overflow-hidden rounded-xl border bg-white p-3.5 pr-9 shadow-lift animate-slide-in dark:bg-slate-900',
              KIND_STYLES[toast.kind].ring,
            )}
          >
            <div className="flex items-start gap-2.5">
              {KIND_STYLES[toast.kind].icon}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{toast.title}</p>
                {toast.description ? <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">{toast.description}</p> : null}
              </div>
            </div>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label={`Dismiss ${toast.title}`}
              className="absolute right-2 top-2 rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
            {toast.duration > 0 ? (
              <span
                className={clsx('absolute bottom-0 left-0 h-0.5 w-full origin-left', KIND_STYLES[toast.kind].bar)}
                style={{ animation: `toast-shrink ${toast.duration}ms linear forwards` }}
                aria-hidden
              />
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

/** Convenience API: `const notify = useNotify(); notify.success('Saved')`. */
export function useNotify() {
  const { push, clear } = useToast();
  return useMemo(
    () => ({
      success: (title: string, description?: string, duration?: number) => push({ title, description, kind: 'success', duration }),
      error: (title: string, description?: string, duration?: number) => push({ title, description, kind: 'error', duration }),
      warning: (title: string, description?: string, duration?: number) => push({ title, description, kind: 'warning', duration }),
      info: (title: string, description?: string, duration?: number) => push({ title, description, kind: 'info', duration }),
      push,
      clear,
    }),
    [push, clear],
  );
}
