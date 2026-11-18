import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SearchX } from 'lucide-react';
import { PRACTICE_MODULES } from '@shared/modules';
import { LOCATORS } from '@shared/locators';
import { ARTICLES, COURSES, BOOKS, EVENTS, INTERVIEW_QUESTIONS } from '@shared/content';
import { PRIMARY_NAV } from '@/config/navigation';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SearchInput } from '@/components/ui/SearchInput';

interface SearchResult {
  title: string;
  description: string;
  to: string;
  kind: string;
}

function buildIndex(): SearchResult[] {
  return [
    ...PRIMARY_NAV.map((item) => ({ title: item.label, description: `Go to the ${item.label} page`, to: item.to, kind: 'Page' })),
    ...PRACTICE_MODULES.map((module) => ({
      title: `${module.title} practice module`,
      description: module.blurb,
      to: `/testing/${module.slug}`,
      kind: `Module · ${module.difficulty}`,
    })),
    ...LOCATORS.map((locator) => ({
      title: locator.description,
      description: `${locator.strategy} locator · ${locator.expression}`,
      to: `/testing/${locator.module}`,
      kind: 'Locator',
    })),
    ...COURSES.map((course) => ({ title: course.title, description: course.summary, to: '/courses', kind: `Course · ${course.level}` })),
    ...EVENTS.map((event) => ({ title: event.title, description: event.summary, to: '/events', kind: 'Event' })),
    ...BOOKS.map((book) => ({ title: book.title, description: book.summary, to: '/shop', kind: 'Book' })),
    ...ARTICLES.map((article) => ({ title: article.title, description: article.excerpt, to: `/blog/${article.slug}`, kind: 'Article' })),
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

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return index
      .filter((item) => `${item.title} ${item.description} ${item.kind}`.toLowerCase().includes(needle))
      .slice(0, 40);
  }, [index, query]);

  return (
    <div className="mx-auto max-w-3xl space-y-4" data-testid="search-page">
      <header>
        <Badge tone="brand">Search</Badge>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Search the playground</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Modules, locators, courses, articles and interview questions — {index.length} entries indexed.
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
          <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">No results for “{query}”</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Try a shorter term such as “iframe” or “locator”.</p>
        </Card>
      ) : (
        <ul className="space-y-2" data-testid="search-results">
          {results.map((result) => (
            <li key={`${result.to}-${result.title}`}>
              <Link
                to={result.to}
                className="surface flex items-start gap-3 p-3 transition hover:border-burgundy-300 dark:hover:border-burgundy-700"
                data-testid="search-result"
              >
                <Search className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{result.title}</span>
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
