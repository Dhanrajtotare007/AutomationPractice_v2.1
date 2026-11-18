/**
 * Locator practice system.
 *
 * For every documented element we render the locator expression together with
 * Playwright (JS + Python), Selenium (Python) and Cypress examples, plus a copy
 * button. A live "Run check" button evaluates the expression against the real
 * DOM so the documentation can never silently drift from the implementation.
 */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, CircleSlash, Filter, PlayCircle, Search, ShieldCheck, XCircle } from 'lucide-react';
import { LOCATORS } from '@shared/locators';
import { buildSnippets, playwrightExpression, moduleUrl, type LocatorCategory, type LocatorExample } from '@shared/locatorEngine';
import { PRACTICE_MODULES, getModule } from '@shared/modules';
import { cx } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { SearchInput } from '@/components/ui/SearchInput';

const STRATEGIES: LocatorCategory[] = ['ID', 'Name', 'Class', 'CSS', 'XPath', 'Text', 'Role', 'Placeholder', 'Label', 'Test ID'];

const FRAMEWORKS = [
  { key: 'playwrightJs', label: 'Playwright · JS' },
  { key: 'playwrightPy', label: 'Playwright · Python' },
  { key: 'seleniumPy', label: 'Selenium · Python' },
  { key: 'cypress', label: 'Cypress' },
] as const;

type FrameworkKey = (typeof FRAMEWORKS)[number]['key'];

export interface LocatorCheckResult {
  ok: boolean;
  message: string;
}

/**
 * Runs a catalogue expression against the live DOM.
 *
 * - Playwright's `getByTestId` pierces open shadow roots, so that strategy also
 *   searches inside shadow roots and reports where the match came from.
 * - Expressions documented inside a frame use that frame's document.
 */
export function evaluateLocator(example: LocatorExample): LocatorCheckResult {
  const selector = example.strategy === 'Test ID' ? '[data-testid="' + example.expression + '"]' : example.expression;
  const frameElement = example.before?.some((step) => step.includes('frameLocator'))
    ? document.querySelector('[data-testid="iframe-demo"]')
    : null;
  const scope = frameElement instanceof HTMLIFrameElement ? frameElement.contentDocument ?? document : document;

  /** Mirror of Playwright's deep query that pierces open (and nested) shadow roots. */
  const deepQuery = (root: Document | ShadowRoot, search: string): Element | null => {
    try {
      const direct = root.querySelector(search);
      if (direct) return direct;
      for (const host of Array.from(root.querySelectorAll('*'))) {
        if (!host.shadowRoot) continue;
        const inner = deepQuery(host.shadowRoot, search);
        if (inner) return inner;
      }
    } catch {
      return null;
    }
    return null;
  };

  try {
    const api = {
      getByTestId: (id: string) => deepQuery(scope, '[data-testid="' + id + '"]'),
      getByPlaceholder: (text: string) => scope.querySelector('[placeholder="' + text + '"]'),
      getByText: (text: string) =>
        Array.from(scope.querySelectorAll('button,a,span,p,label,h1,h2,h3')).find((node) => (node.textContent ?? '').trim().includes(text)) ??
        null,
      getByLabel: (text: string) => {
        const label = Array.from(scope.querySelectorAll('label')).find((node) => (node.textContent ?? '').trim().includes(text));
        if (!label) return null;
        const forId = label.getAttribute('for');
        return forId ? scope.getElementById(forId) : label.querySelector('input,select,textarea');
      },
      getByRole: (role: string) => scope.querySelector('[role="' + role + '"],' + role),
      locator: (sel: string) => {
        if (sel.startsWith('xpath=')) {
          try {
            const result = scope.evaluate(sel.slice(6), scope, null, 9, null);
            return result.singleNodeValue;
          } catch {
            return null;
          }
        }
        return deepQuery(scope, sel);
      },
    };

    // Locator expressions are authored in our own catalogue, never user supplied.
    // eslint-disable-next-line no-new-func
    const evaluate = new Function('page', 'return (' + playwrightExpression(example) + ');');
    const node = evaluate(api) as Element | null;
    if (!node) return { ok: false, message: 'No element matched - open the module page and try again.' };

    const root = node.getRootNode();
    if (typeof ShadowRoot !== 'undefined' && root instanceof ShadowRoot) {
      return { ok: true, message: 'Matches an element inside an open shadow root (Playwright pierces it automatically).' };
    }
    return { ok: true, message: 'Matches an element on this page.' };
  } catch (error) {
    return { ok: false, message: 'Could not evaluate: ' + (error as Error).message + ' (' + selector + ')' };
  }
}

