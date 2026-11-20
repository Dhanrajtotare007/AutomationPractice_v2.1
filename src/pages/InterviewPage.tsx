import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpenCheck, CheckCircle2, ChevronDown, Lightbulb } from 'lucide-react';
import { INTERVIEW_QUESTIONS } from '@shared/content';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, EmptyState } from '@/components/ui/Card';
import { SearchInput } from '@/components/ui/SearchInput';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { BRAND } from '@/components/layout/Brand';
import { cx } from '@/lib/utils';

export function InterviewPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [open, setOpen] = useState<string[]>([]);

  useEffect(() => {
    document.title = `Interview Questions | ${BRAND.name}`;
    return () => {
      document.title = `${BRAND.name} | Learn by Automating`;
    };
  }, []);

  const categories = useMemo(() => ['All', ...new Set(INTERVIEW_QUESTIONS.map((question) => question.category))], []);
  const visible = INTERVIEW_QUESTIONS.filter((question) => {
    if (category !== 'All' && question.category !== category) return false;
    if (level !== 'All' && question.level !== level) return false;
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return `${question.question} ${question.answer} ${question.category}`.toLowerCase().includes(needle);
  });

  const toggle = (id: string) => setOpen((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  return (
    <div className="space-y-5" data-testid="interview-page">
      <Breadcrumbs items={[{ label: 'Resources', to: '/resources' }, { label: 'Interview questions' }]} />

      <header>
        <Badge tone="brand">Interview preparation</Badge>
        <h1 className="mt-2 text-2xl font-extrabold text-navy-900 sm:text-3xl dark:text-white">
          Questions that come up in SDET interviews
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          {INTERVIEW_QUESTIONS.length} answers covering locators, waits, frames, shadow DOM, flakiness and architecture.
          Reveal an answer only when you have thought it through yourself.
        </p>
      </header>

      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search questions…"
          className="lg:w-72"
          testId="interview-search"
        />
        <div className="flex flex-wrap gap-1" role="group" aria-label="Filter by category">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              data-testid={`interview-category-${item.toLowerCase().replace(/\s+/g, '-')}`}
              className={cx('chip', category === item && 'chip-active')}
            >
              {item}
            </button>
          ))}
        </div>
        <select
          className="field h-9 w-auto text-xs"
          value={level}
          onChange={(event) => setLevel(event.target.value)}
          aria-label="Filter by level"
          data-testid="interview-level"
        >
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map((item) => (
            <option key={item} value={item}>
              {item === 'All' ? 'All levels' : item}
            </option>
          ))}
        </select>
      </div>

      {visible.length === 0 ? (
        <EmptyState title="No questions match" description="Try another category or clear the search." />
      ) : (
        <ul className="space-y-2" data-testid="interview-list">
          {visible.map((question) => {
            const expanded = open.includes(question.id);
            return (
              <li key={question.id} className="surface overflow-hidden" data-testid={`interview-${question.id}`}>
                <button
                  type="button"
                  onClick={() => toggle(question.id)}
                  aria-expanded={expanded}
                  aria-controls={`answer-${question.id}`}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-white/5"
                  data-testid={`interview-toggle-${question.id}`}
                >
                  <Badge tone={question.level === 'Beginner' ? 'success' : question.level === 'Intermediate' ? 'warning' : 'danger'}>
                    {question.level}
                  </Badge>
                  <span className="flex-1 text-sm font-semibold text-navy-900 dark:text-white">{question.question}</span>
                  <span className="hidden text-[11px] font-semibold uppercase tracking-wider text-slate-400 sm:block">{question.category}</span>
                  <ChevronDown className={cx('h-4 w-4 text-slate-400 transition-transform', expanded && 'rotate-180')} aria-hidden />
                </button>
                {expanded ? (
                  <div
                    id={`answer-${question.id}`}
                    className="border-t border-slate-200 px-4 py-3 dark:border-white/10"
                    data-testid={`interview-answer-${question.id}`}
                  >
                    <p className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden />
                      {question.answer}
                    </p>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      <Card testId="interview-tips">
        <CardHeader
          icon={<BookOpenCheck className="h-4 w-4" aria-hidden />}
          title="Interview tips"
          description="Three habits that separate strong candidates."
        />
        <ul className="grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-3">
          {[
            'Talk through your locator choice before writing code — interviewers score reasoning.',
            'Mention explicit waits and auto-waiting instead of Thread.sleep.',
            'Describe how you would debug a flaky test in CI, not just how you would write a test.',
          ].map((tip) => (
            <li key={tip} className="flex gap-1.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
              {tip}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/labs">
            <Button size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" aria-hidden />}>
              Practise in a lab
            </Button>
          </Link>
          <Link to="/challenges">
            <Button size="sm" variant="outline">
              Testing challenges
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
