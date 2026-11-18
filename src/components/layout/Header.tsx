import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Menu, Moon, Search, Sun, X, FlaskConical, ChevronDown } from 'lucide-react';
import { clsx } from '@/lib/clsx';
import { useTheme } from '@/lib/themeProvider';
import { PRIMARY_NAV, COMPACT_NAV } from '@/config/navigation';
import { Button } from '@/components/ui/Button';

export function Header({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const moreRef = useRef<HTMLDivElement>(null);
  const compactItems = COMPACT_NAV.slice(0, 6);

  const closeMenus = useCallback(() => {
    setMobileOpen(false);
    setMoreOpen(false);
  }, []);

  useEffect(() => {
    closeMenus();
  }, [location.pathname, closeMenus]);

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) setMoreOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search');
    setMobileOpen(false);
  };

  const renderLink = (item: { label: string; to: string }, compact = false) => {
    const testingActive = item.to === '/testing' && location.pathname.startsWith('/testing');
    return (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.to === '/'}
        className={({ isActive }) =>
          clsx(
            compact ? 'nav-link whitespace-nowrap text-[13px]' : 'nav-link',
            (isActive || testingActive) && 'nav-link-active',
            item.to === '/testing' && !testingActive && 'text-burgundy-700 dark:text-burgundy-300',
          )
        }
        data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
        aria-current={testingActive ? 'page' : undefined}
      >
        {item.label}
      </NavLink>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-3 sm:px-4 lg:px-6">
        {onToggleSidebar ? (
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            aria-label="Toggle testing tools sidebar"
            data-testid="header-sidebar-toggle"
            onClick={onToggleSidebar}
          >
            <FlaskConical className="h-5 w-5" aria-hidden />
          </Button>
        ) : null}

        <Link to="/" className="flex min-w-0 shrink items-center gap-2" aria-label="QA Automation Labs home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-burgundy-700 text-white shadow-sm">
            <FlaskConical className="h-5 w-5" aria-hidden />
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-extrabold tracking-tight text-slate-900 dark:text-white">
              QA Automation <span className="text-burgundy-700 dark:text-burgundy-300">Labs</span>
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-400 sm:block">
              Practice • Build • Automate
            </span>
          </span>
        </Link>

        <nav aria-label="Primary compact" className="ml-2 hidden min-w-0 flex-1 items-center gap-0.5 lg:flex xl:hidden">
          {compactItems.map((item) => renderLink(item, true))}
          <div className="relative" ref={moreRef}>
            <button
              type="button"
              className="nav-link"
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              onClick={() => setMoreOpen((open) => !open)}
              data-testid="nav-more"
            >
              More <ChevronDown className="h-3.5 w-3.5" aria-hidden />
            </button>
            {moreOpen ? (
              <div
                role="menu"
                className="absolute left-0 top-full mt-1 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-card dark:border-slate-800 dark:bg-slate-900"
              >
                {PRIMARY_NAV.filter((item) => !compactItems.some((compactItem) => compactItem.to === item.to)).map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    role="menuitem"
                    className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    onClick={() => setMoreOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            ) : null}
          </div>
        </nav>

        <nav aria-label="Primary" className="hidden min-w-0 flex-1 flex-wrap items-center justify-center gap-0.5 xl:flex">
          {PRIMARY_NAV.map((item) => renderLink(item))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <form onSubmit={submitSearch} role="search" className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              type="search"
              name="q"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the playground…"
              aria-label="Search the playground"
              data-testid="header-search-input"
              className="h-9 w-36 rounded-lg border border-slate-300 bg-white pl-8 pr-2 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 xl:w-52"
            />
            <button type="submit" className="sr-only">
              Search
            </button>
          </form>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={theme === 'dark'}
            data-testid="theme-toggle"
            className="h-9 w-9"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
          </Button>

          <Link
            to="/courses"
            className="hidden items-center gap-1.5 rounded-lg bg-burgundy-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-burgundy-800 2xl:inline-flex"
          >
            <BookOpen className="h-4 w-4" aria-hidden /> Start learning
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            data-testid="hamburger-menu"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </Button>
        </div>
      </div>

      {mobileOpen ? (
        <div
          id="mobile-menu"
          data-testid="mobile-menu"
          className="border-t border-slate-200 bg-white px-3 pb-4 pt-2 dark:border-slate-800 dark:bg-slate-950"
        >
          <form onSubmit={submitSearch} role="search" className="relative mb-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              type="search"
              name="q-mobile"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the playground…"
              aria-label="Search the playground (mobile)"
              data-testid="mobile-search-input"
              className="field pl-9"
            />
          </form>
          <nav aria-label="Mobile" className="grid gap-1">
            {PRIMARY_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    'rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                    isActive && 'bg-cyan-500/15 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300',
                  )
                }
                data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
