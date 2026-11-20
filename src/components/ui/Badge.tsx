import { clsx, type ClassValue } from '@/lib/clsx';

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'accent';

const TONES: Record<BadgeTone, string> = {
  neutral: 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300',
  brand: 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200',
  accent: 'bg-accent-50 text-accent-700 dark:bg-accent-500/15 dark:text-accent-200',
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  danger: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  info: 'bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
};

export function Badge({
  children,
  tone = 'neutral',
  className,
  testId,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: ClassValue;
  testId?: string;
}) {
  return (
    <span
      data-testid={testId}
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function DifficultyBadge({ level }: { level: 'Beginner' | 'Intermediate' | 'Advanced' }) {
  const tone: BadgeTone = level === 'Beginner' ? 'success' : level === 'Intermediate' ? 'warning' : 'danger';
  return (
    <Badge tone={tone} testId={`difficulty-${level.toLowerCase()}`}>
      {level}
    </Badge>
  );
}
