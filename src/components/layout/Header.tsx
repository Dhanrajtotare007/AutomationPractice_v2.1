import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, Moon, Search, Sun, X, FlaskConical, ArrowRight } from 'lucide-react';
import { clsx } from '@/lib/clsx';
import { useTheme } from '@/lib/themeProvider';
import { PRIMARY_NAV, SECTION_PREFIXES } from '@/config/navigation';
import { Button } from '@/components/ui/Button';
import { Brand } from './Brand';

export function Header({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeMenus = useCallback(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, []);

  useEffect(() => {
    closeMenus();
  }, [location.pathname, closeMenus]);

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setOpenMenu(null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search');
    setMobileOpen(false);
  };

  const isSectionActive = (to: string, items?: typeof PRIMARY_NAV) => {
    if (to === '/') return location.pathname === '/';
    if (items?.some((child) => location.pathname === child.to || location.pathname.startsWith(`${child.to}/`))) return true;
    const match = SECTION_PREFIXES.find((item) => item.to === to);
    if (!match) return false;
    return location.pathname === match.prefix || location.pathname.startsWith(`${match.prefix}/`);
  };

  const renderNavItem = (item: (typeof PRIMARY_NAV)[number]) => {
    const active = isSectionActive(item.to, item.children);

    if (!item.children?.length) {
      return (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={clsx('nav-link', active && 'nav-link-active')}
          data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
          aria-current={active ? 'page' : undefined}
        >
          {item.label}
        </NavLink>
      );
    }

    const open = openMenu === item.label;
    return (
      <div key={item.label} className="relative" ref={openMenu === item.label ? dropdownRef : undefined}>
        <button
          type="button"
          className={clsx('nav-link', active && 'nav-link-active')}
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpenMenu(open ? null : item.label)}
          data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {item.label}
          <ChevronDown className={clsx('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} aria-hidden />
        </button>
        {open ? (
          <div
            role="menu"
            aria-label={item.label}
            className="absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2 animate-fade-in rounded-xl border border-slate-200 bg-white p-1.5 shadow-lift dark:border-white/10 dark:bg-navy-900"
          >
            {item.children.map((child) => (
              <Link
                key={child.to}
                to={child.to}
                role="menuitem"
                className="block rounded-lg px-3 py-2 transition hover:bg-slate-100 dark:hover:bg-white/10"
                onClick={() => setOpenMenu(null)}
                data-testid={`nav-child-${child.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <span className="block text-sm font-semibold text-navy-900 dark:text-white">{child.label}</span>
                <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{child.description}</span>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-navy-950/90">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-2 px-3 sm:px-5 lg:px-8">
        {onToggleSidebar ? (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Toggle lab navigation"
            data-testid="header-sidebar-toggle"
            onClick={onToggleSidebar}
          >
            <FlaskConical className="h-5 w-5" aria-hidden />
          </Button>
        ) : null}

        <Brand className="shrink-0" />

        <nav aria-label="Primary" className="ml-4 hidden flex-1 items-center gap-0.5 lg:flex">
          {PRIMARY_NAV.map((item) => renderNavItem(item))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 lg:gap-2">
          <form onSubmit={submitSearch} role="search" className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              type="search"
              name="q"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search labs…"
              aria-label="Search labs, locators and guides"
              data-testid="header-search-input"
              className="h-9 w-32 rounded-lg border border-slate-300 bg-white pl-8 pr-2 text-sm text-navy-900 placeholder:text-slate-400 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25 dark:border-white/15 dark:bg-white/5 dark:text-slate-100 xl:w-44"
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

          <Link to="/labs" className="hidden sm:inline-flex" data-testid="header-cta">
            <Button size="sm" className="h-9 px-3.5" rightIcon={<ArrowRight className="h-3.5 w-3.5" aria-hidden />}>
              Start Practicing
            </Button>
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
          className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-slate-200 bg-white px-3 pb-5 pt-3 shadow-lift lg:hidden dark:border-white/10 dark:bg-navy-950"
        >
          <form onSubmit={submitSearch} role="search" className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              type="search"
              name="q-mobile"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search labs…"
              aria-label="Search labs (mobile)"
              data-testid="mobile-search-input"
              className="field pl-9"
            />
          </form>

          <nav aria-label="Mobile" className="grid gap-1">
            {PRIMARY_NAV.map((item) => {
              const active = isSectionActive(item.to, item.children);
              return (
                <div key={item.label}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={clsx(
                      'flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition',
                      active
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10',
                    )}
                    data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {item.label}
                  </NavLink>
                  {item.children?.length ? (
                    <div className="ml-3 mt-1 grid gap-0.5 border-l border-slate-200 pl-3 dark:border-white/10">
                      {item.children
                        .filter((child) => child.to !== item.to)
                        .map((child) => (
                          <NavLink
                            key={child.to}
                            to={child.to}
                            onClick={() => setMobileOpen(false)}
                            className="rounded-md px-2 py-1.5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-100 hover:text-brand-700 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                            data-testid={`mobile-nav-child-${child.label.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            {child.label}
                          </NavLink>
                        ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <Link to="/labs" className="mt-3 block" onClick={() => setMobileOpen(false)}>
            <Button className="w-full" rightIcon={<ArrowRight className="h-4 w-4" aria-hidden />} data-testid="mobile-nav-cta">
              Start Practicing
            </Button>
          </Link>
        </div>
      ) : null}
    </header>
  );
}
