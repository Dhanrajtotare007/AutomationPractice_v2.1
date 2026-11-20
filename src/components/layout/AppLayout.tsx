import { useCallback, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar, useSidebarCollapsed } from './Sidebar';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';
import { ErrorBoundary } from './ErrorBoundary';

export function AppLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { collapsed, toggle } = useSidebarCollapsed();
  const location = useLocation();
  // The lab navigator is available on the whole /labs section (directory + labs).
  const showSidebar = location.pathname === '/labs' || location.pathname.startsWith('/labs/');

  const toggleSidebar = useCallback(() => setMobileSidebarOpen((open) => !open), []);
  const closeSidebar = useCallback(() => setMobileSidebarOpen(false), []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-navy-950">
      <ScrollToTop />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>
      <Header onToggleSidebar={showSidebar ? toggleSidebar : undefined} />
      <div className="mx-auto flex w-full max-w-[1400px] flex-1">
        {showSidebar ? (
          <Sidebar open={mobileSidebarOpen} onClose={closeSidebar} collapsed={collapsed} onToggleCollapse={toggle} />
        ) : null}
        <main
          id="main-content"
          className="min-w-0 flex-1 px-3 py-6 sm:px-5 lg:px-8"
          data-testid="main-content"
          data-sidebar={showSidebar ? 'visible' : 'hidden'}
        >
          <ErrorBoundary resetKey={location.pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
      <Footer />
    </div>
  );
}
