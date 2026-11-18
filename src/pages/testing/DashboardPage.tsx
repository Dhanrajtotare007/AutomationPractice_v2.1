import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Clock,
  Code2,
  Database,
  Layers,
  RefreshCw,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  UploadCloud,
} from 'lucide-react';
import { PRACTICE_MODULES, TOTAL_EXERCISES, type Difficulty } from '@shared/modules';
import { BOOKS } from '@shared/content';
import { LOCATORS } from '@shared/locators';
import { useProgress } from '@/lib/useProgress';
import { useNotify } from '@/components/ui/Toast';
import { Badge, DifficultyBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState, ProgressBar, Stat } from '@/components/ui/Card';
import { ModuleIcon } from '@/components/ModuleIcon';
import { BookCard } from '@/components/BookCard';
import { cx } from '@/lib/utils';

const FEATURES = [
  { icon: ClipboardList, title: '15+ Hands-on Testing Tools', text: 'Real widgets with forms, tables, frames, dialogs and more.' },
  { icon: Code2, title: '3 Automation Frameworks', text: 'Playwright, Selenium and Cypress snippets for every control.' },
  { icon: Target, title: 'Copy-ready Locators', text: 'ID, name, CSS, XPath, role, label, placeholder and test-id.' },
  { icon: Sparkles, title: 'Free Practice Environment', text: 'No sign-up, no credentials - progress is stored locally.' },
];

const DIFFICULTIES: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];

