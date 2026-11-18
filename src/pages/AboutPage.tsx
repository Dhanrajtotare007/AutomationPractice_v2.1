import { Link } from 'react-router-dom';
import { ArrowRight, Award, Bug, CheckCircle2, Code2, Layers, Users } from 'lucide-react';
import { PRACTICE_MODULES } from '@shared/modules';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';

const VALUES = [
  { icon: Code2, title: 'Practise on real code', text: 'Every widget is a production-grade React component, not a screenshot.' },
  { icon: Layers, title: 'Framework agnostic', text: 'Documented locators work identically in Playwright, Selenium and Cypress.' },
  { icon: Bug, title: 'Built-in edge cases', text: 'Disabled controls, async elements, frames, shadow DOM and validation errors.' },
  { icon: Award, title: 'Progress you can prove', text: 'Exercises are tracked locally and can be synced to the playground API.' },
];

const INFO = [
  { label: 'Module count', value: PRACTICE_MODULES.length },
  { label: 'Graded exercises', value: PRACTICE_MODULES.reduce((sum, module) => sum + module.exercises, 0) },
  { label: 'Supported frameworks', value: 3 },
  { label: 'External dependencies', value: 0 },
];

export function AboutPage() {
  return (
    <div className="space-y-6" data-testid="about-page">
      <section className="hero-grid rounded-xl2 bg-burgundy-800 px-6 py-9 text-white sm:px-9">
        <Badge tone="info" className="bg-white/15 text-cyan-100">About us</Badge>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">A playground built by testers, for testers</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-burgundy-100 sm:text-base">
          QA Automation Labs started as an internal training environment: a deliberately rich application where new
          testers could practise locating, waiting and asserting without touching production. It has grown into a
          public playground used by candidates preparing for interviews and teams onboarding new SDETs.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {INFO.map((item) => (
            <div key={item.label} className="rounded-xl border border-white/15 bg-white/10 p-3">
              <p className="text-2xl font-extrabold">{item.value}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-cyan-100">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Our values">
        {VALUES.map(({ icon: Icon, title, text }) => (
          <Card key={title}>
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-burgundy-50 text-burgundy-700 dark:bg-burgundy-900/40 dark:text-burgundy-200">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <h2 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">{title}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{text}</p>
          </Card>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" testId="about-how">
          <CardHeader icon={<CheckCircle2 className="h-4 w-4" aria-hidden />} title="How the playground works" />
          <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {[
              'Pick a module from the Testing Tools sidebar - each one focuses on a specific UI interaction pattern.',
              'Open the “Locators & frameworks” tab to copy a selector and the matching Playwright, Selenium or Cypress snippet.',
              'Write a test in your own framework against the running application (http://localhost:5173 by default).',
              'Tick the exercise buttons at the top of the module to track progress. Sync it to the API if you want it to survive a browser reset.',
            ].map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-burgundy-700 text-xs font-bold text-white">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </Card>

        <Card testId="about-cta">
          <CardHeader icon={<Users className="h-4 w-4" aria-hidden />} title="For teams" description="Onboarding exercises for new SDETs." />
          <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
            <li>• 15 modules mapped to real skills</li>
            <li>• Interview-ready locator strategies</li>
            <li>• A working REST API for API testing</li>
            <li>• No data leaves your machine</li>
          </ul>
          <Link to="/testing" className="mt-4 inline-flex w-full">
            <Button className="w-full" rightIcon={<ArrowRight className="h-4 w-4" aria-hidden />}>
              Start practicing
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
