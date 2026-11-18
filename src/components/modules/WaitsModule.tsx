import { useEffect, useRef, useState } from 'react';
import { Loader2, Play, Timer } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Field';
import { OutputPanel, PracticeGrid } from './PracticeGrid';

export function WaitsModule() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [delay, setDelay] = useState('2000');
  const [clickMeVisible, setClickMeVisible] = useState(false);
  const [text, setText] = useState('Loading…');
  const [textDone, setTextDone] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);

  return (
    <PracticeGrid
      aside={
        <OutputPanel title="State" tone="info" testId="waits-state">
          <ul className="space-y-1 text-xs">
            <li>Delayed result: <strong data-testid="waits-state-result">{result ?? 'not rendered'}</strong></li>
            <li>Button visible: <strong data-testid="waits-state-button">{clickMeVisible ? 'yes' : 'no'}</strong></li>
            <li>Async text: <strong data-testid="waits-state-text">{textDone ? 'loaded' : 'pending'}</strong></li>
          </ul>
        </OutputPanel>
      }
    >
      <Card testId="waits-delayed">
        <CardHeader
          icon={<Timer className="h-4 w-4" aria-hidden />}
          title="Delayed element"
          description="The result element only enters the DOM after the delay - use an explicit wait."
          actions={<Badge tone="warning">toBeVisible()</Badge>}
        />
        <div className="flex flex-wrap items-end gap-3">
          <label className="block max-w-[160px]">
            <span className="label">Delay (ms)</span>
            <select className="field" value={delay} onChange={(event) => setDelay(event.target.value)} data-testid="waits-delay" aria-label="Delay in milliseconds">
              <option value="1000">1000 ms</option>
              <option value="2000">2000 ms</option>
              <option value="3000">3000 ms</option>
            </select>
          </label>
          <Button
            leftIcon={<Play className="h-4 w-4" aria-hidden />}
            onClick={() => {
              setRunning(true);
              setResult(null);
              const timer = window.setTimeout(() => {
                setResult(`Loaded after ${delay} ms`);
                setRunning(false);
              }, Number(delay));
              timers.current.push(timer);
            }}
            data-testid="waits-start"
          >
            Start timer
          </Button>
          {running ? <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400"><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Waiting…</span> : null}
        </div>
        <div className="mt-3 min-h-[52px]">
          {result ? (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200" data-testid="waits-result">
              ✓ {result}
            </p>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400" data-testid="waits-pending">
              {running ? 'Element will appear shortly…' : 'Press “Start timer” to render the delayed element.'}
            </p>
          )}
        </div>
      </Card>

      <Card testId="waits-visibility">
        <CardHeader
          icon={<Timer className="h-4 w-4" aria-hidden />}
          title="Element visibility toggle"
          description="A button that is only rendered after 1.5 seconds, then can be clicked once."
          actions={<Badge tone="warning">wait_for_visibility</Badge>}
        />
        <Button
          variant="outline"
          onClick={() => {
            setClickMeVisible(false);
            const timer = window.setTimeout(() => setClickMeVisible(true), 1500);
            timers.current.push(timer);
          }}
          data-testid="waits-trigger-visibility"
        >
          Reveal button in 1.5s
        </Button>
        <div className="mt-3 min-h-[40px]">
          {clickMeVisible ? (
            <Button
              variant="success"
              onClick={() => {
                setClickMeVisible(false);
                setText('Button was clicked!');
                setTextDone(true);
              }}
              data-testid="waits-click-me"
            >
              Click me!
            </Button>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">Button not rendered yet.</p>
          )}
        </div>
      </Card>

      <Card testId="waits-text">
        <CardHeader title="Asynchronous text change" description="The text mutates after a delay — assert with toHaveText / text_to_be_present_in_element." />
        <div className="flex flex-wrap items-end gap-3">
          <Input
            label="Text to load"
            name="waits-text-input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            data-testid="waits-text-input"
            wrapperClassName="max-w-xs"
          />
          <Button
            onClick={() => {
              setTextDone(false);
              const timer = window.setTimeout(() => setTextDone(true), 1200);
              timers.current.push(timer);
            }}
            data-testid="waits-load-text"
          >
            Load text
          </Button>
        </div>
        <p className="mt-3 text-sm font-semibold" data-testid="waits-text-output">
          {textDone ? text : 'Waiting for text…'}
        </p>
      </Card>
    </PracticeGrid>
  );
}
