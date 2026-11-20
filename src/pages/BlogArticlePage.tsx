import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, PenLine } from 'lucide-react';
import { ARTICLES } from '@shared/content';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { BRAND } from '@/components/layout/Brand';
import { NotFound } from './NotFound';

export function BlogArticlePage() {
  const { slug = '' } = useParams();
  const article = ARTICLES.find((item) => item.slug === slug);

  useEffect(() => {
    if (article) document.title = `${article.title} | ${BRAND.name}`;
    return () => {
      document.title = `${BRAND.name} | Learn by Automating`;
    };
  }, [article]);

  if (!article) return <NotFound />;

  const related = ARTICLES.filter((item) => item.slug !== slug).slice(0, 2);

  return (
    <article className="mx-auto max-w-3xl space-y-4" data-testid="blog-article">
      <Breadcrumbs items={[{ label: 'Resources', to: '/resources' }, { label: 'Guides', to: '/blog' }, { label: article.title }]} />

      <Link to="/blog" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline dark:text-brand-300">
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> All guides
      </Link>
      <header>
        <div className="flex flex-wrap gap-1">
          {article.tags.map((tag) => (
            <Badge key={tag} tone="info">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight text-navy-900 dark:text-white">{article.title}</h1>
        <p className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <PenLine className="h-3 w-3" aria-hidden /> {article.author}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden /> {article.minutes} min read
          </span>
          <span>{formatDate(article.date)}</span>
        </p>
      </header>
      <Card className="prose-qa">
        <p className="text-base text-navy-800 dark:text-slate-200">{article.excerpt}</p>
        {article.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </Card>
      <div className="flex flex-wrap gap-2">
        <Link to="/labs">
          <Button size="sm" rightIcon={<ArrowLeft className="h-3.5 w-3.5 rotate-180" aria-hidden />}>
            Practise this in a lab
          </Button>
        </Link>
        <Link to="/resources">
          <Button size="sm" variant="outline">
            More resources
          </Button>
        </Link>
      </div>
      <section aria-label="Related guides">
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Keep reading</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {related.map((item) => (
            <Card key={item.slug}>
              <h3 className="text-sm font-bold text-navy-900 dark:text-white">{item.title}</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.excerpt}</p>
              <Link to={`/blog/${item.slug}`} className="mt-2 inline-flex">
                <Button size="sm" variant="outline">
                  Read
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </article>
  );
}
