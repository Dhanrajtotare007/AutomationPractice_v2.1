import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, PenLine, Tag } from 'lucide-react';
import { ARTICLES } from '@shared/content';
import { formatDate, cx } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Card, EmptyState } from '@/components/ui/Card';
import { SearchInput } from '@/components/ui/SearchInput';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { BRAND } from '@/components/layout/Brand';

export function BlogPage() {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('All');

  useEffect(() => {
    document.title = `Automation Guides | ${BRAND.name}`;
    return () => {
      document.title = `${BRAND.name} | Learn by Automating`;
    };
  }, []);

  const tags = useMemo(() => ['All', ...new Set(ARTICLES.flatMap((article) => article.tags))], []);
  const visible = ARTICLES.filter((article) => {
    const matchesTag = tag === 'All' || article.tags.includes(tag);
    const needle = query.trim().toLowerCase();
    const matchesQuery = !needle || `${article.title} ${article.excerpt} ${article.tags.join(' ')}`.toLowerCase().includes(needle);
    return matchesTag && matchesQuery;
  });

  return (
    <div className="space-y-5" data-testid="blog-page">
      <Breadcrumbs items={[{ label: 'Resources', to: '/resources' }, { label: 'Automation guides' }]} />

      <header>
        <Badge tone="brand">Automation guides</Badge>
        <h1 className="mt-2 text-2xl font-extrabold text-navy-900 sm:text-3xl dark:text-white">
          Automation notes from the field
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          Practical guides on locators, waits, frameworks and CI — written by the people who maintain the practice labs.
        </p>
      </header>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput value={query} onChange={setQuery} placeholder="Search guides…" className="sm:w-72" testId="blog-search" />
        <div className="flex flex-wrap gap-1" role="group" aria-label="Filter by tag">
          {tags.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTag(item)}
              aria-pressed={tag === item}
              data-testid={`blog-tag-${item.toLowerCase().replace(/\s+/g, '-')}`}
              className={cx('chip', tag === item && 'chip-active')}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState title="No guides found" description="Try clearing the search or choosing another tag." />
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
              <h2 className="mt-2 text-base font-bold text-navy-900 dark:text-white">
                <Link to={`/blog/${article.slug}`} className="hover:text-brand-700 dark:hover:text-brand-300">
                  {article.title}
                </Link>
              </h2>
              <p className="mt-1 flex-1 text-sm text-slate-600 dark:text-slate-400">{article.excerpt}</p>
              <p className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <PenLine className="h-3 w-3" aria-hidden /> {article.author}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" aria-hidden /> {article.minutes} min · {formatDate(article.date)}
                </span>
              </p>
              <Link
                to={`/blog/${article.slug}`}
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline dark:text-brand-300"
                data-testid={`article-read-${article.slug}`}
              >
                Read guide <ArrowRight className="h-3 w-3" aria-hidden />
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