export function DashboardPage() {
  const { summary, isComplete, toggle, reset, recentlyPracticed, syncToServer, pullFromServer, syncing } = useProgress();
  const notify = useNotify();
  const [difficulty, setDifficulty] = useState<Difficulty | 'All'>('All');
  const [syncingAction, setSyncingAction] = useState<'push' | 'pull' | null>(null);

  const visibleModules = useMemo(
    () => (difficulty === 'All' ? PRACTICE_MODULES : PRACTICE_MODULES.filter((module) => module.difficulty === difficulty)),
    [difficulty],
  );

  const byDifficulty = useMemo(
    () =>
      DIFFICULTIES.map((level) => {
        const modules = PRACTICE_MODULES.filter((module) => module.difficulty === level);
        const completed = modules.reduce((sum, module) => sum + (summary.modules.find((m) => m.slug === module.slug)?.completed ?? 0), 0);
        const total = modules.reduce((sum, module) => sum + module.exercises, 0);
        return { level, modules: modules.length, completed, total, percent: Math.round((completed / total) * 100) };
      }),
    [summary.modules],
  );

  const handleSync = async (mode: 'push' | 'pull') => {
    setSyncingAction(mode);
    const result = mode === 'push' ? await syncToServer() : await pullFromServer();
    setSyncingAction(null);
    if (result.ok) {
      notify.success(mode === 'push' ? 'Progress saved to the server' : 'Progress restored from the server');
    } else {
      notify.error('Sync failed', result.message);
    }
  };

  return (
    <div className="space-y-6" data-testid="testing-dashboard">
      {/* Hero */}
      <section className="hero-grid overflow-hidden rounded-xl2 bg-burgundy-800 px-6 py-8 text-white shadow-lift sm:px-9 sm:py-10">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="info" className="bg-white/15 text-cyan-100">
            <Sparkles className="h-3 w-3" aria-hidden /> Testing playground
          </Badge>
          <Badge tone="neutral" className="bg-cyan-400/20 text-cyan-100">
            Free practice environment
          </Badge>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl" data-testid="dashboard-title">
          UI Automation Playground
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-burgundy-100 sm:text-base">
          A free, interactive practice environment to master web UI automation. Practice locators, waits, assertions,
          browser interactions, and automation workflows using Playwright, Selenium, and Cypress.
        </p>

        <div className="mt-6 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur transition hover:bg-white/15"
              data-testid={`feature-${['tools', 'frameworks', 'locators', 'free'][FEATURES.findIndex((feature) => feature.title === title)]}`}
            >
              <Icon className="h-5 w-5 text-cyan-200" aria-hidden />
              <p className="mt-2 text-sm font-bold leading-tight">{title}</p>
              <p className="mt-1 text-[11px] leading-snug text-burgundy-100">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section aria-label="Progress statistics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Available tools"
          value={PRACTICE_MODULES.length}
          hint={`${TOTAL_EXERCISES} graded exercises`}
          icon={<Layers className="h-5 w-5" aria-hidden />}
          testId="stat-tools"
        />
        <Stat
          label="Completed exercises"
          value={summary.completedCount}
          hint={`${summary.total - summary.completedCount} remaining`}
          icon={<CheckCircle2 className="h-5 w-5" aria-hidden />}
          testId="stat-completed"
        />
        <Stat
          label="Overall progress"
          value={`${summary.percent}%`}
          hint="Updates as you tick exercises"
          icon={<TrendingUp className="h-5 w-5" aria-hidden />}
          testId="stat-progress"
        />
        <Stat
          label="Documented locators"
          value={LOCATORS.length}
          hint="Copy-ready across 4 frameworks"
          icon={<Code2 className="h-5 w-5" aria-hidden />}
          testId="stat-locators"
        />
      </section>

      {/* Progress + difficulty */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="surface p-5 lg:col-span-2" aria-labelledby="progress-heading">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 id="progress-heading" className="section-title">
              Overall progress
            </h2>
            <div className="flex gap-1.5">
              <Button
                size="sm"
                variant="outline"
                leftIcon={<UploadCloud className="h-3.5 w-3.5" aria-hidden />}
                loading={syncing && syncingAction === 'push'}
                onClick={() => void handleSync('push')}
                data-testid="progress-save-server"
              >
                Save to server
              </Button>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<RefreshCw className="h-3.5 w-3.5" aria-hidden />}
                loading={syncing && syncingAction === 'pull'}
                onClick={() => void handleSync('pull')}
                data-testid="progress-load-server"
              >
                Restore
              </Button>
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<Trash2 className="h-3.5 w-3.5" aria-hidden />}
                onClick={() => {
                  reset();
                  notify.info('Progress reset', 'All exercises are unchecked again.');
                }}
                data-testid="progress-reset"
              >
                Reset
              </Button>
            </div>
          </div>
          <ProgressBar
            value={summary.percent}
            label={`${summary.completedCount} of ${summary.total} exercises completed`}
            testId="dashboard-progress"
          />
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {byDifficulty.map((item) => (
              <div key={item.level} className="surface-muted p-3">
                <div className="flex items-center justify-between">
                  <DifficultyBadge level={item.level} />
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{item.percent}%</span>
                </div>
                <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                  {item.modules} modules · {item.completed}/{item.total} exercises
                </p>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className={cx(
                      'h-full rounded-full',
                      item.level === 'Beginner' ? 'bg-emerald-500' : item.level === 'Intermediate' ? 'bg-amber-500' : 'bg-red-500',
                    )}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface p-5" aria-labelledby="recent-heading">
          <h2 id="recent-heading" className="section-title">
            Recently practiced
          </h2>
          {recentlyPracticed.length === 0 ? (
            <div className="mt-3">
              <EmptyState
                icon={<Clock className="h-6 w-6" aria-hidden />}
                title="Nothing practiced yet"
                description="Tick an exercise in any module and it will show up here."
              />
            </div>
          ) : (
            <ul className="mt-3 space-y-1.5" data-testid="recent-modules">
              {recentlyPracticed.map((module) => {
                const progress = summary.modules.find((m) => m.slug === module.slug);
                return (
                  <li key={module.slug}>
                    <Link
                      to={`/testing/${module.slug}`}
                      className="flex items-center gap-2.5 rounded-lg px-2 py-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <span className={`grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br ${module.accent}`}>
                        <ModuleIcon name={module.icon} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{module.title}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {progress?.completed ?? 0}/{module.exercises} exercises
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 text-slate-400" aria-hidden />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* Module cards */}
      <section aria-labelledby="modules-heading" data-testid="module-grid">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 id="modules-heading" className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              Practice modules
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {visibleModules.length} of {PRACTICE_MODULES.length} modules shown
            </p>
          </div>
          <div className="flex gap-1" role="group" aria-label="Filter modules by difficulty">
            {(['All', ...DIFFICULTIES] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                aria-pressed={difficulty === level}
                data-testid={`filter-${level.toLowerCase()}`}
                className={cx(
                  'rounded-full border px-2.5 py-1 text-[11px] font-semibold transition',
                  difficulty === level
                    ? 'border-burgundy-700 bg-burgundy-700 text-white'
                    : 'border-slate-200 text-slate-600 hover:border-burgundy-300 dark:border-slate-700 dark:text-slate-300',
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visibleModules.map((module) => {
            const progress = summary.modules.find((m) => m.slug === module.slug);
            const percent = progress ? Math.round((progress.completed / module.exercises) * 100) : 0;
            return (
              <article
                key={module.slug}
                className="surface group flex flex-col p-4 transition hover:border-burgundy-300 hover:shadow-lift dark:hover:border-burgundy-700"
                data-testid={`module-card-${module.slug}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br ${module.accent}`}>
                    <ModuleIcon name={module.icon} className="h-5 w-5" />
                  </span>
                  <DifficultyBadge level={module.difficulty} />
                </div>
                <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">{module.title}</h3>
                <p className="mt-1 line-clamp-2 flex-1 text-sm text-slate-500 dark:text-slate-400">{module.blurb}</p>
                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <span>
                      {progress?.completed ?? 0}/{module.exercises} exercises
                    </span>
                    <span>{percent}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${percent}%` }}
                      data-testid={`module-progress-${module.slug}`}
                      data-value={percent}
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Link to={`/testing/${module.slug}`} className="flex-1">
                    <Button size="sm" className="w-full" rightIcon={<ArrowRight className="h-3.5 w-3.5" aria-hidden />}>
                      Practice
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const next = Array.from({ length: module.exercises }, (_, i) => i).find((i) => !isComplete(module.slug, i + 1));
                      if (next === undefined) {
                        toggle(module.slug, 1);
                      } else {
                        toggle(module.slug, next + 1);
                      }
                    }}
                    aria-label={`Toggle an exercise for ${module.title}`}
                    data-testid={`module-quick-toggle-${module.slug}`}
                  >
                    {percent === 100 ? 'Reopen' : 'Tick'}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Promo cards */}
      <section aria-labelledby="promo-heading" className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-burgundy-700 dark:text-burgundy-300" aria-hidden />
          <h2 id="promo-heading" className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
            Go further with our learning resources
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="surface relative overflow-hidden p-5 lg:col-span-2">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/10" aria-hidden />
            <Badge tone="brand">New · Playwright 1.5x</Badge>
            <h3 className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white">Automation Bootcamp - 6 weeks, live instructor</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Build a production-grade framework from scratch: page objects, fixtures, CI pipelines and flake triage.
              Includes lifetime access to this playground and 120+ exercises.
            </p>
            <ul className="mt-3 grid gap-1 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
              {['Live weekly workshops', 'Code reviews on your suite', 'Interview preparation track', 'Certificate on completion'].map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/courses">
                <Button rightIcon={<ArrowRight className="h-4 w-4" aria-hidden />}>Browse courses</Button>
              </Link>
              <Link to="/events">
                <Button variant="outline">See upcoming events</Button>
              </Link>
              <Link to="/api-docs">
                <Button variant="ghost" leftIcon={<Database className="h-4 w-4" aria-hidden />}>
                  Automate the API
                </Button>
              </Link>
            </div>
          </div>
          <BookCard book={BOOKS[0]} />
        </div>
      </section>
    </div>
  );
}
