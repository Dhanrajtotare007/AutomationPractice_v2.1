import { useMemo, useState } from 'react';
import { Minus, Plus, ShoppingCart, Star, Trash2 } from 'lucide-react';
import { BOOKS } from '@shared/content';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, EmptyState } from '@/components/ui/Card';
import { BookCard } from '@/components/BookCard';
import { useNotify } from '@/components/ui/Toast';

const BUNDLES = [
  { id: 'starter', title: 'Starter bundle', price: 59, includes: ['Playwright in Action', 'Selenium with Python Workbook'], save: 9 },
  { id: 'complete', title: 'Complete automation library', price: 89, includes: BOOKS.map((book) => book.title), save: 13 },
];

export function ShopPage() {
  const notify = useNotify();
  const [cart, setCart] = useState<{ id: string; title: string; price: number; qty: number }[]>([]);
  const [query, setQuery] = useState('');

  const visibleBooks = useMemo(
    () => BOOKS.filter((book) => `${book.title} ${book.summary}`.toLowerCase().includes(query.trim().toLowerCase())),
    [query],
  );

  const addToCart = (id: string, title: string, price: number) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === id);
      if (existing) return current.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item));
      return [...current, { id, title, price, qty: 1 }];
    });
    notify.success('Added to cart', `${title} · $${price}`);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="space-y-5" data-testid="shop-page">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge tone="brand">Shop</Badge>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Books &amp; bundles</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Practise cart interactions: add, change quantity and remove items. Prices are placeholders for this demo — nothing
            is charged.
          </p>
        </div>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter products…"
          aria-label="Filter products"
          className="field max-w-xs"
          data-testid="shop-search"
        />
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" data-testid="shop-products">
            {visibleBooks.map((book) => (
              <BookCard key={book.id} book={book} onAddToCart={() => addToCart(book.id, book.title, book.price)} />
            ))}
            {visibleBooks.length === 0 ? (
              <div className="sm:col-span-2 xl:col-span-3">
                <EmptyState title="No products match your search" description="Try a different keyword." />
              </div>
            ) : null}
          </div>

          <Card testId="shop-bundles">
            <CardHeader title="Bundles" description="Save more when you buy the whole library." />
            <div className="grid gap-3 sm:grid-cols-2">
              {BUNDLES.map((bundle) => (
                <div key={bundle.id} className="surface-muted p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{bundle.title}</h3>
                    <Badge tone="success">save ${bundle.save}</Badge>
                  </div>
                  <ul className="mt-2 space-y-0.5 text-xs text-slate-600 dark:text-slate-300">
                    {bundle.includes.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-extrabold text-slate-900 dark:text-white">${bundle.price}</span>
                    <Button size="sm" onClick={() => addToCart(bundle.id, bundle.title, bundle.price)} data-testid={`bundle-add-${bundle.id}`}>
                      Add bundle
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card testId="shop-cart" className="h-fit lg:sticky lg:top-20">
          <CardHeader icon={<ShoppingCart className="h-4 w-4" aria-hidden />} title="Your cart" description={`${cart.length} line item(s)`} />
          {cart.length === 0 ? (
            <EmptyState icon={<ShoppingCart className="h-6 w-6" aria-hidden />} title="Your cart is empty" description="Add a book or bundle to get started." />
          ) : (
            <ul className="space-y-2" data-testid="shop-cart-list">
              {cart.map((item) => (
                <li key={item.id} className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-2 dark:border-slate-700" data-testid={`cart-item-${item.id}`} data-qty={item.qty}>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{item.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">${item.price} each</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.title}`}
                      onClick={() =>
                        setCart((current) =>
                          current.map((entry) => (entry.id === item.id ? { ...entry, qty: Math.max(1, entry.qty - 1) } : entry)),
                        )
                      }
                      className="grid h-6 w-6 place-items-center rounded border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                      data-testid={`cart-decrease-${item.id}`}
                    >
                      <Minus className="h-3 w-3" aria-hidden />
                    </button>
                    <span className="w-6 text-center text-xs font-bold" data-testid={`cart-qty-${item.id}`}>
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.title}`}
                      onClick={() => setCart((current) => current.map((entry) => (entry.id === item.id ? { ...entry, qty: entry.qty + 1 } : entry)))}
                      className="grid h-6 w-6 place-items-center rounded border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                      data-testid={`cart-increase-${item.id}`}
                    >
                      <Plus className="h-3 w-3" aria-hidden />
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${item.title}`}
                      onClick={() => setCart((current) => current.filter((entry) => entry.id !== item.id))}
                      className="ml-1 rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                      data-testid={`cart-remove-${item.id}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Total</span>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white" data-testid="cart-total">
                ${total}
              </span>
            </div>
            <Button
              className="mt-3 w-full"
              disabled={cart.length === 0}
              onClick={() => {
                notify.success('Checkout simulated', `Order total $${total}. No payment was taken.`);
                setCart([]);
              }}
              data-testid="cart-checkout"
            >
              Checkout
            </Button>
            <Button variant="ghost" className="mt-1.5 w-full" onClick={() => setCart([])} disabled={cart.length === 0} data-testid="cart-clear">
              Empty cart
            </Button>
          </div>
        </Card>
      </div>

      <Card testId="shop-reviews">
        <CardHeader icon={<Star className="h-4 w-4" aria-hidden />} title="Reader reviews" description="Verified purchases only." />
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { name: 'Ravi K.', text: 'The locator examples saved me hours — I copied them straight into our suite.' },
            { name: 'Julia M.', text: 'Best practice target I have found for teaching shadow DOM and iframes.' },
            { name: 'Sam O.', text: 'The API module means I can practise UI and API tests in one repo.' },
          ].map((review) => (
            <blockquote key={review.name} className="surface-muted p-3">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">★★★★★</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">“{review.text}”</p>
              <footer className="mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">— {review.name}</footer>
            </blockquote>
          ))}
        </div>
      </Card>
    </div>
  );
}
