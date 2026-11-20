import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  Circle,
  Database,
  Layers,
  ListChecks,
  Move,
  RotateCcw,
  Table2,
  Timer,
  UploadCloud,
  UserPlus,
} from 'lucide-react';
import { CHALLENGES, CHALLENGE_LEVELS, labsBySlug } from '@shared/practice';
import type { Difficulty } from '@shared/modules';
import { cx } from '@/lib/utils';
import { Badge, DifficultyBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, ProgressBar } from '@/components/ui/Card';

const CHALLENGE_ICONS: Record<string, typeof UserPlus> = {
  UserPlus,
  CircleDot,
  Table2,
  Database,
  Layers,
  Move,
  Timer,
  UploadCloud,
  AlertTriangle,
  CalendarDays,
};

const STORAGE_KEY = 'qa-challenges-v1';
const LEVELS: (Difficulty | 'All')[] = ['All', ...CHALLENGE_LEVELS];

function readSolved(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function writeSolved(ids: string[]): string[] {
  const unique = [...new Set(ids)].sort();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unique));
  } catch {
    /* storage unavailable */
  }
  return unique;
}

export function ChallengesPage() {
  const [params, setParams] = useSearchParams();
  const levelParam = params.get('level');
  const level: Difficulty | 'All' = CHALLENGE_LEVELS.includes(levelParam as Difficulty) ? (levelParam as Difficulty) : 'All';

  const [solved, setSolved] = useState<string[]>(() => readSolved());
  const [openId, setOpenId] = useState<string | null>(CHALLENGES[0]?.id ?? null);

  useEffect(() => {
    document.title = 'Testing Challenges | Automation Practice';
    return () => {
      document.title = 'Automation Practice | Learn by Automating';
    };
  }, []);

  const toggleSolved = (id: string) => setSolved((current) => writeSolved(current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const visible = useMemo(
    () => (level === 'All' ? CHALLENGES : CHALLENGES.filter((challenge) => challenge.level === level)),
    [level],
  );

  const percent = Math.round((solved.length / CHALLENGES.length) * 100);

  return (
    <div className="space-y-6" data-testid="challenges-page">
      <header className="rounded-xl2 border border-slate-200 bg-white p-5 sm:p-7 dark:border-white/10 dark:bg-navy-900">
        <p className="eyebrow">Testing challenges</p>
        <h1 className="mt-1.5 text-2xl font-extrabold text-navy-900 sm:text-3xl dark:text-white">
          Scenario-based exercises for real automation work
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Each challenge is a ticket-style brief: a scenario, an objective, suggested steps and acceptance criteria. Solve
          it against the linked practice labs with your own framework, then mark it as solved.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="max-w-md">
            <ProgressBar value={percent} label={`${solved.length} of ${CHALLENGES.length} challenges solved`} testId="challenges-progress" />
          </div>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<RotateCcw className="h-3.5 w-3.5" aria-hidden />}
            onClick={() => setSolved(writeSolved([]))}
            data-testid="challenges-reset"
          >
            Reset progress
          </Button>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter challenges by level">
        {LEVELS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setParams(item === 'All' ? {} : { level: item })}
            aria-pressed={level === item}
            data-testid={`challenge-filter-${item.toLowerCase()}`}
            className={cx('chip', level === item && 'chip-active')}
          >
            {item}
            <span className="ml-0.5 text-[10px] opacity-70">
              {item === 'All' ? CHALLENGES.length : CHALLENGES.filter((challenge) => challenge.level === item).length}
            </span>
          </button>
        ))}
      </div>

      <ul className="grid gap-4 lg:grid-cols-2" data-testid="challenge-list">
        {visible.map((challenge) => {
          const Icon = CHALLENGE_ICONS[challenge.icon] ?? ListChecks;
          const isOpen = openId === challenge.id;
          const isSolved = solved.includes(challenge.id);
          const labs = labsBySlug(challenge.labs);

          return (
            <li key={challenge.id} className="surface flex flex-col overflow-hidden" data-testid={`challenge-${challenge.id}`}>
              <div className="flex items-start gap-3 p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-200">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-bold text-navy-900 dark:text-white">{challenge.title}</h2>
                    <DifficultyBadge level={challenge.level} />
                    {isSolved ? (
                      <Badge tone="success" testId={`challenge-solved-badge-${challenge.id}`}>
                        <CheckCircle2 className="h-3 w-3" aria-hidden /> Solved
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">{challenge.category}</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{challenge.scenario}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 px-5">
                {labs.map((lab) => (
                  <Link key={lab.slug} to={`/labs/${lab.slug}`} className="chip" data-testid={`challenge-${challenge.id}-lab-${lab.slug}`}>
                    {lab.title}
                  </Link>
                ))}
                {challenge.frameworks.map((framework) => (
                  <span
                    key={framework}
                    className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500 dark:bg-white/10 dark:text-slate-400"
                  >
                    {framework}
                  </span>
                ))}
              </div>

              {isOpen ? (
                <div className="mt-4 space-y-4 border-t border-slate-200 px-5 py-4 dark:border-white/10" data-testid={`challenge-details-${challenge.id}`}>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Objective</h3>
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{challenge.objective}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Suggested steps</h3>
                    <ol className="mt-1.5 space-y-1.5">
                      {challenge.steps.map((step, index) => (
                        <li key={step} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-50 text-[10px] font-bold text-brand-700 dark:bg-brand-500/20 dark:text-brand-200">
                            {index + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Acceptance criteria</h3>
                    <ul className="mt-1.5 space-y-1.5">
                      {challenge.acceptance.map((criterion) => (
                        <li key={criterion} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                          {criterion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}

              <div className="mt-auto flex flex-wrap items-center gap-2 px-5 pb-5 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpenId(isOpen ? null : challenge.id)}
                  aria-expanded={isOpen}
                  data-testid={`challenge-toggle-${challenge.id}`}
                >
                  {isOpen ? 'Hide details' : 'View brief'}
                </Button>
                <Button
                  size="sm"
                  variant={isSolved ? 'success' : 'primary'}
                  leftIcon={isSolved ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> : <Circle className="h-3.5 w-3.5" aria-hidden />}
                  onClick={() => toggleSolved(challenge.id)}
                  aria-pressed={isSolved}
                  data-testid={`challenge-solve-${challenge.id}`}
                >
                  {isSolved ? 'Solved' : 'Mark as solved'}
                </Button>
                {labs[0] ? (
                  <Link to={`/labs/${labs[0].slug}`} className="ml-auto inline-flex">
                    <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" aria-hidden />}>
                      Open {labs[0].title}
                    </Button>
                  </Link>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      <Card testId="challenges-guide">
        <h2 className="section-title">How to get the most from a challenge</h2>
        <ul className="mt-2 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-3">
          {[
            'Write the brief as a failing test first, then automate until it passes.',
            'Keep every assertion user-facing — role, label or visible text.',
            'Once it passes three times in a row, mark it solved and move to the next level.',
          ].map((tip) => (
            <li key={tip} className="flex gap-1.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
              {tip}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
