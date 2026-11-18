import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Circle,
  Code2,
  ExternalLink,
  ListChecks,
  NotebookPen,
} from 'lucide-react';
import { PRACTICE_MODULES, getModule } from '@shared/modules';
import { LOCATORS } from '@shared/locators';
import { useProgress } from '@/lib/useProgress';
import { cx } from '@/lib/utils';
import { Badge, DifficultyBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ModuleIcon } from '@/components/ModuleIcon';
import { LocatorWorkbench } from '@/components/LocatorWorkbench';
import { NotFound } from '@/pages/NotFound';
import { ModuleCheatsheet } from '@/components/modules/ModuleCheatsheet';
import { MODULE_REGISTRY } from '@/components/modules/registry';

export function ModulePage() {
  const { moduleSlug = '' } = useParams();
  const module = getModule(moduleSlug);
  const moduleLocators = LOCATORS.filter((locator) => locator.module === moduleSlug);

  if (!module || !MODULE_REGISTRY[moduleSlug]) {
    return <NotFound />;
  }

  const index = PRACTICE_MODULES.findIndex((item) => item.slug === moduleSlug);
  const prev = PRACTICE_MODULES[index - 1];
  const next = PRACTICE_MODULES[index + 1];
  const ModuleBody = MODULE_REGISTRY[moduleSlug];

  return (
    <ModuleShell
      slug={module.slug}
      title={module.title}
      blurb={module.blurb}
      difficulty={module.difficulty}
      icon={module.icon}
      exercises={module.exercises}
      locatorCount={moduleLocators.length}
    >
      <ModuleBody />
      <ModuleCheatsheet slug={module.slug} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        {prev ? (
          <Link to={`/testing/${prev.slug}`} className="inline-flex">
            <Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" aria-hidden />}>
              {prev.title}
            </Button>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/testing/${next.slug}`} className="inline-flex">
            <Button rightIcon={<ArrowRight className="h-4 w-4" aria-hidden />} data-testid="next-module">
              Next: {next.title}
            </Button>
          </Link>
        ) : (
          <Link to="/testing" className="inline-flex">
            <Button rightIcon={<ArrowRight className="h-4 w-4" aria-hidden />}>Back to dashboard</Button>
          </Link>
        )}
      </div>
    </ModuleShell>
  );
}

export function ModuleShell({
  slug,
  title,
  blurb,
  difficulty,
  icon,
  exercises,
  locatorCount,
  children,
  intro,
}: {
  slug: string;
  title: string;
  blurb: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: string;
  exercises: number;
  locatorCount: number;
  children: ReactNode;
  intro?: ReactNode;
}) {
  const { summary, isComplete, toggle } = useProgress();
  const progress = summary.modules.find((item) => item.slug === slug);
  const [tab, setTab] = useState<'practice' | 'locators'>('practice');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = `${title} · QA Automation Labs`;
    return () => {
      document.title = 'QA Automation Labs | UI Automation Playground';
    };
  }, [title]);

  useEffect(() => {
    setTab('practice');
  }, [slug]);

  const switchTab = (nextTab: 'practice' | 'locators') => {
    setTab(nextTab);
    if (nextTab === 'locators') {
      window.setTimeout(() => document.getElementById('locator-workbench')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
    }
  };

  return (
    <div className="space-y-4" data-testid={`module-${slug}`}>
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
        <Link to="/testing" className="hover:text-burgundy-700 dark:hover:text-white">
          Testing
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden />
        <span className="font-semibold text-slate-700 dark:text-slate-200">{title}</span>
      </nav>

      <header className="surface overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 bg-gradient-to-r from-burgundy-50 to-white p-5 dark:border-slate-800 dark:from-burgundy-950/40 dark:to-slate-900">
          <div className="flex items-start gap-3">
            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${'from-burgundy-600 to-burgundy-800'} text-white shadow-sm`}>
              <ModuleIcon name={icon} className="h-6 w-6" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white" data-testid="module-title">
                  {title}
                </h1>
                <DifficultyBadge level={difficulty} />
                <Badge tone="info" className="gap-1">
                  <Code2 className="h-3 w-3" aria-hidden /> {locatorCount} locators
                </Badge>
              </div>
              <p className="mt-1 max-w-3xl text-sm text-slate-600 dark:text-slate-300">{blurb}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center dark:border-slate-700 dark:bg-slate-900">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Exercises</p>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white" data-testid="module-progress-label">
                {progress?.completed ?? 0}/{exercises}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 px-3 pt-2 dark:border-slate-800">
          <TabButton active={tab === 'practice'} onClick={() => switchTab('practice')} testId="tab-practice" icon={<ListChecks className="h-4 w-4" aria-hidden />}>
            Practice
          </TabButton>
          <TabButton active={tab === 'locators'} onClick={() => switchTab('locators')} testId="tab-locators" icon={<Code2 className="h-4 w-4" aria-hidden />}>
            Locators &amp; frameworks
          </TabButton>
          <div className="ml-auto flex items-center gap-1 pb-1">
            <span className="mr-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">Exercises:</span>
            {Array.from({ length: exercises }, (_, i) => {
              const complete = isComplete(slug, i + 1);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggle(slug, i + 1)}
                  aria-pressed={complete}
                  aria-label={`Exercise ${i + 1}: ${complete ? 'completed' : 'not completed'}`}
                  data-testid={`exercise-${i + 1}`}
                  className={cx(
                    'grid h-7 w-7 place-items-center rounded-md border text-[11px] font-bold transition',
                    complete
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-slate-200 text-slate-400 hover:border-emerald-400 hover:text-emerald-600 dark:border-slate-700',
                  )}
                >
                  {complete ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> : i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {intro}

      <div
        ref={panelRef}
        id="practice-panel"
        data-testid="practice-panel"
        hidden={tab !== 'practice'}
      >
        {children}
      </div>

      {tab === 'locators' ? (
        <div id="locator-workbench">
          <LocatorWorkbench moduleSlug={slug} />
        </div>
      ) : (
        <div className="surface flex flex-wrap items-center justify-between gap-3 p-4">
          <p className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
            <NotebookPen className="mt-0.5 h-4 w-4 shrink-0 text-burgundy-700 dark:text-burgundy-300" aria-hidden />
            Looking for the selector for a control? Every element on this page is documented with Playwright, Selenium and
            Cypress examples.
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => switchTab('locators')} data-testid="open-locators">
              View locators
            </Button>
            <a
              href="/api-docs"
              className="inline-flex"
              onClick={(event) => {
                event.preventDefault();
                window.location.assign('/api-docs');
              }}
            >
              <Button size="sm" variant="ghost" rightIcon={<ExternalLink className="h-3.5 w-3.5" aria-hidden />}>
                API reference
              </Button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
  testId,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  testId: string;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      data-testid={testId}
      className={cx(
        'relative -mb-px inline-flex items-center gap-1.5 rounded-t-lg border-b-2 px-3 py-2 text-sm font-semibold transition',
        active
          ? 'border-burgundy-700 text-burgundy-700 dark:border-burgundy-400 dark:text-burgundy-200'
          : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white',
      )}
    >
      {icon}
      {children}
    </button>
  );
}

export { Circle };