function LocatorCard({ example }: { example: LocatorExample }) {
  const snippets = useMemo(() => buildSnippets(example), [example]);
  const [active, setActive] = useState<FrameworkKey>('playwrightJs');
  const [result, setResult] = useState<LocatorCheckResult | null>(null);
  const expression = playwrightExpression(example).replace(/^page\./, '');
  const module = getModule(example.module);

  return (
    <article className="surface overflow-hidden" data-testid={`locator-${example.key}`}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{example.description}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <Badge tone="info">{example.strategy}</Badge>
            {module ? <Badge tone="neutral">{module.title}</Badge> : null}
          </div>
        </div>
        <Link
          to={moduleUrl(example.module)}
          className="text-xs font-semibold text-burgundy-700 underline-offset-2 hover:underline dark:text-burgundy-300"
        >
          Open module →
        </Link>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Locator expression</p>
          <div className="flex flex-wrap items-center gap-2">
            <code
              className="flex-1 overflow-x-auto whitespace-pre rounded-lg bg-slate-900 px-3 py-2 font-mono text-[12.5px] text-cyan-200 dark:bg-slate-950"
              data-testid={`locator-expression-${example.key}`}
            >
              {expression}
            </code>
            <button
              type="button"
              onClick={() => setResult(evaluateLocator(example))}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-cyan-400 hover:text-cyan-700 dark:border-slate-700 dark:text-slate-200 dark:hover:text-cyan-300"
              data-testid={`locator-check-${example.key}`}
            >
              <PlayCircle className="h-3.5 w-3.5" aria-hidden /> Run check
            </button>
          </div>
          {result ? (
            <p
              className={cx(
                'mt-2 flex items-center gap-1.5 text-xs font-medium',
                result.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400',
              )}
              data-testid={`locator-check-result-${example.key}`}
              role="status"
            >
              {result.ok ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> : <XCircle className="h-3.5 w-3.5" aria-hidden />}
              {result.message}
            </p>
          ) : null}
          {example.before?.length ? (
            <p className="mt-2 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[11px] text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              Run before the locator: <span className="font-mono">{example.before.join(' · ')}</span>
            </p>
          ) : null}
          {example.notes ? <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">{example.notes}</p> : null}
        </div>

        <div>
          <div className="mb-1.5 flex flex-wrap gap-1" role="tablist" aria-label="Framework snippets">
            {FRAMEWORKS.map((fw) => (
              <button
                key={fw.key}
                type="button"
                role="tab"
                aria-selected={active === fw.key}
                onClick={() => setActive(fw.key)}
                className={cx(
                  'rounded-md px-2 py-1 text-[11px] font-semibold transition',
                  active === fw.key
                    ? 'bg-burgundy-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
                )}
              >
                {fw.label}
              </button>
            ))}
          </div>
          <CodeBlock
            code={snippets[active]}
            title={FRAMEWORKS.find((fw) => fw.key === active)?.label}
            testId={`locator-snippet-${example.key}`}
            copyTestId={`locator-copy-${example.key}`}
            maxHeight="max-h-64"
          />
          <details className="mt-2">
            <summary className="cursor-pointer text-[11px] font-semibold text-slate-500 hover:text-burgundy-700 dark:text-slate-400 dark:hover:text-white">
              Page object variant (Selenium)
            </summary>
            <CodeBlock code={snippets.pageObjectPy ?? ''} title="page_object.py" maxHeight="max-h-40" className="mt-1.5" />
          </details>
        </div>
      </div>
    </article>
  );
}

export function LocatorWorkbench({ moduleSlug }: { moduleSlug?: string }) {
  const [strategy, setStrategy] = useState<LocatorCategory | 'All'>('All');
  const [moduleFilter, setModuleFilter] = useState<string>(moduleSlug ?? 'All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      LOCATORS.filter((example) => {
        if (moduleSlug && example.module !== moduleSlug) return false;
        if (!moduleSlug && moduleFilter !== 'All' && example.module !== moduleFilter) return false;
        if (strategy !== 'All' && example.strategy !== strategy) return false;
        if (search.trim()) {
          const needle = search.trim().toLowerCase();
          return (
            example.description.toLowerCase().includes(needle) ||
            example.expression.toLowerCase().includes(needle) ||
            example.key.toLowerCase().includes(needle)
          );
        }
        return true;
      }),
    [moduleSlug, moduleFilter, strategy, search],
  );

  return (
    <Card testId="locator-workbench">
      <CardHeader
        icon={<ShieldCheck className="h-4 w-4" aria-hidden />}
        title="Locator practice"
        description="Every control in the playground is documented with automation locators. Copy a snippet or run a live DOM check."
        actions={
          <Badge tone="brand" testId="locator-count">
            {filtered.length} locators
          </Badge>
        }
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        {!moduleSlug ? (
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <Filter className="h-3.5 w-3.5" aria-hidden />
            <span className="sr-only">Filter by module</span>
            <select
              className="field h-9 w-auto py-1 text-xs"
              value={moduleFilter}
              onChange={(event) => setModuleFilter(event.target.value)}
              data-testid="locator-module-filter"
            >
              <option value="All">All modules</option>
              {PRACTICE_MODULES.map((module) => (
                <option key={module.slug} value={module.slug}>
                  {module.title}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <SearchInput value={search} onChange={setSearch} placeholder="Search locators…" className="lg:w-64" testId="locator-search" />
        <div className="flex flex-wrap gap-1" role="group" aria-label="Filter by locator strategy">
          {(['All', ...STRATEGIES] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setStrategy(item)}
              aria-pressed={strategy === item}
              data-testid={`locator-strategy-${item.toLowerCase().replace(/\s+/g, '-')}`}
              className={cx(
                'rounded-full border px-2.5 py-1 text-[11px] font-semibold transition',
                strategy === item
                  ? 'border-burgundy-700 bg-burgundy-700 text-white'
                  : 'border-slate-200 text-slate-600 hover:border-burgundy-300 hover:text-burgundy-700 dark:border-slate-700 dark:text-slate-300',
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center dark:border-slate-700" data-testid="locator-empty">
          <CircleSlash className="mx-auto h-6 w-6 text-slate-400" aria-hidden />
          <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">No locators match these filters</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Try a different strategy or clear the search.</p>
        </div>
      ) : (
        <div className="grid gap-3 xl:grid-cols-2">
          {filtered.map((example) => (
            <LocatorCard key={example.key} example={example} />
          ))}
        </div>
      )}

      <p className="mt-4 flex items-start gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
        <Search className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
        Tip: locator expressions come from the catalogue in <code className="font-mono">shared/locators.ts</code> and are verified
        against the live DOM both here and by the automated Playwright suite.
      </p>
    </Card>
  );
}
