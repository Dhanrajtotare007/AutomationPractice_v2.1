import { useRef, useState } from 'react';
import { MousePointer2, MousePointerClick, Move3d, Pointer, Timer } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { OutputPanel, PracticeGrid } from './PracticeGrid';
import { cx } from '@/lib/utils';

interface ActionLog {
  id: number;
  action: string;
  detail: string;
  at: string;
}

export function MouseModule() {
  const [counts, setCounts] = useState({ click: 0, dblclick: 0, rightclick: 0, hover: 0, contextMenu: null as string | null });
  const [log, setLog] = useState<ActionLog[]>([]);
  const [position, setPosition] = useState({ x: 0, y: 0, inside: false });
  const [holdMs, setHoldMs] = useState<number | null>(null);
  const holdStarted = useRef<number | null>(null);
  const [holding, setHolding] = useState(false);
  const [dragging, setDragging] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);
  const counter = useRef(0);

  const record = (action: string, detail: string) => {
    counter.current += 1;
    setLog((current) =>
      [{ id: counter.current, action, detail, at: new Date().toLocaleTimeString() }, ...current].slice(0, 8),
    );
  };

  const startHold = () => {
    holdStarted.current = Date.now();
    setHolding(true);
    setHoldMs(null);
    record('mousedown', 'Click and hold started');
  };

  const endHold = () => {
    if (holdStarted.current === null) return;
    const duration = Date.now() - holdStarted.current;
    holdStarted.current = null;
    setHolding(false);
    setHoldMs(duration);
    record('mouseup', `Held for ${duration} ms`);
  };

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition({ x: Math.round(event.clientX - rect.left), y: Math.round(event.clientY - rect.top), inside: true });
  };

  return (
    <PracticeGrid
      aside={
        <>
          <OutputPanel title="Action log" tone="info" testId="mouse-log">
            {log.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">Perform a mouse action to record it.</p>
            ) : (
              <ul className="space-y-1 text-xs" data-testid="mouse-log-list">
                {log.map((entry) => (
                  <li key={entry.id} className="flex items-center gap-2 rounded-md bg-white/70 px-2 py-1 dark:bg-slate-900/60">
                    <code className="font-mono text-[10px] font-bold uppercase text-burgundy-700 dark:text-burgundy-300">{entry.action}</code>
                    <span className="min-w-0 flex-1 truncate">{entry.detail}</span>
                    <span className="text-slate-400">{entry.at}</span>
                  </li>
                ))}
              </ul>
            )}
          </OutputPanel>
          <Card testId="mouse-counters">
            <CardHeader title="Event counters" description="Verify with assertions on data attributes." />
            <ul className="space-y-1 text-sm">
              {[
                ['click', counts.click],
                ['dblclick', counts.dblclick],
                ['rightclick', counts.rightclick],
                ['hover', counts.hover],
              ].map(([label, value]) => (
                <li key={String(label)} className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">{String(label)}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100" data-testid={`mouse-count-${label}`}>
                    {String(value)}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </>
      }
    >
      <Card testId="mouse-actions">
        <CardHeader
          icon={<MousePointer2 className="h-4 w-4" aria-hidden />}
          title="Click, double click and right click"
          description="Each target exposes a data attribute that automation can assert on."
          actions={<Badge tone="brand">mouse events</Badge>}
        />

        <div className="grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            data-testid="mouse-click-target"
            data-clicks={counts.click}
            onClick={() => {
              setCounts((current) => ({ ...current, click: current.click + 1 }));
              record('click', 'Single click');
            }}
            className="grid h-24 place-items-center rounded-xl border-2 border-dashed border-burgundy-300 bg-burgundy-50/60 text-sm font-bold text-burgundy-800 transition hover:border-burgundy-500 hover:bg-burgundy-100 dark:border-burgundy-800 dark:bg-burgundy-950/40 dark:text-burgundy-100"
          >
            <span className="flex flex-col items-center gap-1">
              <MousePointerClick className="h-5 w-5" aria-hidden />
              Single click
              <span className="text-[11px] font-medium opacity-80">clicks: {counts.click}</span>
            </span>
          </button>

          <button
            type="button"
            data-testid="mouse-dblclick-target"
            data-dblclicks={counts.dblclick}
            onDoubleClick={() => {
              setCounts((current) => ({ ...current, dblclick: current.dblclick + 1 }));
              record('dblclick', 'Double click');
            }}
            onClick={() => record('click', 'Click on the double-click target')}
            className="grid h-24 place-items-center rounded-xl border-2 border-dashed border-cyan-300 bg-cyan-50/60 text-sm font-bold text-cyan-800 transition hover:border-cyan-500 hover:bg-cyan-100 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-100"
          >
            <span className="flex flex-col items-center gap-1">
              <MousePointerClick className="h-5 w-5" aria-hidden />
              Double click
              <span className="text-[11px] font-medium opacity-80">doubles: {counts.dblclick}</span>
            </span>
          </button>

          <button
            type="button"
            data-testid="mouse-rightclick-target"
            data-rightclicks={counts.rightclick}
            onContextMenu={(event) => {
              event.preventDefault();
              setCounts((current) => ({ ...current, rightclick: current.rightclick + 1, contextMenu: 'opened' }));
              record('contextmenu', 'Right click');
            }}
            className="grid h-24 place-items-center rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/60 text-sm font-bold text-amber-800 transition hover:border-amber-500 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100"
          >
            <span className="flex flex-col items-center gap-1">
              <Pointer className="h-5 w-5" aria-hidden />
              Right click
              <span className="text-[11px] font-medium opacity-80">rights: {counts.rightclick}</span>
            </span>
          </button>
        </div>

        {counts.contextMenu ? (
          <p className="mt-2 text-xs font-semibold text-amber-700 dark:text-amber-300" data-testid="mouse-context-message">
            Context menu was triggered ({counts.rightclick}×) — the browser menu is suppressed for practice.
          </p>
        ) : null}
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card testId="mouse-hover-card">
          <CardHeader title="Hover" description="Hover the box to reveal a hidden action." />
          <div
            data-testid="mouse-hover-target"
            data-hovers={counts.hover}
            onMouseEnter={() => {
              setCounts((current) => ({ ...current, hover: current.hover + 1 }));
              record('mouseenter', 'Hovered the hover target');
            }}
            className="group relative grid h-32 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-600 transition hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <span className="transition group-hover:opacity-0">Hover me</span>
            <span className="absolute inset-0 hidden items-center justify-center gap-2 text-burgundy-700 group-hover:flex dark:text-burgundy-300" data-testid="mouse-hover-reveal">
              <Pointer className="h-4 w-4" aria-hidden /> Hover detected!
            </span>
          </div>
          <p className="help">hover count: {counts.hover}</p>
        </Card>

        <Card testId="mouse-hold-card">
          <CardHeader title="Click and hold" description="Press and keep the button down, then release." />
          <button
            type="button"
            data-testid="mouse-hold-target"
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={() => holding && endHold()}
            className={cx(
              'grid h-32 w-full place-items-center rounded-xl border-2 border-dashed text-sm font-semibold transition',
              holding
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'border-slate-300 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
            )}
          >
            <span className="flex flex-col items-center gap-1">
              <Timer className="h-5 w-5" aria-hidden />
              {holding ? 'Holding…' : 'Click and hold'}
            </span>
          </button>
          <p className="help" data-testid="mouse-hold-result">
            {holdMs === null ? 'No hold recorded yet.' : `Last hold: ${holdMs} ms`}
          </p>
        </Card>
      </div>

      <Card testId="mouse-move-card">
        <CardHeader
          icon={<Move3d className="h-4 w-4" aria-hidden />}
          title="Mouse movement tracking"
          description="Move the pointer inside the canvas — coordinates are exposed for movement assertions."
        />
        <div
          ref={areaRef}
          data-testid="mouse-move-area"
          onMouseMove={onMove}
          onMouseEnter={() => setPosition((current) => ({ ...current, inside: true }))}
          onMouseLeave={() => setPosition((current) => ({ ...current, inside: false }))}
          onMouseDown={() => setDragging(true)}
          onMouseUp={() => setDragging(false)}
          className="relative h-40 w-full cursor-crosshair overflow-hidden rounded-xl border border-slate-200 bg-[radial-gradient(circle_at_center,#f8fafc,#eef2f7)] dark:border-slate-700 dark:bg-[radial-gradient(circle_at_center,#0f172a,#020617)]"
        >
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-xs font-semibold text-slate-400">
            {dragging ? 'Dragging…' : position.inside ? 'Tracking pointer' : 'Move your mouse here'}
          </div>
          <div
            className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-burgundy-600 bg-burgundy-500/30 transition-[left,top] duration-75"
            style={{ left: position.x, top: position.y, opacity: position.inside ? 1 : 0 }}
            aria-hidden
          />
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="surface-muted p-2">
            <p className="text-slate-500 dark:text-slate-400">X</p>
            <p className="font-bold text-slate-800 dark:text-slate-100" data-testid="mouse-pos-x">
              {position.x}
            </p>
          </div>
          <div className="surface-muted p-2">
            <p className="text-slate-500 dark:text-slate-400">Y</p>
            <p className="font-bold text-slate-800 dark:text-slate-100" data-testid="mouse-pos-y">
              {position.y}
            </p>
          </div>
          <div className="surface-muted p-2">
            <p className="text-slate-500 dark:text-slate-400">Inside</p>
            <p className="font-bold text-slate-800 dark:text-slate-100" data-testid="mouse-pos-inside">
              {position.inside ? 'yes' : 'no'}
            </p>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCounts({ click: 0, dblclick: 0, rightclick: 0, hover: 0, contextMenu: null });
              setHoldMs(null);
              setPosition({ x: 0, y: 0, inside: false });
              record('reset', 'Counters reset');
            }}
            data-testid="mouse-reset"
          >
            Reset counters
          </Button>
        </div>
      </Card>
    </PracticeGrid>
  );
}
