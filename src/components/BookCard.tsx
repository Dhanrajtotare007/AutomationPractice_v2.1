import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, CheckCircle2, Circle, ShoppingCart } from 'lucide-react';
import type { BookResource } from '@shared/content';
import { cx } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export function BookCard({ book, onAddToCart }: { book: BookResource; onAddToCart?: () => void }) {
  const toast = useToast();
  const [saved, setSaved] = useState(false);

  return (
    <article
      className="surface group flex flex-col overflow-hidden transition hover:shadow-lift"
      data-testid={`book-card-${book.id}`}
    >
      <div className={cx('relative flex h-36 items-end justify-between bg-gradient-to-br p-4', book.coverFrom, book.coverTo)}>
        <div className="absolute right-3 top-3 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
          {book.tag}
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">QA Automation Labs</p>
          <h3 className="mt-1 max-w-[80%] text-base font-extrabold leading-tight text-white">{book.title}</h3>
        </div>
        <button
          type="button"
          onClick={() => {
            setSaved((current) => !current);
            toast.push({
              title: saved ? 'Removed from wishlist' : 'Saved to wishlist',
              description: book.title,
              kind: 'info',
              duration: 2500,
            });
          }}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${book.title} from wishlist` : `Save ${book.title} to wishlist`}
          data-testid={`book-wishlist-${book.id}`}
          className="relative z-10 grid h-8 w-8 place-items-center rounded-lg bg-white/20 text-white backdrop-blur transition hover:bg-white/30"
        >
          <Bookmark className={cx('h-4 w-4', saved && 'fill-white')} aria-hidden />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{book.author}</p>
        <p className="mt-1.5 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{book.summary}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-amber-600 dark:text-amber-400">★ {book.rating.toFixed(1)}</span>
          <span className="text-base font-extrabold text-slate-900 dark:text-white">${book.price}</span>
        </div>
        <div className="mt-3 flex gap-2">
          <Button
            size="sm"
            className="flex-1"
            leftIcon={<ShoppingCart className="h-3.5 w-3.5" aria-hidden />}
            onClick={() => {
              onAddToCart?.();
              toast.push({ title: 'Added to cart', description: `${book.title} · ${book.price}`, kind: 'success' });
            }}
            data-testid={`book-buy-${book.id}`}
          >
            Add to cart
          </Button>
          <Link to="/shop" className="inline-flex">
            <Button size="sm" variant="outline">
              Details
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ExerciseChecklist({
  items,
  isComplete,
  onToggle,
  testPrefix = 'exercise',
}: {
  items: { label: string }[];
  isComplete: (index: number) => boolean;
  onToggle: (index: number) => void;
  testPrefix?: string;
}) {
  const done = items.filter((_, index) => isComplete(index)).length;
  const toggle = useCallback((index: number) => onToggle(index), [onToggle]);

  return (
    <div className="surface p-4" data-testid={`${testPrefix}-checklist`}>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Exercise checklist</h2>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400" data-testid={`${testPrefix}-count`}>
          {done}/{items.length} complete
        </span>
      </div>
      <ul className="grid gap-1">
        {items.map((item, index) => {
          const checked = isComplete(index);
          return (
            <li key={item.label}>
              <label className="check-row cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-emerald-600"
                  checked={checked}
                  onChange={() => toggle(index)}
                  data-testid={`${testPrefix}-${index + 1}`}
                  aria-label={item.label}
                />
                <span className={cx('flex items-center gap-1.5', checked && 'text-slate-400 line-through dark:text-slate-500')}>
                  {checked ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden /> : <Circle className="h-3.5 w-3.5 text-slate-300" aria-hidden />}
                  {item.label}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
