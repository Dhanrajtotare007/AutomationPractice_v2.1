import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Bug, CheckCircle2, Code2, Layers, Target, Users } from 'lucide-react';
import { PRACTICE_MODULES, TOTAL_EXERCISES } from '@shared/modules';
import { CHALLENGES, PRACTICE_CATEGORIES } from '@shared/practice';
import { LOCATORS } from '@shared/locators';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { BRAND } from '@/components/layout/Brand';

const VALUES = [
  {
    icon: Code2,
    title: 'Practise on real code',
    text: 'Every widget is a production-grade React component, not a screenshot or a static mock-up.',
  },
  {
    icon: Layers,
    title: 'Framework agnostic',
    text: 'Documented locators work identically in Playwright, Selenium and Cypress.',
  },
  {
    icon: Bug,
    title: 'Built-in edge cases',
    text: 'Disabled controls, async elements, frames, shadow DOM and validation errors.',
  },
  {
    icon: Award,
    title: 'Progress you can prove',
    text: 'Exercises and challenges are tracked locally and can be synced to the practice API.',
  },
];

const INFO = [
  { label: 'Practice labs', value: PRACTICE_MODULES.length },
  { label: 'Graded exercises', value: TOTAL_EXERCISES },
  { label: 'Scenario challenges', value: CHALLENGES.length },
  { label: 'Documented locators', value: LOCATORS.length },
];

export function AboutPage() {
  useEffect(() => {
    document.title = `About | ${BRAND.name}`;
    return () => {
      document.title = `${BRAND.name} | Learn by Automating`;
    };
  }, []);

  return (
    <div className="space-y-6" data-testid="about-page">
      <Breadcrumbs items={[{ label: 'About' }]} />

      <section className="relative overflow-hidden rounded-xl2 bg-navy-900 px-5 py-9 text-white sm:px-9">
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-90" aria-hidden />
        <div className="relative">
          <Badge tone="info" className="bg-white/15 text-accent-200">
            About {BRAND.name}
          </Badge>
          <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl lg:text-4xl">{BRAND.tagline}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
            {BRAND.name} is a free practice platform for QA engineers, automation testers and anyone learning to automate
            the web. It started as an internal training environment — a deliberately rich application where new testers
            could practise locating, waiting and asserting without touching production — and it is now open to everyone.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {INFO.map((item) => (
              <div key={item.label} className="rounded-xl border border-white/15 bg-white/10 p-3">
                <p className="text-2xl font-extrabold">{item.value}</p>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-200">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="What we value">
        {VALUES.map(({ icon: Icon, title, text }) => (
          <Card key={title}>
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-200">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <h2 className="mt-3 text-sm font-bold text-navy-900 dark:text-white">{title}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{text}</p>
          </Card>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" testId="about-how">
          <CardHeader icon={<CheckCircle2 className="h-4 w-4" aria-hidden />} title="How the platform works" />
          <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {[
              'Pick a practice lab from the sidebar — each one focuses on a specific UI interaction pattern.',
              'Open the “Locators & frameworks” tab to copy a selector plus the matching Playwright, Selenium or Cypress snippet.',
              'Write a test in your own framework against the running application.',
              'Tick the exercise buttons at the top of the lab to track progress. Sync it to the API if you want it to survive a browser reset.',
              'When a lab feels easy, open the Challenges page for a multi-lab scenario with acceptance criteria.',
            ].map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </Card>

        <Card testId="about-cta">
          <CardHeader icon={<Users className="h-4 w-4" aria-hidden />} title="For teams" description="Onboarding exercises for new SDETs." />
          <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
            <li>• {PRACTICE_MODULES.length} labs mapped to real skills</li>
            <li>• Interview-ready locator strategies</li>
            <li>• A working REST API for API testing</li>
            <li>• No data leaves your machine</li>
          </ul>
          <Link to="/labs" className="mt-4 inline-flex w-full">
            <Button className="w-full" rightIcon={<ArrowRight className="h-4 w-4" aria-hidden />}>
              Start Practicing
            </Button>
          </Link>
        </Card>
      </div>

      <Card testId="about-areas">
        <CardHeader
          icon={<Target className="h-4 w-4" aria-hidden />}
          title="What you can practise"
          description="Six focused areas, each backed by labs that actually exist on the platform."
        />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {PRACTICE_CATEGORIES.map((category) => (
            <div key={category.id} className="surface-muted p-3">
              <h3 className="text-sm font-bold text-navy-900 dark:text-white">{category.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{category.summary}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/labs">
            <Button size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" aria-hidden />}>
              Explore Practice Labs
            </Button>
          </Link>
          <Link to="/challenges">
            <Button size="sm" variant="outline">
              Testing challenges
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="sm" variant="ghost">
              Contact &amp; support
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
