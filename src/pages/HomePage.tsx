import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  CircleDot,
  Compass,
  Database,
  Flame,
  Gauge,
  GraduationCap,
  Layers,
  MousePointerClick,
  Play,
  Rocket,
  Sparkles,
  Terminal,
  TrendingUp,
  Workflow,
} from 'lucide-react';
import { PRACTICE_MODULES, TOTAL_EXERCISES } from '@shared/modules';
import { PRACTICE_CATEGORIES, POPULAR_LABS, labsBySlug } from '@shared/practice';
import { LOCATORS } from '@shared/locators';
import { ARTICLES } from '@shared/content';
import { useProgress } from '@/lib/useProgress';
import { Button } from '@/components/ui/Button';
import { Badge, DifficultyBadge } from '@/components/ui/Badge';
import { ModuleIcon } from '@/components/ModuleIcon';

const CATEGORY_ICONS: Record<string, typeof MousePointerClick> = {
  MousePointerClick,
  Compass,
  Layers,
  Database,
  Workflow,
  Flame,
};

const WHY = [
  {
    icon: Terminal,
    title: 'Hands-on learning',
    text: 'Every lab is a real React component with forms, async behaviour and validation. You learn by automating it, not by reading about it.',
  },
  {
    icon: Workflow,
    title: 'Real-world testing scenarios',
    text: 'Paginated tables, iframes, shadow DOM, drag & drop and a live REST API — the same problems production suites face.',
  },
  {
    icon: Layers,
    title: 'Framework-independent practice',
    text: 'Playwright, Selenium, Cypress or straight HTTP. Stable test ids, roles and labels keep every lab framework agnostic.',
  },
  {
    icon: GraduationCap,
    title: 'Beginner to advanced exercises',
    text: `${TOTAL_EXERCISES} graded exercises across ${PRACTICE_MODULES.length} labs, each tagged with a difficulty level and a clear objective.`,
  },
  {
    icon: TrendingUp,
    title: 'Practical automation skills',
    text: 'Copy-ready locators, framework snippets and a progress tracker that shows exactly what you have mastered.',
  },
];

const JOURNEY = [
  {
    level: 'Beginner',
    icon: CircleDot,
    summary: 'Learn locators, assertions and the basics of a stable suite.',
    labs: ['checkbox', 'radio', 'alerts', 'notifications'],
    ring: 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300',
    bar: 'bg-emerald-500',
  },
  {
    level: 'Intermediate',
    icon: Compass,
    summary: 'Handle forms, dropdowns, frames, uploads and calendars.',
    labs: ['form', 'dropdown', 'iframe', 'file-upload'],
    ring: 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300',
    bar: 'bg-amber-500',
  },
  {
    level: 'Advanced',
    icon: Flame,
    summary: 'Tame async UI, shadow DOM, drag & drop and data heavy tables.',
    labs: ['waits', 'shadow-dom', 'drag-drop', 'webtable'],
    ring: 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300',
    bar: 'bg-rose-500',
  },
];

const HERO_PROOF = [
  `${PRACTICE_MODULES.length} interactive labs`,
  `${TOTAL_EXERCISES} graded exercises`,
  `${LOCATORS.length} documented locators`,
];

const SNIPPET = `import { test, expect } from '@playwright/test';

test('checkout flow', async ({ page }) => {
  await page.goto('/labs/form');

  await page.getByLabel('Email address').fill('qa@example.com');
  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.getByTestId('form-success')).toContainText('qa@example.com');
});`;

