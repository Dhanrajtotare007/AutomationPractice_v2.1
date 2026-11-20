import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock,
  Code2,
  Database,
  Layers,
  RefreshCw,
  SearchX,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  UploadCloud,
} from 'lucide-react';
import { PRACTICE_MODULES, TOTAL_EXERCISES, type Difficulty } from '@shared/modules';
import { PRACTICE_CATEGORIES } from '@shared/practice';
import { LOCATORS } from '@shared/locators';
import { useProgress } from '@/lib/useProgress';
import { useNotify } from '@/components/ui/Toast';
import { Badge, DifficultyBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState, ProgressBar, Stat } from '@/components/ui/Card';
import { SearchInput } from '@/components/ui/SearchInput';
import { ModuleIcon } from '@/components/ModuleIcon';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { cx } from '@/lib/utils';

const FEATURES = [
  { icon: ClipboardList, title: '15 Hands-on Labs', text: 'Real widgets with forms, tables, frames, dialogs and more.' },
  { icon: Code2, title: '3 Frameworks', text: 'Playwright, Selenium and Cypress snippets for every control.' },
  { icon: Target, title: 'Copy-ready Locators', text: 'ID, name, CSS, XPath, role, label, placeholder and test-id.' },
  { icon: Sparkles, title: 'Free Practice', text: 'No sign-up, no credentials — progress is stored locally.' },
];

const DIFFICULTIES: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];

