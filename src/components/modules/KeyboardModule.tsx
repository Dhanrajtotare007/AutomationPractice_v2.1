import { useRef, useState } from 'react';
import { Keyboard, Copy, CornerDownLeft, Eraser } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Field';
import { PracticeGrid, OutputPanel } from './PracticeGrid';
import { cx } from '@/lib/utils';

const KEY_GROUPS = [
  { title: 'Enter', items: ['Enter', 'NumpadEnter'], description: 'Submit the value and record it.' },
  { title: 'Escape', items: ['Escape'], description: 'Clear the current text.' },
  { title: 'Tab', items: ['Tab'], description: 'Moves focus to the next focusable control.' },
  { title: 'Backspace', items: ['Backspace'], description: 'Removes the last character.' },
  { title: 'Arrow keys', items: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'], description: 'Increments/decrements a counter.' },
];

export function KeyboardModule() {
  const [buffer, setBuffer] = useState('');
  const [pressed, setPressed] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<string[]>([]);
  const [counter, setCounter] = useState(0);
  const [selectedAll, setSelectedAll] = useState(false);
  const [clipboardText, setClipboardText] = useState('');
  const [pastedText, setPastedText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const pasteRef = useRef<HTMLInputElement>(null);

  const recordKey = (event: React.KeyboardEvent) => {
    const combo = [event.ctrlKey || event.metaKey ? 'Ctrl' : null, event.shiftKey ? 'Shift' : null, event.altKey ? 'Alt' : null, event.key]
      .filter(Boolean)
      .join('+');
    setPressed((current) => [combo, ...current].slice(0, 12));

    if (event.key === 'Escape') {
      setBuffer('');
      setSelectedAll(false);
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      if (buffer.trim()) setSubmitted((current) => [buffer.trim(), ...current].slice(0, 6));
      setBuffer('');
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setCounter((value) => value + 1);
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setCounter((value) => Math.max(0, value - 1));
    }
    if (event.key === 'ArrowLeft') setCounter((value) => Math.max(0, value - 10));
    if (event.key === 'ArrowRight') setCounter((value) => value + 10);
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a') {
      setSelectedAll(true);
    }
  };

  return (
    <PracticeGrid
      aside={
        <>
          <OutputPanel title="Key log" tone="info" testId="keyboard-log">
            {pressed.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">Press keys inside the capture field.</p>
            ) : (
              <div className="flex flex-wrap gap-1" data-testid="keyboard-log-list">
                {pressed.map((key, index) => (
                  <kbd
                    key={`${key}-${index}`}
                    className="rounded-md border border-slate-300 bg-white px-1.5 py-0.5 font-mono text-[11px] font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            )}
          </OutputPanel>
          <Card testId="keyboard-pressed">
            <CardHeader title="Captured counter" description="Arrow keys change the value below." />
            <div className="flex items-center justify-between">
              <Button size="sm" variant="outline" onClick={() => setCounter((value) => Math.max(0, value - 1))} aria-label="Decrease">
                −
              </Button>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white" data-testid="keyboard-counter">
                {counter}
              </span>
              <Button size="sm" variant="outline" onClick={() => setCounter((value) => value + 1)} aria-label="Increase">
                +
              </Button>
            </div>
          </Card>
        </>
      }
    >
      <Card testId="keyboard-capture">
        <CardHeader
          icon={<Keyboard className="h-4 w-4" aria-hidden />}
          title="Key capture"
          description="Type and press Enter to submit, Escape to clear, Ctrl/Cmd + A to select all."
          actions={<Badge tone="brand">onKeyDown</Badge>}
        />
        <Input
          ref={inputRef}
          label="Type here and press keys to see them captured"
          name="keyboard-input"
          value={buffer}
          onChange={(event) => {
            setBuffer(event.target.value);
            setSelectedAll(false);
          }}
          onKeyDown={recordKey}
          onKeyUp={() => undefined}
          placeholder="Start typing…"
          hint="Enter submits · Escape clears · Ctrl+A selects all"
          data-testid="keyboard-input"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.focus();
                inputRef.current.select();
              }
              setSelectedAll(true);
              setPressed((current) => ['select-all', ...current].slice(0, 12));
            }}
            data-testid="keyboard-select-all"
          >
            Select all text
          </Button>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Eraser className="h-3.5 w-3.5" aria-hidden />}
            onClick={() => {
              setBuffer('');
              setSelectedAll(false);
            }}
            data-testid="keyboard-clear"
          >
            Clear
          </Button>
          <span className="self-center text-xs text-slate-500 dark:text-slate-400" data-testid="keyboard-selection-state">
            {selectedAll ? 'All text is selected' : `${buffer.length} characters`}
          </span>
        </div>
        <div className="mt-3">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Submitted values</p>
          {submitted.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400" data-testid="keyboard-submitted-empty">
              Press Enter with some text to submit it.
            </p>
          ) : (
            <ul className="flex flex-wrap gap-1.5" data-testid="keyboard-submitted-list">
              {submitted.map((value, index) => (
                <li key={`${value}-${index}`} className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                  {value}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>

      <Card testId="keyboard-tab-order">
        <CardHeader
          icon={<CornerDownLeft className="h-4 w-4" aria-hidden />}
          title="Tab order demonstration"
          description="Press Tab to cycle through these three inputs — the order is 1 → 2 → 3."
        />
        <div className="grid gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((index) => (
            <Input
              key={index}
              label={`Field ${index}`}
              name={`keyboard-tab-${index}`}
              placeholder={`Field ${index}`}
              data-testid={`keyboard-enter-input-${index}`}
            />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {KEY_GROUPS.map((group) => (
            <span key={group.title} className="rounded-full border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
              {group.title}
              <span className="ml-1 font-normal text-slate-400">{group.description}</span>
            </span>
          ))}
        </div>
        <div className="mt-3">
          <Input
            label="Dedicated Enter-key field"
            name="keyboard-enter-input"
            placeholder="Type and press Enter"
            data-testid="keyboard-enter-input"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                const value = event.currentTarget.value.trim();
                if (value) setSubmitted((current) => [value, ...current].slice(0, 6));
                event.currentTarget.value = '';
                setPressed((current) => ['Enter', ...current].slice(0, 12));
              }
            }}
          />
        </div>
      </Card>

      <Card testId="keyboard-clipboard">
        <CardHeader
          icon={<Copy className="h-4 w-4" aria-hidden />}
          title="Copy and paste demonstration"
          description="Copy text with the button, then paste with Ctrl+V into the field below."
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Text to copy"
            name="clipboard-source"
            value={clipboardText}
            onChange={(event) => setClipboardText(event.target.value)}
            placeholder="e.g. expect(page).toHaveTitle()"
            data-testid="keyboard-copy-source"
          />
          <Input
            ref={pasteRef}
            label="Paste target (Ctrl+V / Cmd+V)"
            name="keyboard-paste-target"
            value={pastedText}
            onChange={(event) => setPastedText(event.target.value)}
            placeholder="Paste here…"
            data-testid="keyboard-paste-target"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(clipboardText);
              } catch {
                pastedText; /* clipboard may be blocked */
              }
              pasteRef.current?.focus();
            }}
            data-testid="keyboard-copy"
          >
            Copy text
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPastedText(clipboardText)}
            data-testid="keyboard-paste-simulate"
          >
            Simulate paste
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setPastedText('')} data-testid="keyboard-paste-clear">
            Clear pasted text
          </Button>
        </div>
        <p className={cx('help', pastedText && 'text-emerald-600 dark:text-emerald-400')} data-testid="keyboard-paste-result">
          {pastedText ? `Pasted: ${pastedText}` : 'Nothing pasted yet.'}
        </p>
      </Card>
    </PracticeGrid>
  );
}
