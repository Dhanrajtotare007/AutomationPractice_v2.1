import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  Code2,
  Database,
  FileText,
  HelpCircle,
  Layers,
  Search,
  Sparkles,
  Terminal,
  Timer,
} from 'lucide-react';
import { PRACTICE_MODULES } from '@shared/modules';
import { PRACTICE_CATEGORIES, POPULAR_LABS, labsBySlug } from '@shared/practice';
import { ARTICLES, INTERVIEW_QUESTIONS } from '@shared/content';
import { LOCATORS } from '@shared/locators';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { EmptyState } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';

interface ResourceItem {
  title: string;
  description: string;
  to: string;
  kind: string;
  badge: string;
}

const GUIDE_TOPICS = [
  {
    icon: Code2,
    title: 'Locator strategy',
    text: 'Role first, then stable ids, then test ids. Learn the ladder that survives a redesign.',
    to: '/blog/locator-strategy-ladder',
  },
  {
    icon: Timer,
    title: 'Explicit waits',
    text: 'Replace sleeps with assertions that fail fast and explain themselves on CI.',
    to: '/blog/stop-using-sleeps',
  },
  {
    icon: Layers,
    title: 'Shadow DOM',
    text: 'Pierce open shadow roots in Playwright, Selenium and Cypress without brittle JS.',
    to: '/blog/shadow-dom-locators',
  },
  {
    icon: Database,
    title: 'API testing',
    text: 'Seed deterministic fixtures through a real REST API before the browser starts.',
    to: '/blog/api-testing-checklist',
  },
];

const FRAMEWORK_SNIPPETS = [
  {
    name: 'Playwright',
    language: 'TypeScript',
    accent: 'from-brand-500 to-brand-700',
    code: `await page.goto('/labs/webtable');
await page.getByRole('button', { name: 'Add employee' }).click();
await expect(page.getByTestId('employee-table')).toContainText('qa@example.com');`,
  },
  {
    name: 'Selenium',
    language: 'Python',
    accent: 'from-emerald-500 to-emerald-700',
    code: `driver.get(f'{BASE}/labs/webtable')
wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, '[data-testid="add-employee"]'))).click()
assert 'qa@example.com' in driver.find_element(By.CSS_SELECTOR, '[data-testid="employee-table"]').text`,
  },
  {
    name: 'Cypress',
    language: 'JavaScript',
    accent: 'from-accent-500 to-accent-700',
    code: `cy.visit('/labs/webtable')
cy.findByTestId('add-employee').click()
cy.findByTestId('employee-table').should('contain.text', 'qa@example.com')`,
  },
];

