import type { ReactNode } from 'react';
import { cx, type ClassValue } from '@/lib/utils';

/** Standard two-column layout used by every practice module. */
export function PracticeGrid({ children, aside, className }: { children: ReactNode; aside?: ReactNode; className?: ClassValue }) {
  return (
    <div className={cx('grid gap-4', aside ? 'xl:grid-cols-[minmax(0,1fr)_340px]' : 'grid-cols-1', className)}>
      <div className="min-w-0 space-y-4">{children}</div>
      {aside ? <aside className="min-w-0 space-y-4">{aside}</aside> : null}
    </div>
  );
}

/** Live "output / state" panel reused by several modules. */
export function OutputPanel({
  title = 'Result',
  children,
  testId = 'output-panel',
  tone = 'neutral',
}: {
  title?: string;
  children: ReactNode;
  testId?: string;
  tone?: 'neutral' | 'success' | 'error' | 'info';
}) {
  const toneClass = {
    neutral: 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/60',
    success: 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40',
    error: 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/40',
    info: 'border-accent-200 bg-accent-50 dark:border-accent-900 dark:bg-accent-950/40',
  }[tone];

  return (
    <div className={cx('rounded-xl border p-3', toneClass)} data-testid={testId} aria-live="polite">
      <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
      <div className="text-sm text-slate-800 dark:text-slate-100">{children}</div>
    </div>
  );
}
