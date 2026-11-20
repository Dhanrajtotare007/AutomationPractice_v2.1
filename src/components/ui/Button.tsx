import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from '@/lib/clsx';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'accent';
type Size = 'sm' | 'md' | 'lg' | 'icon';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-brand-600 text-white shadow-sm hover:bg-brand-700 active:bg-brand-800 disabled:bg-brand-300 dark:disabled:bg-brand-900',
  accent: 'bg-accent-500 text-white shadow-sm hover:bg-accent-600 active:bg-accent-700 disabled:bg-accent-300',
  secondary:
    'bg-navy-900 text-white hover:bg-navy-800 active:bg-navy-950 disabled:bg-slate-400 dark:bg-white dark:text-navy-900 dark:hover:bg-slate-100 dark:disabled:bg-slate-700 dark:disabled:text-slate-400',
  outline:
    'border border-slate-300 bg-white text-navy-800 hover:border-brand-400 hover:text-brand-700 disabled:text-slate-400 dark:border-white/15 dark:bg-transparent dark:text-slate-200 dark:hover:border-brand-400 dark:hover:text-white dark:disabled:text-slate-500',
  ghost:
    'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-navy-900 disabled:text-slate-400 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-red-300',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-emerald-300',
};

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-[15px] gap-2',
  icon: 'h-10 w-10 justify-center',
};

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: ClassValue;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    className,
    children,
    disabled,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={clsx(
        'inline-flex select-none items-center justify-center rounded-lg font-semibold transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed dark:focus-visible:ring-offset-navy-950',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : leftIcon}
      {children}
      {rightIcon}
    </button>
  );
});
