import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, PenLine, Tag } from 'lucide-react';
import { ARTICLES } from '@shared/content';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SearchInput } from '@/components/ui/SearchInput';
import { EmptyState } from '@/components/ui/Card';

export function BlogPage() {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('All');

  const tags = useMemo(() => ['All', ...new Set(ARTICLES.flatMap((article) => article.tags))], []);
  const visible = ARTICLES.filter((article) => {
    const matchesTag = tag === 'All' || article.tags.includes(tag);
    const needle = query.trim().toLowerCase();
    const matchesQuery = !needle || `${article.title} ${article.excerpt} ${article.tags.join(' ')}`.toLowerCase().includes(needle);
    return matchesTag && matchesQuery;
  });

  return (
    <div className="space-y-5" data-testid="blog-page">
      <header>
        <Badge tone="brand">Blog</Badge>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Automation notes from the field</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Practical guides on locators, waits, frameworks and CI. Written by the people who maintain the playground.
        </p>
      </header>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput value={query} onChange={setQuery} placeholder="Search articles…" className="sm:w-72" testId="blog-search" />
        <div className="flex flex-wrap gap-1" role="group" aria-label="Filter by tag">
          {tags.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTag(item)}
              aria-pressed={tag === item}
              data-testid={`blog-tag-${item.toLowerCase().replace(/\s+/g, '-')}`}
              className={
                tag === item
                  ? 'rounded-full bg-burgundy-700 px-2.5 py-1 text-[11px] font-bold text-white'
                  : 'rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:border-burgundy-300 dark:border-slate-700 dark:text-slate-300'
              }
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState title="No articles found" description="Try clearing the search or choosing another tag." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" data-testid="blog-list">
          {visible.map((article) => (
            <Card key={article.slug} className="flex flex-col" testId={`article-${article.slug}`}>
              <div className="flex flex-wrap gap-1">
                {article.tags.map((item) => (
                  <Badge key={item} tone="info" className="gap-1 text-[10px]">
                    <Tag className="h-2.5 w-2.5" aria-hidden /> {item}
                  </Badge>
                ))}
              </div>
              <h2 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                <Link to={`/blog/${article.slug}`} className="hover:text-burgundy-700 dark:hover:text-burgundy-300">
                  {article.title}
                </Link>
              </h2>
              <p className="mt-1 flex-1 text-sm text-slate-500 dark:text-slate-400">{article.excerpt}</p>
              <p className="mt-3 flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <PenLine className="h-3 w-3" aria-hidden /> {article.author}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" aria-hidden /> {article.minutes} min · {formatDate(article.date)}
                </span>
              </p>
              <Link
                to={`/blog/${article.slug}`}
                className="mt-2 text-xs font-bold text-burgundy-700 hover:underline dark:text-burgundy-300"
                data-testid={`article-read-${article.slug}`}
              >
                Read article →
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
