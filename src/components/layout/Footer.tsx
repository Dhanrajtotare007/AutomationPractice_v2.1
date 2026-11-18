import { Link } from 'react-router-dom';
import { FlaskConical, Github, Linkedin, Twitter, Youtube } from 'lucide-react';
import { PRIMARY_NAV } from '@/config/navigation';
import { PRACTICE_MODULES } from '@shared/modules';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-2 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto grid max-w-[1600px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-burgundy-700 text-white">
              <FlaskConical className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white">
              QA Automation <span className="text-burgundy-700 dark:text-burgundy-300">Labs</span>
            </span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-slate-500 dark:text-slate-400">
            A free playground for mastering web UI automation with Playwright, Selenium and Cypress. Practice on a
            realistic, deliberately automation-friendly application.
          </p>
          <div className="mt-4 flex gap-2">
            {[
              { icon: Github, label: 'GitHub' },
              { icon: Linkedin, label: 'LinkedIn' },
              { icon: Twitter, label: 'X / Twitter' },
              { icon: Youtube, label: 'YouTube' },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href={`https://example.com/qa-automation-labs?channel=${encodeURIComponent(label)}`}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-burgundy-300 hover:text-burgundy-700 dark:border-slate-700 dark:text-slate-400 dark:hover:border-burgundy-600 dark:hover:text-white"
              >
                <Icon className="h-4 w-4" aria-hidden />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer - pages">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Explore</h2>
          <ul className="mt-3 grid gap-1.5">
            {PRIMARY_NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-sm text-slate-600 transition hover:text-burgundy-700 dark:text-slate-400 dark:hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer - practice modules">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Practice modules</h2>
          <ul className="mt-3 grid gap-1.5">
            {PRACTICE_MODULES.slice(0, 10).map((module) => (
              <li key={module.slug}>
                <Link
                  to={`/testing/${module.slug}`}
                  className="text-sm text-slate-600 transition hover:text-burgundy-700 dark:text-slate-400 dark:hover:text-white"
                >
                  {module.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Built for automation</h2>
          <ul className="mt-3 grid gap-1.5 text-sm text-slate-600 dark:text-slate-400">
            <li>Stable <code className="font-mono text-[12px]">data-testid</code> attributes</li>
            <li>Accessible roles &amp; labels</li>
            <li>Predictable, deterministic UI</li>
            <li>Documented locator examples</li>
            <li>Real backend API with validation</li>
          </ul>
          <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
            The playground does not run Playwright/Selenium/Cypress in the browser - you automate it from your own
            framework.
          </p>
        </div>
      </div>
      <div className="border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">
        © {year} QA Automation Labs. A practice environment inspired by modern automation training platforms.
      </div>
    </footer>
  );
}
