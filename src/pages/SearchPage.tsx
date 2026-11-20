import { useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SearchX } from 'lucide-react';
import { PRACTICE_MODULES } from '@shared/modules';
import { CHALLENGES, PRACTICE_CATEGORIES } from '@shared/practice';
import { LOCATORS } from '@shared/locators';
import { ARTICLES, INTERVIEW_QUESTIONS } from '@shared/content';
import { FOOTER_RESOURCES, PRIMARY_NAV } from '@/config/navigation';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SearchInput } from '@/components/ui/SearchInput';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { BRAND } from '@/components/layout/Brand';

interface SearchResult {
  title: string;
  description: string;
  to: string;
  kind: string;
}

function buildIndex(): SearchResult[] {
  const pages: SearchResult[] = [...PRIMARY_NAV, ...FOOTER_RESOURCES]
    .filter((item) => item.to !== '/search')
    .map((item) => ({ title: item.label, description: `Go to the ${item.label} page`, to: item.to, kind: 'Page' }));

  return [
    ...pages,
    ...PRACTICE_CATEGORIES.map((category) => ({
      title: category.title,
      description: category.summary,
      to: `/labs?category=${category.id}`,
      kind: 'Practice area',
    })),
    ...PRACTICE_MODULES.map((module) => ({
      title: `${module.title} practice lab`,
      description: module.blurb,
      to: `/labs/${module.slug}`,
      kind: `Lab · ${module.difficulty}`,
    })),
    ...CHALLENGES.map((challenge) => ({
      title: challenge.title,
      description: `${challenge.scenario} ${challenge.objective}`,
      to: `/challenges?level=${challenge.level}`,
      kind: `Challenge · ${challenge.level}`,
    })),
    ...LOCATORS.map((locator) => ({
      title: locator.description,
      description: `${locator.strategy} locator · ${locator.expression}`,
      to: `/labs/${locator.module}`,
      kind: 'Locator',
    })),
    ...ARTICLES.map((article) => ({ title: article.title, description: article.excerpt, to: `/blog/${article.slug}`, kind: 'Guide' })),
    ...INTERVIEW_QUESTIONS.map((question) => ({
      title: question.question,
      description: question.answer,
      to: '/interview-preparation',
      kind: `Interview · ${question.category}`,
    })),
  ];
}

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const index = useMemo<SearchResult[]>(() => buildIndex(), []);

  useEffect(() => {
    document.title = query ? `Search: ${query} | ${BRAND.name}` : `Search | ${BRAND.name}`;
  }, [query]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return index.filter((item) => `${item.title} ${item.description} ${item.kind}`.toLowerCase().includes(needle)).slice(0, 40);
  }, [index, query]);

  return (
    <div className="mx-auto max-w-3xl space-y-4" data-testid="search-page">
      <Breadcrumbs items={[{ label: 'Search' }]} />
      <header>
        <Badge tone="brand">Search</Badge>
        <h1 className="mt-2 text-2xl font-extrabold text-navy-900 dark:text-white">Search the platform</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Labs, practice areas, challenges, locators, guides and interview questions — {index.length} entries indexed.
        </p>
      </header>

      <SearchInput
        value={query}
        onChange={(value) => setParams(value ? { q: value } : {})}
        placeholder="Try “shadow dom”, “xpath”, “waits”…"
        autoFocus
        testId="search-page-input"
      />

      {!query.trim() ? (
        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400">Type a search term to see matching content.</p>
        </Card>
      ) : results.length === 0 ? (
        <Card className="text-center" testId="search-empty">
          <SearchX className="mx-auto h-8 w-8 text-slate-400" aria-hidden />
          <p className="mt-2 text-sm font-semibold text-navy-800 dark:text-slate-200">No results for “{query}”</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Try a shorter term such as “iframe” or “locator”.</p>
        </Card>
      ) : (
        <ul className="space-y-2" data-testid="search-results">
          {results.map((result) => (
            <li key={`${result.to}-${result.title}`}>
              <Link
                to={result.to}
                className="surface flex items-start gap-3 p-3 transition hover:border-brand-300 dark:hover:border-brand-400/60"
                data-testid="search-result"
              >
                <Search className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className="text-sm font-semibold text-navy-900 dark:text-white">{result.title}</span>
                    <Badge tone="neutral">{result.kind}</Badge>
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-xs text-slate-500 dark:text-slate-400">{result.description}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
