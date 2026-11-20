import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from '@/lib/clsx';

export interface Crumb {
  label: string;
  to?: string;
}

/** Accessible breadcrumb trail used by the interior pages. */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={clsx('flex flex-wrap items-center gap-1 text-xs text-slate-500 dark:text-slate-400', className)}>
      <Link
        to="/"
        className="inline-flex items-center gap-1 rounded transition hover:text-brand-700 dark:hover:text-white"
        aria-label="Home"
      >
        <Home className="h-3.5 w-3.5" aria-hidden />
      </Link>
      {items.map((item, index) => {
        const last = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
            <ChevronRight className="h-3 w-3 text-slate-400" aria-hidden />
            {item.to && !last ? (
              <Link to={item.to} className="rounded transition hover:text-brand-700 dark:hover:text-white">
                {item.label}
              </Link>
            ) : (
              <span aria-current={last ? 'page' : undefined} className="font-semibold text-navy-800 dark:text-slate-200">
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
