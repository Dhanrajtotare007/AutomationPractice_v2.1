import { Link } from 'react-router-dom';
import { ArrowRight, Check, FlaskConical, Sparkles } from 'lucide-react';
import { BOOKS } from '@shared/content';
import { PRACTICE_MODULES } from '@shared/modules';
import { Button } from '@/components/ui/Button';
import { Badge, DifficultyBadge } from '@/components/ui/Badge';
import { BookCard } from '@/components/BookCard';
import { ModuleIcon } from '@/components/ModuleIcon';

const HIGHLIGHTS = [
  'Stable data-testid attributes on every control',
  'Semantic HTML with accessible roles and labels',
  'A real Express + SQLite API behind the table and forms',
  'Copy-ready locators for four framework setups',
];

export function HomePage() {
  return (
    <div className="space-y-8" data-testid="home-page">
      <section className="hero-grid overflow-hidden rounded-xl2 bg-burgundy-800 px-6 py-10 text-white shadow-lift sm:px-10 sm:py-14">
        <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Badge tone="info" className="bg-white/15 text-white">
              <Sparkles className="h-3 w-3" aria-hidden /> Practice environment · v1.0
            </Badge>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Learn UI automation by practising on a real, interactive app
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-burgundy-100 sm:text-base">
              QA Automation Labs gives you 15 hands-on testing modules, a documented locator catalogue and a working
              REST API. Automate it with Playwright, Selenium or Cypress exactly as you would in production.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link to="/testing">
                <Button size="lg" variant="secondary" rightIcon={<ArrowRight className="h-4 w-4" aria-hidden />}>
                  Open the playground
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:border-white hover:text-white">
                  How it works
                </Button>
              </Link>
            </div>
            <ul className="mt-6 grid gap-1.5 text-sm text-burgundy-100 sm:grid-cols-2">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl2 border border-white/15 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">Quick start</p>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-burgundy-950/60 p-3 font-mono text-[12px] leading-relaxed text-burgundy-100">
{`npm install
npm run dev

# then, in your framework:
await page.goto('/testing/checkbox')`}
            </pre>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              {['Playwright', 'Selenium', 'Cypress'].map((name) => (
                <div key={name} className="rounded-lg bg-white/10 px-2 py-2 text-[11px] font-semibold">
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="home-modules">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="home-modules" className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Practice modules
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Every module is fully interactive and automation ready.</p>
          </div>
          <Link to="/testing" className="inline-flex">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" aria-hidden />}>
              View dashboard
            </Button>
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {PRACTICE_MODULES.slice(0, 6).map((module) => (
            <Link
              key={module.slug}
              to={`/testing/${module.slug}`}
              className="surface group p-4 transition hover:border-burgundy-300 hover:shadow-lift dark:hover:border-burgundy-700"
            >
              <div className="flex items-start justify-between">
                <span className={`grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br ${module.accent}`}>
                  <ModuleIcon name={module.icon} className="h-5 w-5" />
                </span>
                <DifficultyBadge level={module.difficulty} />
              </div>
              <h3 className="mt-3 text-base font-bold text-slate-900 group-hover:text-burgundy-700 dark:text-white dark:group-hover:text-burgundy-300">
                {module.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{module.blurb}</p>
              <p className="mt-2 text-xs font-semibold text-cyan-600 dark:text-cyan-400">{module.exercises} exercises →</p>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="home-books">
        <div className="mb-4 flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-burgundy-700 dark:text-burgundy-300" aria-hidden />
          <h2 id="home-books" className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Recommended learning resources
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BOOKS.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
}
