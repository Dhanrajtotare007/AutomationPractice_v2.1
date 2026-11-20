import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { PRACTICE_MODULES } from '@shared/modules';

export function NotFound() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center" data-testid="not-found">
      <Compass className="mx-auto h-12 w-12 text-brand-600 dark:text-brand-300" aria-hidden />
      <p className="mt-4 text-sm font-bold uppercase tracking-[0.2em] text-accent-600 dark:text-accent-300">Error 404</p>
      <h1 className="mt-1 text-2xl font-extrabold text-navy-900 dark:text-white">Page not found</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        The page you are looking for does not exist. Try the practice labs or one of the modules below.
      </p>
      <div className="mt-5 flex justify-center gap-2">
        <Link to="/labs">
          <Button>Browse practice labs</Button>
        </Link>
        <Link to="/">
          <Button variant="outline">Back home</Button>
        </Link>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {PRACTICE_MODULES.slice(0, 8).map((module) => (
          <Link
            key={module.slug}
            to={`/labs/${module.slug}`}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-brand-300 hover:text-brand-700 dark:border-white/15 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-white"
          >
            {module.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
