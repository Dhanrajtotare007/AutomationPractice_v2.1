import { Link } from 'react-router-dom';
import { Terminal } from 'lucide-react';
import { clsx, type ClassValue } from '@/lib/clsx';

export const BRAND = {
  name: 'Automation Practice',
  tagline: 'Learn by automating.',
  firstWord: 'Automation',
  secondWord: 'Practice',
  description:
    'Improve your automation testing skills with hands-on practice labs, real-world testing scenarios, and interactive automation challenges.',
  url: 'https://automationpractice.example',
};

/**
 * Wordmark + monogram. `tone` switches between the light header surface and
 * the dark hero/footer surfaces.
 */
export function Brand({
  to = '/',
  tone = 'light',
  size = 'md',
  className,
  showTagline = true,
}: {
  to?: string;
  tone?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: ClassValue;
  showTagline?: boolean;
}) {
  const monogram = size === 'lg' ? 'h-12 w-12 rounded-2xl' : size === 'sm' ? 'h-8 w-8 rounded-lg' : 'h-10 w-10 rounded-xl';
  const iconSize = size === 'lg' ? 'h-6 w-6' : size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  const titleSize = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-sm' : 'text-[15px]';

  return (
    <Link
      to={to}
      aria-label={`${BRAND.name} home`}
      data-testid="brand-link"
      className={clsx('flex min-w-0 items-center gap-2.5', className)}
    >
      <span
        className={clsx(
          'grid shrink-0 place-items-center bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm',
          monogram,
        )}
      >
        <Terminal className={iconSize} aria-hidden />
      </span>
      <span className="min-w-0 leading-tight">
        <span className={clsx('block truncate font-extrabold tracking-tight', titleSize, tone === 'dark' ? 'text-white' : 'text-navy-900 dark:text-white')}>
          {BRAND.firstWord} <span className={tone === 'dark' ? 'text-accent-300' : 'text-brand-600 dark:text-brand-300'}>{BRAND.secondWord}</span>
        </span>
        {showTagline ? (
          <span
            className={clsx(
              'block truncate text-[10px] font-semibold uppercase tracking-[0.18em]',
              tone === 'dark' ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400',
            )}
          >
            {BRAND.tagline}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
