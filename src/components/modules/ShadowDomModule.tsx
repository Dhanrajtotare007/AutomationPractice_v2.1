import { useEffect, useState } from 'react';
import { Layers, Plus, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import { OutputPanel, PracticeGrid } from './PracticeGrid';
import { ShadowReactHost } from './ShadowReactHost';
import { ShadowReactWidget } from './ShadowReactWidget';

/* ─────────────── Web components with open shadow roots ─────────────── */

class QaShadowCard extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>
        :host { display: block; font-family: Inter, system-ui, sans-serif; }
        .box { border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; background: #ffffff; color: #1e293b; }
        h3 { margin: 0 0 4px; font-size: 14px; }
        p { margin: 0 0 10px; font-size: 12.5px; color: #64748b; }
        code { font-family: ui-monospace, monospace; font-size: 11.5px; background: #f1f5f9; padding: 1px 4px; border-radius: 4px; }
        label { display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px; }
        input { width: 100%; padding: 8px 10px; border-radius: 8px; border: 1px solid #cbd5e1; font: inherit; box-sizing: border-box; }
        input:focus { outline: 2px solid #06b6d4; outline-offset: 1px; }
        button { margin-top: 10px; padding: 8px 14px; border: 0; border-radius: 8px; background: #8f1f3a; color: #fff; font-weight: 700; cursor: pointer; }
        button:focus-visible { outline: 2px solid #06b6d4; outline-offset: 2px; }
        .out { margin-top: 8px; font-size: 12.5px; font-weight: 600; color: #059669; min-height: 18px; }
      </style>
      <div class="box">
        <h3>Open Shadow DOM component</h3>
        <p>These controls live inside <code>#shadow-root (open)</code>, outside the light DOM.</p>
        <label for="inner-input">Value</label>
        <input id="inner-input" data-testid="shadow-input" placeholder="Type inside the shadow root" aria-label="Shadow input" />
        <button id="inner-button" data-testid="shadow-button" type="button">Shadow button</button>
        <div class="out" id="inner-output" data-testid="shadow-output" aria-live="polite"></div>
      </div>
    `;
    const input = root.getElementById('inner-input') as HTMLInputElement | null;
    const output = root.getElementById('inner-output');
    const send = (value: string) => {
      if (output) output.textContent = value ? `Clicked with: ${value}` : 'Clicked with an empty value';
      this.dispatchEvent(new CustomEvent('qa-shadow-click', { bubbles: true, composed: true, detail: value }));
    };
    root.getElementById('inner-button')?.addEventListener('click', () => send(input?.value ?? ''));
    this.qaSend = send;
  }

  /** Exposed so the page can drive the component from the light DOM. */
  qaSend?: (value: string) => void;
}

class QaNestedShadow extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const outer = this.attachShadow({ mode: 'open' });
    outer.innerHTML = `
      <style>
        :host { display:block; font-family: Inter, system-ui, sans-serif; }
        .outer { border: 1px dashed #cbd5e1; border-radius: 12px; padding: 12px; background: #f8fafc; color: #1e293b; }
        .label { font-size: 12px; font-weight: 700; color: #8f1f3a; margin-bottom: 8px; }
      </style>
      <div class="outer"><div class="label">Outer shadow root</div><qa-nested-inner></qa-nested-inner></div>
    `;
  }
}

class QaNestedInner extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const inner = this.attachShadow({ mode: 'open' });
    inner.innerHTML = `
      <style>
        .inner { border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; background: #ffffff; color: #1e293b; }
        p { margin: 0 0 8px; font-size: 12px; color: #64748b; }
        button { padding: 6px 12px; border-radius: 8px; border: 0; background: #0891b2; color: #fff; font-weight: 700; cursor: pointer; }
        .out { margin-top: 6px; font-size: 12px; font-weight: 600; color: #0891b2; }
      </style>
      <div class="inner">
        <p>Second level shadow root (nested component).</p>
        <button type="button" data-testid="shadow-nested-button">Nested shadow button</button>
        <div class="out" data-testid="shadow-nested-output" aria-live="polite"></div>
      </div>
    `;
    const out = inner.querySelector('[data-testid="shadow-nested-output"]') as HTMLElement | null;
    inner.querySelector('[data-testid="shadow-nested-button"]')?.addEventListener('click', () => {
      if (!out) return;
      const next = (Number(out.dataset.count) || 0) + 1;
      out.dataset.count = String(next);
      out.textContent = `Nested clicks: ${next}`;
    });
  }
}

interface QaShadowCardElement extends HTMLElement {
  qaSend?: (value: string) => void;
}

const register = (name: string, ctor: CustomElementConstructor) => {
  if (typeof window !== 'undefined' && !customElements.get(name)) customElements.define(name, ctor);
};

register('qa-shadow-card', QaShadowCard);
register('qa-nested-shadow', QaNestedShadow);
register('qa-nested-inner', QaNestedInner);

export function ShadowDomModule() {
  const [events, setEvents] = useState<string[]>([]);
  const [typed, setTyped] = useState('');
  const log = (message: string) => setEvents((current) => [message, ...current].slice(0, 5));

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = String((event as CustomEvent<string>).detail ?? '');
      log(`Custom event from shadow root · value="${detail}"`);
    };
    document.addEventListener('qa-shadow-click', handler);
    return () => document.removeEventListener('qa-shadow-click', handler);
  }, []);

  const sendFromLightDom = () => {
    const host = document.querySelector('qa-shadow-card') as QaShadowCardElement | null;
    if (host?.qaSend) host.qaSend(typed);
    log(`Light DOM drove the component with "${typed}"`);
  };

  return (
    <PracticeGrid
      aside={
        <>
          <Card testId="shadow-events">
            <CardHeader title="Composed events" description="Events that cross the shadow boundary." />
            {events.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">Interact with the components to see events.</p>
            ) : (
              <ul className="space-y-1 text-xs" data-testid="shadow-event-log">
                {events.map((event, index) => (
                  <li key={`${event}-${index}`} className="rounded-md bg-slate-100 px-2 py-1 dark:bg-slate-800">
                    {event}
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <OutputPanel title="Locator notes" tone="info">
            <ul className="list-disc space-y-1 pl-4 text-xs">
              <li>Playwright pierces open shadow DOM automatically with <code className="font-mono">getByTestId</code>.</li>
              <li>Selenium: <code className="font-mono">element.shadow_root.find_element(...)</code>.</li>
              <li>Closed shadow roots cannot be automated - only open roots are exposed.</li>
            </ul>
          </OutputPanel>
        </>
      }
    >
      <Card testId="shadow-open">
        <CardHeader
          icon={<Layers className="h-4 w-4" aria-hidden />}
          title="Open shadow DOM (web component)"
          description="Custom elements with open shadow roots, including a live input and button."
          actions={<Badge tone="brand">customElements.define</Badge>}
        />
        <qa-shadow-card />
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <label className="block max-w-xs flex-1">
            <span className="label">Drive the component from the light DOM</span>
            <input
              className="field"
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
              placeholder="Value passed into the shadow root"
              data-testid="shadow-light-input"
            />
          </label>
          <button type="button" className="btn" hidden aria-hidden />
          <button
            type="button"
            onClick={sendFromLightDom}
            className="inline-flex h-10 items-center rounded-lg bg-brand-700 px-4 text-sm font-semibold text-white transition hover:bg-brand-800"
            data-testid="shadow-light-send"
          >
            Send value
          </button>
        </div>
      </Card>

      <Card testId="shadow-nested">
        <CardHeader
          icon={<Layers className="h-4 w-4" aria-hidden />}
          title="Nested shadow roots"
          description="A component rendered inside another component - two shadow levels deep."
        />
        <qa-nested-shadow />
      </Card>

      <Card testId="shadow-react-card">
        <CardHeader
          icon={<Sparkles className="h-4 w-4" aria-hidden />}
          title="React inside Shadow DOM"
          description="A React tree mounted through createRoot into an attached shadow root."
        />
        <ShadowReactHost widgetTestId="shadow-react-host" mount={(root) => root.render(<ShadowReactWidget onEvent={log} />)} />
        <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Plus className="h-3.5 w-3.5" aria-hidden /> Try{' '}
          <code className="font-mono">page.getByTestId(&quot;shadow-react-increment&quot;)</code>
        </p>
      </Card>
    </PracticeGrid>
  );
}
