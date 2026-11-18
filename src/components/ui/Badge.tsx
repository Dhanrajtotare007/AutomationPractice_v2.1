import { clsx, type ClassValue } from '@/lib/clsx';

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

const TONES: Record<BadgeTone, string> = {
  neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  brand: 'bg-burgundy-100 text-burgundy-800 dark:bg-burgundy-900/50 dark:text-burgundy-200',
  success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  info: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300',
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
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide',
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