export function ResourcesPage() {
  const [query, setQuery] = useState('');

  const index = useMemo<ResourceItem[]>(() => {
    const articles: ResourceItem[] = ARTICLES.map((article) => ({
      title: article.title,
      description: article.excerpt,
      to: `/blog/${article.slug}`,
      kind: 'Guide',
      badge: `${article.minutes} min read`,
    }));

    const interviews: ResourceItem[] = INTERVIEW_QUESTIONS.map((question) => ({
      title: question.question,
      description: question.answer,
      to: '/interview-preparation',
      kind: 'Interview question',
      badge: question.category,
    }));

    const labs: ResourceItem[] = PRACTICE_MODULES.map((module) => ({
      title: `${module.title} practice lab`,
      description: module.blurb,
      to: `/labs/${module.slug}`,
      kind: 'Practice lab',
      badge: module.difficulty,
    }));

    const locators: ResourceItem[] = LOCATORS.slice(0, 40).map((locator) => ({
      title: locator.description,
      description: `${locator.strategy} · ${locator.expression}`,
      to: `/labs/${locator.module}`,
      kind: 'Locator',
      badge: locator.strategy,
    }));

    return [
      ...articles,
      { title: 'Practice REST API reference', description: 'Every endpoint, schema and example request on the platform.', to: '/api-docs', kind: 'Reference', badge: 'API' },
      ...interviews,
      ...labs,
      ...locators,
    ];
  }, []);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return index.filter((item) => `${item.title} ${item.description} ${item.kind} ${item.badge}`.toLowerCase().includes(needle)).slice(0, 30);
  }, [index, query]);

  return (
    <div className="space-y-8" data-testid="resources-page">
      <Breadcrumbs items={[{ label: 'Resources' }]} />

      <header>
        <Badge tone="brand">
          <BookOpen className="h-3 w-3" aria-hidden /> Learning resources
        </Badge>
        <h1 className="mt-2 text-2xl font-extrabold text-navy-900 sm:text-3xl dark:text-white">
          Guides, references and interview prep
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Everything on this platform in one place: {ARTICLES.length} automation guides, {INTERVIEW_QUESTIONS.length}{' '}
          interview questions, {LOCATORS.length} documented locators and the full API reference.
        </p>
      </header>

      <section aria-labelledby="resource-search" className="surface p-4">
        <h2 id="resource-search" className="sr-only">
          Search resources
        </h2>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search guides, locators, interview questions…"
          className="w-full"
          testId="resources-search"
        />
        {query.trim() ? (
          results.length === 0 ? (
            <div className="mt-3">
              <EmptyState
                title={`No resources match “${query.trim()}”`}
                description="Try a shorter term such as “iframe”, “xpath” or “waits”."
              />
            </div>
          ) : (
            <ul className="mt-3 grid gap-2" data-testid="resources-results">
              {results.map((item) => (
                <li key={`${item.kind}-${item.to}-${item.title}`}>
                  <Link
                    to={item.to}
                    className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 transition hover:border-brand-300 hover:bg-slate-50 dark:border-white/10 dark:hover:border-brand-400/60 dark:hover:bg-white/5"
                    data-testid="resource-result"
                  >
                    <Search className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-1.5">
                        <span className="text-sm font-semibold text-navy-900 dark:text-white">{item.title}</span>
                        <Badge tone="neutral">{item.kind}</Badge>
                        <Badge tone="info">{item.badge}</Badge>
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-xs text-slate-500 dark:text-slate-400">{item.description}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )
        ) : (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {index.length} resources indexed. Start typing to filter across guides, labs, locators and questions.
          </p>
        )}
      </section>

      <section aria-labelledby="guides-heading" data-testid="resources-guides">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="eyebrow">Automation guides</p>
            <h2 id="guides-heading" className="mt-1 text-xl font-extrabold text-navy-900 dark:text-white">
              Practical write-ups from real suites
            </h2>
          </div>
          <Link to="/blog">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" aria-hidden />}>
              All guides
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {GUIDE_TOPICS.map(({ icon: Icon, title, text, to }) => (
            <Link key={title} to={to} className="card-link">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-200">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-3 text-sm font-bold text-navy-900 dark:text-white">{title}</h3>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{text}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-brand-700 dark:text-brand-300">
                Read guide <ArrowRight className="h-3 w-3" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="snippets-heading" data-testid="resources-snippets">
        <div className="mb-4">
          <p className="eyebrow">Framework examples</p>
          <h2 id="snippets-heading" className="mt-1 text-xl font-extrabold text-navy-900 dark:text-white">
            The same task in three frameworks
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Adding an employee to the Web Table lab — identical intent, three different APIs. Every lab page also ships a
            full cheat-sheet with waits and assertions.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {FRAMEWORK_SNIPPETS.map((snippet) => (
            <article key={snippet.name} className="surface overflow-hidden">
              <div className={`flex items-center justify-between bg-gradient-to-r ${snippet.accent} px-4 py-2.5`}>
                <p className="text-sm font-bold text-white">{snippet.name}</p>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white">{snippet.language}</span>
              </div>
              <pre className="scrollbar-thin overflow-x-auto bg-navy-900 p-4 font-mono text-[11px] leading-relaxed text-slate-300">
                {snippet.code}
              </pre>
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="surface p-5 lg:col-span-2" aria-labelledby="articles-heading" data-testid="resources-articles">
          <div className="mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-brand-600 dark:text-brand-300" aria-hidden />
            <h2 id="articles-heading" className="section-title">
              Latest guides
            </h2>
          </div>
          <ul className="divide-y divide-slate-200 dark:divide-white/10">
            {ARTICLES.map((article) => (
              <li key={article.slug} className="py-2.5 first:pt-0 last:pb-0">
                <Link to={`/blog/${article.slug}`} className="group flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-navy-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">
                      {article.title}
                    </span>
                    <span className="mt-0.5 line-clamp-1 block text-xs text-slate-500 dark:text-slate-400">{article.excerpt}</span>
                  </span>
                  <span className="shrink-0 text-[11px] font-semibold text-slate-400">
                    {formatDate(article.date)} · {article.minutes} min
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="surface p-5" aria-labelledby="quick-links" data-testid="resources-quick">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent-600 dark:text-accent-300" aria-hidden />
            <h2 id="quick-links" className="section-title">
              Jump straight in
            </h2>
          </div>
          <ul className="grid gap-1.5">
            {[
              { icon: ClipboardList, label: 'All practice labs', to: '/labs', hint: `${PRACTICE_MODULES.length} labs` },
              { icon: HelpCircle, label: 'Interview questions', to: '/interview-preparation', hint: `${INTERVIEW_QUESTIONS.length} Q&A` },
              { icon: Database, label: 'API reference', to: '/api-docs', hint: 'REST console' },
              { icon: Terminal, label: 'Testing challenges', to: '/challenges', hint: 'Scenario briefs' },
            ].map(({ icon: Icon, label, to, hint }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-2 transition hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-navy-900 dark:text-white">{label}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{hint}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-labelledby="areas-index" data-testid="resources-areas">
        <div className="mb-4">
          <p className="eyebrow">Practice areas</p>
          <h2 id="areas-index" className="mt-1 text-xl font-extrabold text-navy-900 dark:text-white">
            Every category on the platform
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {PRACTICE_CATEGORIES.map((category) => {
            const labs = labsBySlug(category.labs);
            return (
              <div key={category.id} className="surface-muted p-4">
                <h3 className="text-sm font-bold text-navy-900 dark:text-white">{category.title}</h3>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {labs.map((lab) => (
                    <li key={lab.slug}>
                      <Link to={`/labs/${lab.slug}`} className="chip">
                        {lab.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/labs">
            <Button rightIcon={<ArrowRight className="h-4 w-4" aria-hidden />}>Explore Practice Labs</Button>
          </Link>
          <Link to="/challenges">
            <Button variant="outline">Try a challenge</Button>
          </Link>
        </div>
      </section>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Popular starting point:{' '}
        {labsBySlug(POPULAR_LABS)
          .slice(0, 3)
          .map((lab, index) => (
            <span key={lab.slug}>
              {index > 0 ? ', ' : ''}
              <Link to={`/labs/${lab.slug}`} className="font-semibold text-brand-700 hover:underline dark:text-brand-300">
                {lab.title}
              </Link>
            </span>
          ))}
        .
      </p>
    </div>
  );
}