export function HomePage() {
  const { summary } = useProgress();
  const popularLabs = labsBySlug(POPULAR_LABS);

  return (
    <div className="space-y-16 pb-6 sm:space-y-20" data-testid="home-page">
      {/* â”€â”€ 1. Hero â”€â”€ */}
      <section className="relative overflow-hidden rounded-xl3 border border-brand-900/10 bg-navy-900 px-5 py-12 text-white shadow-glow sm:px-10 sm:py-16 dark:border-white/10">
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-90" aria-hidden />
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-20" aria-hidden />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="animate-rise-in">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-200 backdrop-blur">
              <Sparkles className="h-3 w-3" aria-hidden /> Learn by automating
            </span>

            <h1 className="mt-5 text-balance text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-[3.15rem]">
              Master Automation Testing Through Practice
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Learn by automating. Explore interactive testing labs, solve real-world challenges, and build the skills to
              become a confident automation engineer.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/labs">
                <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" aria-hidden />} data-testid="hero-cta-primary">
                  Explore Practice Labs
                </Button>
              </Link>
              <Link to="/labs?level=Beginner">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/25 bg-white/5 text-white hover:border-white hover:bg-white/10 hover:text-white"
                  leftIcon={<Play className="h-4 w-4" aria-hidden />}
                  data-testid="hero-cta-secondary"
                >
                  Start Practicing
                </Button>
              </Link>
            </div>

            <ul className="mt-7 grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
              {HERO_PROOF.map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 shrink-0 text-accent-400" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-rise-in rounded-xl2 border border-white/15 bg-navy-950/60 p-4 shadow-lift backdrop-blur">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-accent-200">
                <Terminal className="h-3.5 w-3.5" aria-hidden /> run.spec.ts
              </p>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">passing</span>
            </div>
            <pre className="scrollbar-thin mt-2 overflow-x-auto rounded-lg bg-navy-950/80 p-3 font-mono text-[11.5px] leading-relaxed text-slate-300">
              {SNIPPET}
            </pre>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              {[
                { label: 'Playwright', value: 'TS · Python' },
                { label: 'Selenium', value: 'Java · Python' },
                { label: 'Cypress', value: 'JavaScript' },
              ].map((framework) => (
                <div key={framework.label} className="rounded-lg border border-white/10 bg-white/5 px-2 py-2">
                  <p className="text-[11px] font-bold text-white">{framework.label}</p>
                  <p className="text-[10px] text-slate-400">{framework.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                <span>Your progress</span>
                <span data-testid="home-progress-label">
                  {summary.completedCount}/{summary.total}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent-400 to-brand-400 transition-all"
                  style={{ width: `${summary.percent}%` }}
                  data-testid="home-progress-bar"
                  data-value={summary.percent}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ 2. Explore practice areas â”€â”€ */}
      <section aria-labelledby="areas-heading" data-testid="home-areas">
        <SectionHeading
          id="areas-heading"
          eyebrow="Explore practice areas"
          title="Pick the skill you want to sharpen"
          description="Every area maps to real labs on this platform — no empty categories, no theory-only pages."
          action={
            <Link to="/labs">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" aria-hidden />}>
                Browse all labs
              </Button>
            </Link>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {PRACTICE_CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category.icon] ?? Layers;
            const labs = labsBySlug(category.labs);
            return (
              <article key={category.id} className="surface flex flex-col p-5" data-testid={`area-${category.id}`}>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 dark:bg-white/10">
                  <Icon className={`h-5 w-5 ${category.accent}`} aria-hidden />
                </span>
                <h3 className="mt-3 text-base font-bold text-navy-900 dark:text-white">{category.title}</h3>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{category.summary}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {labs.slice(0, 3).map((lab) => (
                    <Link
                      key={lab.slug}
                      to={`/labs/${lab.slug}`}
                      className="chip"
                      data-testid={`area-${category.id}-lab-${lab.slug}`}
                    >
                      {lab.title}
                    </Link>
                  ))}
                  {labs.length > 3 ? (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500 dark:bg-white/10 dark:text-slate-400">
                      +{labs.length - 3} more
                    </span>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* â”€â”€ 3. Popular practice labs â”€â”€ */}
      <section aria-labelledby="popular-heading" data-testid="home-popular">
        <SectionHeading
          id="popular-heading"
          eyebrow="Popular practice labs"
          title="Start with the labs everyone uses"
          description="The most useful exercises for building a first reliable suite."
          action={
            <Link to="/labs">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" aria-hidden />}>
                See all {PRACTICE_MODULES.length} labs
              </Button>
            </Link>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {popularLabs.map((lab) => {
            const category = PRACTICE_CATEGORIES.find((item) => item.labs.includes(lab.slug));
            return (
              <article key={lab.slug} className="card-link" data-testid={`popular-lab-${lab.slug}`}>
                <div className="flex items-start justify-between gap-2">
                  <span className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${lab.accent}`}>
                    <ModuleIcon name={lab.icon} className="h-5 w-5" />
                  </span>
                  <DifficultyBadge level={lab.difficulty} />
                </div>
                <h3 className="mt-3 text-base font-bold text-navy-900 dark:text-white">{lab.title}</h3>
                <p className="mt-1 line-clamp-2 flex-1 text-sm text-slate-600 dark:text-slate-400">{lab.blurb}</p>
                <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {category ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 dark:bg-white/10">
                      <Gauge className="h-3 w-3" aria-hidden /> {category.title}
                    </span>
                  ) : null}
                  <span>{lab.exercises} exercises</span>
                </div>
                <Link to={`/labs/${lab.slug}`} className="mt-4">
                  <Button
                    size="sm"
                    className="w-full"
                    rightIcon={<ArrowRight className="h-3.5 w-3.5" aria-hidden />}
                    data-testid={`popular-lab-start-${lab.slug}`}
                  >
                    Start Practice
                  </Button>
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* â”€â”€ 4. Why Automation Practice â”€â”€ */}
      <section aria-labelledby="why-heading" className="rounded-xl3 border border-slate-200 bg-white p-5 sm:p-8 dark:border-white/10 dark:bg-navy-900" data-testid="home-why">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">Why Automation Practice?</p>
            <h2 id="why-heading" className="mt-2 text-2xl font-extrabold text-navy-900 sm:text-3xl dark:text-white">
              A practice environment, not another tutorial site
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Reading about waits does not make you a better automation engineer. Writing tests against an application
              that misbehaves in realistic ways does. Every lab here is designed to be automated from your own framework.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/labs">
                <Button rightIcon={<ArrowRight className="h-4 w-4" aria-hidden />}>Explore Practice Labs</Button>
              </Link>
              <Link to="/challenges">
                <Button variant="outline" leftIcon={<Rocket className="h-4 w-4" aria-hidden />}>
                  View challenges
                </Button>
              </Link>
            </div>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {WHY.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-200">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <p className="mt-2.5 text-sm font-bold text-navy-900 dark:text-white">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* â”€â”€ 5. Learning journey â”€â”€ */}
      <section aria-labelledby="journey-heading" data-testid="home-journey">
        <SectionHeading
          id="journey-heading"
          eyebrow="Learning journey"
          title="Beginner → Intermediate → Advanced"
          description="Follow the levels in order, or jump straight to the labs that match your current job."
        />

        <div className="grid gap-4 md:grid-cols-3">
          {JOURNEY.map((step, index) => {
            const Icon = step.icon;
            const labs = labsBySlug(step.labs);
            return (
              <article key={step.level} className="surface relative flex flex-col p-5" data-testid={`journey-${step.level.toLowerCase()}`}>
                <div className="flex items-center gap-3">
                  <span className={`grid h-10 w-10 place-items-center rounded-xl border ${step.ring}`}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      Step {index + 1}
                    </p>
                    <h3 className="text-base font-bold text-navy-900 dark:text-white">{step.level}</h3>
                  </div>
                </div>
                <div className={`mt-4 h-1 w-full rounded-full ${step.bar}`} aria-hidden />
                <p className="mt-3 flex-1 text-sm text-slate-600 dark:text-slate-400">{step.summary}</p>
                <ul className="mt-3 grid gap-1">
                  {labs.map((lab) => (
                    <li key={lab.slug}>
                      <Link
                        to={`/labs/${lab.slug}`}
                        className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                      >
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" aria-hidden />
                          {lab.title}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link to={`/labs?level=${step.level}`} className="mt-3">
                  <Button variant="outline" size="sm" className="w-full">
                    Browse {step.level.toLowerCase()} labs
                  </Button>
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* â”€â”€ 6. Challenges + resources teaser â”€â”€ */}
      <section aria-labelledby="next-heading" className="grid gap-4 lg:grid-cols-3" data-testid="home-next">
        <div className="rounded-xl2 border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-5 lg:col-span-2 dark:border-brand-500/30 dark:from-brand-500/10 dark:to-navy-900">
          <Badge tone="brand">Testing challenges</Badge>
          <h2 id="next-heading" className="mt-2 text-xl font-extrabold text-navy-900 dark:text-white">
            Ready for a real scenario?
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Challenges combine several labs into a realistic workflow with an objective, suggested steps and acceptance
            criteria — exactly how a ticket reaches your queue.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/challenges">
              <Button rightIcon={<ArrowRight className="h-4 w-4" aria-hidden />}>Browse challenges</Button>
            </Link>
            <Link to="/resources">
              <Button variant="outline">Learning resources</Button>
            </Link>
          </div>
        </div>

        <div className="surface p-5">
          <p className="eyebrow">Latest guide</p>
          <h3 className="mt-1.5 text-base font-bold text-navy-900 dark:text-white">{ARTICLES[0].title}</h3>
          <p className="mt-1 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">{ARTICLES[0].excerpt}</p>
          <Link
            to={`/blog/${ARTICLES[0].slug}`}
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300"
          >
            Read the guide <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  action,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id} className="mt-1 text-xl font-extrabold text-navy-900 sm:text-2xl dark:text-white">
          {title}
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">{description}</p>
      </div>
      {action}
    </div>
  );
}