export function DashboardPage() {
  const { summary, isComplete, toggle, reset, recentlyPracticed, syncToServer, pullFromServer, syncing } = useProgress();
  const notify = useNotify();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [syncingAction, setSyncingAction] = useState<'push' | 'pull' | null>(null);

  const levelParam = params.get('level');
  const difficulty: Difficulty | 'All' = DIFFICULTIES.includes(levelParam as Difficulty) ? (levelParam as Difficulty) : 'All';
  const categoryParam = params.get('category') ?? 'all';
  const category = PRACTICE_CATEGORIES.find((item) => item.id === categoryParam);

  useEffect(() => {
    document.title = 'Practice Labs | Automation Practice';
    return () => {
      document.title = 'Automation Practice | Learn by Automating';
    };
  }, []);

  const updateParams = (next: { level?: Difficulty | 'All'; category?: string }) => {
    const search: Record<string, string> = {};
    const nextLevel = next.level ?? difficulty;
    const nextCategory = next.category ?? categoryParam;
    if (nextLevel !== 'All') search.level = nextLevel;
    if (nextCategory !== 'all') search.category = nextCategory;
    setParams(search);
  };

  const visibleModules = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return PRACTICE_MODULES.filter((module) => {
      if (difficulty !== 'All' && module.difficulty !== difficulty) return false;
      if (category && !category.labs.includes(module.slug)) return false;
      if (!needle) return true;
      return `${module.title} ${module.blurb} ${module.difficulty}`.toLowerCase().includes(needle);
    });
  }, [difficulty, category, query]);

  const byDifficulty = useMemo(
    () =>
      DIFFICULTIES.map((level) => {
        const modules = PRACTICE_MODULES.filter((module) => module.difficulty === level);
        const completed = modules.reduce(
          (sum, module) => sum + (summary.modules.find((m) => m.slug === module.slug)?.completed ?? 0),
          0,
        );
        const total = modules.reduce((sum, module) => sum + module.exercises, 0);
        return { level, modules: modules.length, completed, total, percent: total ? Math.round((completed / total) * 100) : 0 };
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

  const clearFilters = () => {
    setQuery('');
    setParams({});
  };

  return (
    <div className="space-y-6" data-testid="testing-dashboard">
      <Breadcrumbs items={[{ label: 'Practice Labs' }]} />

      {/* Hero */}
      <section className="relative overflow-hidden rounded-xl2 bg-navy-900 px-5 py-8 text-white shadow-glow sm:px-8 sm:py-10">
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-90" aria-hidden />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="info" className="bg-white/15 text-accent-200">
              <Sparkles className="h-3 w-3" aria-hidden /> Practice labs
            </Badge>
            <Badge tone="neutral" className="bg-white/10 text-slate-200">
              Free · no account needed
            </Badge>
          </div>
          <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl" data-testid="dashboard-title">
            Automation practice labs
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
            {PRACTICE_MODULES.length} interactive labs and {TOTAL_EXERCISES} graded exercises. Automate them with
            Playwright, Selenium or Cypress, and track what you have completed.
          </p>

          <div className="mt-5 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, text }, index) => (
              <div
                key={title}
                className="rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur transition hover:bg-white/15"
                data-testid={`feature-${['tools', 'frameworks', 'locators', 'free'][index]}`}
              >
                <Icon className="h-5 w-5 text-accent-200" aria-hidden />
                <p className="mt-2 text-sm font-bold leading-tight">{title}</p>
                <p className="mt-1 text-[11px] leading-snug text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section aria-label="Progress statistics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Available labs"
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

      {/* Progress + recent */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="surface p-5 lg:col-span-2" aria-labelledby="progress-heading">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 id="progress-heading" className="section-title">
              Overall progress
            </h2>
            <div className="flex flex-wrap gap-1.5">
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
              <button
                key={item.level}
                type="button"
                onClick={() => updateParams({ level: item.level })}
                className="surface-muted p-3 text-left transition hover:border-brand-300 dark:hover:border-brand-400/60"
                data-testid={`progress-level-${item.level.toLowerCase()}`}
              >
                <div className="flex items-center justify-between">
                  <DifficultyBadge level={item.level} />
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{item.percent}%</span>
                </div>
                <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                  {item.modules} labs · {item.completed}/{item.total} exercises
                </p>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                  <div
                    className={cx(
                      'h-full rounded-full',
                      item.level === 'Beginner' ? 'bg-emerald-500' : item.level === 'Intermediate' ? 'bg-amber-500' : 'bg-rose-500',
                    )}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </button>
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
                description="Tick an exercise in any lab and it will show up here."
              />
            </div>
          ) : (
            <ul className="mt-3 space-y-1.5" data-testid="recent-modules">
              {recentlyPracticed.map((module) => {
                const progress = summary.modules.find((m) => m.slug === module.slug);
                return (
                  <li key={module.slug}>
                    <Link
                      to={`/labs/${module.slug}`}
                      className="flex items-center gap-2.5 rounded-lg px-2 py-2 transition hover:bg-slate-100 dark:hover:bg-white/10"
                    >
                      <span className={`grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br ${module.accent}`}>
                        <ModuleIcon name={module.icon} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-navy-900 dark:text-slate-100">{module.title}</span>
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

      {/* Filters */}
      <section aria-labelledby="modules-heading" data-testid="module-grid">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="modules-heading" className="text-xl font-extrabold text-navy-900 dark:text-white">
              Practice labs
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {visibleModules.length} of {PRACTICE_MODULES.length} labs shown
              {category ? ` · ${category.title}` : ''}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search labs…"
              className="w-full sm:w-56"
              testId="labs-search"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={clearFilters}
              data-testid="labs-clear-filters"
              className="shrink-0"
            >
              Clear
            </Button>
          </div>
        </div>

        <div className="mb-2 flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter labs by difficulty">
          {(['All', ...DIFFICULTIES] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => updateParams({ level })}
              aria-pressed={difficulty === level}
              data-testid={`filter-${level.toLowerCase()}`}
              className={cx('chip', difficulty === level && 'chip-active')}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter labs by category">
          <button
            type="button"
            onClick={() => updateParams({ category: 'all' })}
            aria-pressed={!category}
            data-testid="filter-category-all"
            className={cx('chip', !category && 'chip-active')}
          >
            All categories
          </button>
          {PRACTICE_CATEGORIES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => updateParams({ category: item.id })}
              aria-pressed={category?.id === item.id}
              data-testid={`filter-category-${item.id}`}
              className={cx('chip', category?.id === item.id && 'chip-active')}
            >
              {item.title}
            </button>
          ))}
        </div>

        {visibleModules.length === 0 ? (
          <EmptyState
            icon={<SearchX className="h-6 w-6" aria-hidden />}
            title="No labs match these filters"
            description="Try clearing the search or picking a different difficulty level."
            action={
              <Button size="sm" variant="outline" className="mt-2" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {visibleModules.map((module) => {
              const progress = summary.modules.find((m) => m.slug === module.slug);
              const percent = progress ? Math.round((progress.completed / module.exercises) * 100) : 0;
              const moduleCategory = PRACTICE_CATEGORIES.find((item) => item.labs.includes(module.slug));
              return (
                <article
                  key={module.slug}
                  className="surface group flex flex-col p-4 transition hover:border-brand-300 hover:shadow-lift dark:hover:border-brand-400/60"
                  data-testid={`module-card-${module.slug}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br ${module.accent}`}>
                      <ModuleIcon name={module.icon} className="h-5 w-5" />
                    </span>
                    <DifficultyBadge level={module.difficulty} />
                  </div>
                  <h3 className="mt-3 text-base font-bold text-navy-900 dark:text-white">{module.title}</h3>
                  <p className="mt-1 line-clamp-2 flex-1 text-sm text-slate-600 dark:text-slate-400">{module.blurb}</p>
                  {moduleCategory ? (
                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{moduleCategory.title}</p>
                  ) : null}
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      <span>
                        {progress?.completed ?? 0}/{module.exercises} exercises
                      </span>
                      <span>{percent}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                      <div
                        className="h-full rounded-full bg-accent-500 transition-all"
                        style={{ width: `${percent}%` }}
                        data-testid={`module-progress-${module.slug}`}
                        data-value={percent}
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Link to={`/labs/${module.slug}`} className="flex-1">
                      <Button size="sm" className="w-full" rightIcon={<ArrowRight className="h-3.5 w-3.5" aria-hidden />}>
                        Practice
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const next = Array.from({ length: module.exercises }, (_, i) => i).find((i) => !isComplete(module.slug, i + 1));
                        toggle(module.slug, next === undefined ? 1 : next + 1);
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
        )}
      </section>

      {/* Next steps */}
      <section aria-labelledby="next-heading" className="grid gap-4 lg:grid-cols-3" data-testid="labs-next">
        <div className="surface p-5 lg:col-span-2">
          <Badge tone="brand">Keep going</Badge>
          <h2 id="next-heading" className="mt-2 text-lg font-extrabold text-navy-900 dark:text-white">
            Turn labs into real scenarios
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Once a lab feels easy, combine several of them into a challenge brief with acceptance criteria — or practise
            against the REST API directly.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/challenges">
              <Button rightIcon={<ArrowRight className="h-4 w-4" aria-hidden />}>Browse challenges</Button>
            </Link>
            <Link to="/api-docs">
              <Button variant="outline" leftIcon={<Database className="h-4 w-4" aria-hidden />}>
                API reference
              </Button>
            </Link>
            <Link to="/resources">
              <Button variant="ghost">Learning resources</Button>
            </Link>
          </div>
        </div>
        <div className="surface p-5">
          <h2 className="section-title">Locators &amp; frameworks</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Every lab page includes a locator workbench with Playwright, Selenium and Cypress snippets.
          </p>
          <p className="mt-3 text-2xl font-extrabold text-navy-900 dark:text-white">{LOCATORS.length}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">documented locator examples</p>
        </div>
      </section>
    </div>
  );
}
