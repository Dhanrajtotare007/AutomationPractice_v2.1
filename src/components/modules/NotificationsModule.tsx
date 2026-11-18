import { useState } from 'react';
import { Bell, BellRing, CheckCircle2, Clock, Info, TriangleAlert, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Field';
import { useToast } from '@/components/ui/Toast';
import { OutputPanel, PracticeGrid } from './PracticeGrid';

export function NotificationsModule() {
  const { push, clear, toasts } = useToast();
  const [title, setTitle] = useState('Deployment finished');
  const [duration, setDuration] = useState('4000');
  const [history, setHistory] = useState<string[]>([]);

  const record = (message: string) => setHistory((current) => [message, ...current].slice(0, 6));

  const fire = (kind: 'success' | 'error' | 'warning' | 'info') => {
    push({ title: `${kind[0].toUpperCase()}${kind.slice(1)} notification`, description: 'This toast was fired from the notifications module.', kind, testId: `toast-${kind}` });
    record(`Fired ${kind} toast`);
  };

  return (
    <PracticeGrid
      aside={
        <>
          <Card testId="notifications-live">
            <CardHeader icon={<BellRing className="h-4 w-4" aria-hidden />} title="Active toasts" description="Counted from the global toast queue." />
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white" data-testid="notifications-active-count">
              {toasts.length}
            </p>
            <ul className="mt-2 space-y-1 text-xs">
              {toasts.map((toast) => (
                <li key={toast.id} className="rounded-md bg-slate-100 px-2 py-1 dark:bg-slate-800">
                  <strong>{toast.kind}</strong> · {toast.title} · auto-dismiss {toast.duration === 0 ? 'off' : `${toast.duration}ms`}
                </li>
              ))}
              {toasts.length === 0 ? <li className="text-slate-500 dark:text-slate-400">No active toasts</li> : null}
            </ul>
            <Button size="sm" variant="outline" className="mt-3 w-full" onClick={clear} data-testid="notifications-clear">
              Dismiss all
            </Button>
          </Card>
          <OutputPanel title="Event history" tone="info" testId="notifications-history">
            {history.length ? (
              <ul className="space-y-1 text-xs">
                {history.map((entry, index) => (
                  <li key={`${entry}-${index}`}>{entry}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">Fire a notification to build the history.</p>
            )}
          </OutputPanel>
        </>
      }
    >
      <Card testId="notifications-kinds">
        <CardHeader
          icon={<Bell className="h-4 w-4" aria-hidden />}
          title="Notification types"
          description="Success, error, warning and information toasts with accessible live regions."
          actions={<Badge tone="brand">aria-live=polite</Badge>}
        />
        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            variant="success"
            leftIcon={<CheckCircle2 className="h-4 w-4" aria-hidden />}
            onClick={() => fire('success')}
            data-testid="toast-btn-success"
          >
            Success notification
          </Button>
          <Button variant="danger" leftIcon={<XCircle className="h-4 w-4" aria-hidden />} onClick={() => fire('error')} data-testid="toast-btn-error">
            Error notification
          </Button>
          <Button
            className="bg-amber-500 text-white hover:bg-amber-600"
            leftIcon={<TriangleAlert className="h-4 w-4" aria-hidden />}
            onClick={() => fire('warning')}
            data-testid="toast-btn-warning"
          >
            Warning notification
          </Button>
          <Button
            className="bg-cyan-600 text-white hover:bg-cyan-700"
            leftIcon={<Info className="h-4 w-4" aria-hidden />}
            onClick={() => fire('info')}
            data-testid="toast-btn-info"
          >
            Info notification
          </Button>
        </div>
      </Card>

      <Card testId="notifications-custom">
        <CardHeader
          icon={<Clock className="h-4 w-4" aria-hidden />}
          title="Toast with auto-dismiss control"
          description="Choose a custom title and duration (0 keeps it until dismissed)."
        />
        <div className="grid gap-3 sm:grid-cols-[1fr_160px_auto] sm:items-end">
          <Input
            label="Toast title"
            name="toast-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            data-testid="toast-custom-title"
          />
          <label className="block">
            <span className="label">Duration</span>
            <select className="field" value={duration} onChange={(event) => setDuration(event.target.value)} data-testid="toast-custom-duration">
              <option value="2000">2 seconds</option>
              <option value="4000">4 seconds</option>
              <option value="8000">8 seconds</option>
              <option value="0">Manual dismiss</option>
            </select>
          </label>
          <Button
            onClick={() => {
              const ms = Number(duration);
              push({
                title: title.trim() || 'Untitled toast',
                description: ms === 0 ? 'This toast stays until you dismiss it.' : `Auto-dismisses in ${ms / 1000}s.`,
                kind: 'info',
                duration: ms,
                testId: 'toast-custom',
              });
              record(`Custom toast “${title.trim() || 'Untitled'}” (${ms}ms)`);
            }}
            data-testid="toast-btn-custom"
          >
            Fire toast
          </Button>
        </div>
        <p className="help">Dismiss a toast with its ✕ button or by pressing the notification's dismiss action.</p>
      </Card>

      <Card testId="notifications-stack">
        <CardHeader title="Burst of notifications" description="Fires five toasts at once to test stacking and auto-dismiss ordering." />
        <Button
          variant="outline"
          onClick={() => {
            ['success', 'info', 'warning', 'error', 'success'].forEach((kind, index) => {
              window.setTimeout(
                () => push({ title: `Burst ${index + 1}`, description: `${kind} toast`, kind: kind as 'success', duration: 3000, testId: 'toast-burst' }),
                index * 150,
              );
            });
            record('Fired a burst of 5 toasts');
          }}
          data-testid="toast-btn-burst"
        >
          Fire burst
        </Button>
      </Card>
    </PracticeGrid>
  );
}
