import { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, LayoutDashboard, ListChecks, RotateCcw, CheckCircle2 } from 'lucide-react';
import { PRACTICE_MODULES } from '@shared/modules';
import { clsx } from '@/lib/clsx';
import { useProgress } from '@/lib/useProgress';
import { ModuleIcon } from '@/components/ModuleIcon';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/Card';
import { Tooltip } from '@/components/ui/Tooltip';

const COLLAPSE_KEY = 'qa-sidebar-collapsed';

export function Sidebar({
  open,
  onClose,
  collapsed,
  onToggleCollapse,
}: {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const { summary, reset } = useProgress();
  const location = useLocation();
  const [confirmReset, setConfirmReset] = useState(false);

  const previousPath = useRef(location.pathname);

  useEffect(() => {
    if (previousPath.current === location.pathname) return;
    previousPath.current = location.pathname;
    onClose();
  }, [location.pathname, onClose]);

  const item = (slug: string, title: string, icon: string, done?: { completed: number; total: number }) => (
    <li key={slug}>
      <NavLink
        to={`/labs/${slug}`}
        className={({ isActive }) => clsx('sidebar-link', isActive && 'sidebar-link-active', collapsed && 'justify-center px-0')}
        data-testid={`sidebar-${slug}`}
        title={collapsed ? title : undefined}
      >
        <ModuleIcon name={icon} className="h-4 w-4 shrink-0" />
        {!collapsed ? (
          <>
            <span className="truncate">{title}</span>
            {done && done.completed > 0 ? (
              <span
                className={clsx(
                  'ml-auto flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                  done.completed === done.total ? 'bg-emerald-500/25 text-emerald-100' : 'bg-white/15 text-white/90',
                )}
              >
                {done.completed === done.total ? <CheckCircle2 className="h-3 w-3" aria-hidden /> : null}
                {done.completed}/{done.total}
              </span>
            ) : null}
          </>
        ) : null}
      </NavLink>
    </li>
  );

  const moduleProgress = (slug: string) => summary.modules.find((m) => m.slug === slug);

  return (
    <>
      <div
        className={clsx(
          'fixed inset-0 z-30 bg-navy-950/50 backdrop-blur-[1px] transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        aria-hidden
      />
      <aside
        id="testing-sidebar"
        aria-label="Practice labs"
        className={clsx(
          'fixed bottom-0 left-0 top-16 z-30 flex flex-col overflow-hidden border-r border-slate-200 bg-white transition-transform duration-200 lg:sticky lg:top-16 lg:z-0 lg:h-[calc(100vh-4rem)] lg:translate-x-0 dark:border-white/10 dark:bg-navy-900',
          collapsed ? 'w-16' : 'w-64',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        data-collapsed={collapsed}
      >
        <div className={clsx('flex items-center gap-2 px-3 pb-2 pt-3', collapsed && 'justify-center px-0')}>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-navy-900 lg:hidden dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Close practice lab sidebar"
            data-testid="sidebar-close"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
          {!collapsed ? <p className="eyebrow">Practice Labs</p> : <ListChecks className="h-4 w-4 text-brand-600 dark:text-brand-300" aria-hidden />}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="ml-auto hidden rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-navy-900 lg:block dark:hover:bg-white/10 dark:hover:text-white"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
            data-testid="sidebar-collapse-toggle"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" aria-hidden /> : <ChevronLeft className="h-4 w-4" aria-hidden />}
          </button>
        </div>

        <nav className="scrollbar-thin flex-1 overflow-y-auto px-2 pb-2">
          <ul className="space-y-0.5" data-testid="sidebar-nav">
            <li>
              <NavLink
                to="/labs"
                end
                className={({ isActive }) => clsx('sidebar-link', isActive && 'sidebar-link-active', collapsed && 'justify-center px-0')}
                data-testid="sidebar-dashboard"
                title={collapsed ? 'All practice labs' : undefined}
              >
                <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden />
                {!collapsed ? <span>All practice labs</span> : null}
              </NavLink>
            </li>
            <li>
              <Link
                to="/"
                className={clsx('sidebar-link', collapsed && 'justify-center px-0')}
                title={collapsed ? 'Back to home' : undefined}
                data-testid="sidebar-home"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
                {!collapsed ? <span>Back to home</span> : null}
              </Link>
            </li>
            <li aria-hidden className="my-2 border-t border-slate-200 dark:border-white/10" />
            {PRACTICE_MODULES.map((module) => item(module.slug, module.title, module.icon, moduleProgress(module.slug)))}
          </ul>
        </nav>

        <div className={clsx('border-t border-slate-200 p-3 dark:border-white/10', collapsed && 'px-1.5')}>
          {collapsed ? (
            <Tooltip content={`${summary.percent}% complete`}>
              <div className="grid h-8 w-8 place-items-center rounded-full bg-brand-50 text-[10px] font-bold text-brand-700 dark:bg-brand-500/20 dark:text-brand-100">
                {summary.percent}%
              </div>
            </Tooltip>
          ) : (
            <>
              <ProgressBar
                value={summary.percent}
                label={`${summary.completedCount}/${summary.total} exercises`}
                testId="sidebar-progress"
              />
              {confirmReset ? (
                <div className="mt-2 flex gap-1.5">
                  <Button
                    size="sm"
                    variant="danger"
                    className="flex-1"
                    onClick={() => {
                      reset();
                      setConfirmReset(false);
                    }}
                    data-testid="sidebar-progress-reset-confirm"
                  >
                    Confirm
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setConfirmReset(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  className="mt-2 w-full justify-start text-xs"
                  leftIcon={<RotateCcw className="h-3.5 w-3.5" aria-hidden />}
                  onClick={() => setConfirmReset(true)}
                  data-testid="sidebar-progress-reset"
                >
                  Reset progress
                </Button>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );
}

export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const toggle = () =>
    setCollapsed((current) => {
      const next = !current;
      try {
        localStorage.setItem(COLLAPSE_KEY, String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  return { collapsed, toggle };
}
