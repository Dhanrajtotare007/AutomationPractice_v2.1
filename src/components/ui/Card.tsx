import type { ReactNode } from 'react';
import { clsx } from '@/lib/clsx';

export function Card({
  children,
  className,
  testId,
  as: Tag = 'section',
  ...rest
}: {
  children: ReactNode;
  className?: import('@/lib/clsx').ClassValue;
  testId?: string;
  as?: 'section' | 'div' | 'article';
  'aria-labelledby'?: string;
  id?: string;
}) {
  return (
    <Tag data-testid={testId} className={clsx('surface p-5', className)} {...rest}>
      {children}
    </Tag>
  );
}

export function CardHeader({
  title,
  description,
  icon,
  actions,
  id,
}: {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  id?: string;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        {icon ? (
          <span
            className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-burgundy-50 text-burgundy-700 dark:bg-burgundy-900/40 dark:text-burgundy-200"
            aria-hidden
          >
            {icon}
          </span>
        ) : null}
        <div>
          <h2 id={id} className="section-title">
            {title}
          </h2>
          {description ? <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
  icon,
  testId,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  testId?: string;
}) {
  return (
    <div className="surface flex items-center gap-4 p-4" data-testid={testId}>
      {icon ? (
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-burgundy-50 text-burgundy-700 dark:bg-burgundy-900/40 dark:text-burgundy-200">
          {icon}
        </span>
      ) : null}
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</p>
        {hint ? <p className="truncate text-xs text-slate-500 dark:text-slate-400">{hint}</p> : null}
      </div>
    </div>
  );
}

export function ProgressBar({
  value,
  label,
  testId,
  tone = 'brand',
}: {
  value: number;
  label?: string;
  testId?: string;
  tone?: 'brand' | 'success' | 'info';
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const toneClass =
    tone === 'success' ? 'bg-emerald-500' : tone === 'info' ? 'bg-cyan-500' : 'bg-gradient-to-r from-burgundy-700 to-burgundy-500';
  return (
    <div>
      {label ? (
        <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
          <span>{label}</span>
          <span data-testid={testId ? `${testId}-value` : undefined}>{clamped}%</span>
        </div>
      ) : null}
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progress'}
        data-testid={testId}
        data-value={clamped}
      >
        <div className={clsx('h-full rounded-full transition-[width] duration-500 ease-out', toneClass)} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-6 py-10 text-center dark:border-slate-700"
      data-testid="empty-state"
    >
      {icon ? <span className="text-slate-400 dark:text-slate-600">{icon}</span> : null}
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</p>
      {description ? <p className="max-w-sm text-xs text-slate-500 dark:text-slate-400">{description}</p> : null}
      {action}
    </div>
  );
}

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400" role="status" aria-live="polite">
      <svg className="h-4 w-4 animate-spin text-burgundy-700 dark:text-burgundy-300" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      {label}
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('animate-pulse rounded-md bg-slate-200 dark:bg-slate-800', className)} aria-hidden />;
}
