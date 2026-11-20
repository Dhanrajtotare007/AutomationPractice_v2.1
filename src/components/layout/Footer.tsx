import { Link } from 'react-router-dom';
import { FlaskConical, Github, Linkedin, Twitter } from 'lucide-react';
import { FOOTER_RESOURCES, FOOTER_SUPPORT } from '@/config/navigation';
import { PRACTICE_MODULES } from '@shared/modules';
import { BRAND, Brand } from './Brand';

const SOCIALS = [
  { icon: Github, label: 'GitHub', href: 'https://github.com' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com' },
  { icon: Twitter, label: 'X / Twitter', href: 'https://x.com' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-slate-200 bg-white dark:border-white/10 dark:bg-navy-950">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Brand tone="light" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              A free practice platform for automation testers. Work through interactive labs, real-world scenarios and
              graded challenges with Playwright, Selenium or Cypress.
            </p>
            <div className="mt-4 flex gap-2">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-brand-300 hover:text-brand-700 dark:border-white/10 dark:text-slate-400 dark:hover:border-brand-400 dark:hover:text-white"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer - practice labs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Practice Labs</h2>
            <ul className="mt-3 grid gap-1.5">
              {PRACTICE_MODULES.slice(0, 7).map((module) => (
                <li key={module.slug}>
                  <Link
                    to={`/labs/${module.slug}`}
                    className="text-sm text-slate-600 transition hover:text-brand-700 dark:text-slate-400 dark:hover:text-white"
                  >
                    {module.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/labs" className="text-sm font-semibold text-brand-700 transition hover:underline dark:text-brand-300">
                  All practice labs →
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Footer - resources">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Resources</h2>
            <ul className="mt-3 grid gap-1.5">
              {FOOTER_RESOURCES.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-slate-600 transition hover:text-brand-700 dark:text-slate-400 dark:hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer - platform">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Platform</h2>
            <ul className="mt-3 grid gap-1.5">
              {FOOTER_SUPPORT.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-slate-600 transition hover:text-brand-700 dark:text-slate-400 dark:hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
              <p className="flex items-center gap-1.5 text-xs font-bold text-navy-900 dark:text-white">
                <FlaskConical className="h-3.5 w-3.5 text-brand-600 dark:text-brand-300" aria-hidden /> Built for automation
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Stable test ids, accessible roles and predictable behaviour on every control.
              </p>
            </div>
          </nav>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-white/10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-2 px-4 py-4 text-center text-xs text-slate-500 sm:flex-row sm:text-left sm:px-6 lg:px-8 dark:text-slate-500">
          <p>
            © {year} {BRAND.name}. {BRAND.tagline}
          </p>
          <p className="text-[11px]">
            Free practice environment · progress is stored in your browser · no account required
          </p>
        </div>
      </div>
    </footer>
  );
}
