import { useState } from 'react';
import { AlertTriangle, MessageSquare, ShieldQuestion } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Field';
import { useNotify } from '@/components/ui/Toast';
import { OutputPanel, PracticeGrid } from './PracticeGrid';

interface AlertResult {
  type: 'alert' | 'confirm' | 'prompt';
  accepted?: boolean;
  value?: string | null;
  at: string;
}

export function AlertsModule() {
  const notify = useNotify();
  const [results, setResults] = useState<AlertResult[]>([]);
  const [promptDefault, setPromptDefault] = useState('QA Engineer');

  const record = (result: AlertResult) => setResults((current) => [result, ...current].slice(0, 8));

  const showAlert = () => {
    window.alert('Hello! This is a native JavaScript alert.\n\nAccept it to continue.');
    record({ type: 'alert', at: new Date().toLocaleTimeString() });
    notify.info('Alert accepted');
  };

  const showConfirm = () => {
    const accepted = window.confirm('Do you want to delete the selected test record?\n\nThis action cannot be undone.');
    record({ type: 'confirm', accepted, at: new Date().toLocaleTimeString() });
    if (accepted) notify.success('Confirm accepted', 'The record would be deleted.');
    else notify.warning('Confirm dismissed', 'Nothing was deleted.');
  };

  const showPrompt = () => {
    const value = window.prompt('What is your job title?', promptDefault);
    record({ type: 'prompt', value, at: new Date().toLocaleTimeString() });
    if (value === null) notify.warning('Prompt cancelled');
    else notify.success('Prompt value captured', value || '(empty)');
  };

  const last = results[0];

  return (
    <PracticeGrid
      aside={
        <>
          <OutputPanel title="Last result" tone="info" testId="alerts-last">
            {last ? (
              <div className="text-xs">
                <p>
                  Type: <strong>{last.type}</strong>
                </p>
                {last.type === 'confirm' ? (
                  <p data-testid="alerts-confirm-result">
                    Accepted: <strong>{last.accepted ? 'true' : 'false'}</strong>
                  </p>
                ) : null}
                {last.type === 'prompt' ? (
                  <p data-testid="alerts-prompt-result">
                    Value: <strong>{last.value === null ? '(cancelled)' : last.value}</strong>
                  </p>
                ) : null}
                <p className="text-slate-500 dark:text-slate-400">at {last.at}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">No dialog has been triggered yet.</p>
            )}
          </OutputPanel>
          <Card testId="alerts-tips">
            <CardHeader title="Auto-accept native dialogs" description="Handle dialogs without human intervention." />
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-[11px] leading-relaxed text-slate-200">
{`// Playwright
page.on('dialog', d => d.accept('QA Engineer'));

// Selenium
driver.switch_to.alert.accept()

// Cypress
cy.on('window:confirm', () => true)`}
            </pre>
          </Card>
        </>
      }
    >
      <Card testId="alerts-card">
        <CardHeader
          icon={<AlertTriangle className="h-4 w-4" aria-hidden />}
          title="Native JavaScript dialogs"
          description="alert(), confirm() and prompt() block the UI thread - exactly what automation frameworks must handle."
          actions={<Badge tone="warning">window.alert / confirm / prompt</Badge>}
        />
        <div className="grid gap-2 sm:grid-cols-3">
          <Button onClick={showAlert} leftIcon={<AlertTriangle className="h-4 w-4" aria-hidden />} data-testid="alert-trigger">
            Show Alert
          </Button>
          <Button variant="outline" onClick={showConfirm} leftIcon={<ShieldQuestion className="h-4 w-4" aria-hidden />} data-testid="confirm-trigger">
            Show Confirm
          </Button>
          <Button variant="secondary" onClick={showPrompt} leftIcon={<MessageSquare className="h-4 w-4" aria-hidden />} data-testid="prompt-trigger">
            Open Prompt
          </Button>
        </div>
        <div className="mt-4 max-w-xs">
          <Input
            label="Default prompt value"
            name="prompt-default"
            value={promptDefault}
            onChange={(event) => setPromptDefault(event.target.value)}
            hint="Used as the pre-filled answer of the prompt dialog."
            data-testid="prompt-default-input"
          />
        </div>
      </Card>

      <Card testId="alerts-history">
        <CardHeader title="Dialog history" description="Every dialog interaction is recorded below." />
        {results.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400" data-testid="alerts-empty">
            Trigger a dialog to populate the history.
          </p>
        ) : (
          <ul className="space-y-1 text-xs" data-testid="alerts-history-list">
            {results.map((result, index) => (
              <li key={`${result.type}-${result.at}-${index}`} className="flex flex-wrap items-center gap-2 rounded-md bg-slate-100 px-2 py-1 dark:bg-slate-800">
                <Badge tone={result.type === 'confirm' ? (result.accepted ? 'success' : 'danger') : result.type === 'prompt' ? 'info' : 'neutral'}>
                  {result.type}
                </Badge>
                {result.type === 'confirm' ? <span>{result.accepted ? 'accepted' : 'dismissed'}</span> : null}
                {result.type === 'prompt' ? <span>{result.value === null ? 'cancelled' : `“${result.value}”`}</span> : null}
                {result.type === 'alert' ? <span>accepted</span> : null}
                <span className="ml-auto text-slate-400">{result.at}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </PracticeGrid>
  );
}
