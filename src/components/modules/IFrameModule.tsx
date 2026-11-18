import { useEffect, useRef, useState } from 'react';
import { Frame, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Field';
import { useNotify } from '@/components/ui/Toast';
import { OutputPanel, PracticeGrid } from './PracticeGrid';

type FrameMessage =
  | { type: 'frame-ready'; title: string }
  | { type: 'frame-submitted'; name: string; email: string; topic: string }
  | { type: 'frame-notify'; message: string };

export function IFrameModule() {
  const notify = useNotify();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [result, setResult] = useState<{ name: string; email: string; topic: string } | null>(null);
  const [outerName, setOuterName] = useState('');
  const [frameReady, setFrameReady] = useState(false);

  useEffect(() => {
    const onMessage = (event: MessageEvent<FrameMessage>) => {
      const iframe = iframeRef.current;
      if (!iframe || event.source !== iframe.contentWindow) return;
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      if (data.type === 'frame-ready') setFrameReady(true);
      if (data.type === 'frame-submitted') {
        setResult({ name: data.name, email: data.email, topic: data.topic });
        notify.success('Submitted from inside the iframe', `${data.name} · ${data.topic}`);
      }
      if (data.type === 'frame-notify') notify.info('iframe says', data.message);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [notify]);

  return (
    <PracticeGrid
      aside={
        <>
          <Card testId="iframe-result">
            <CardHeader title="Messages from the frame" description="Communicated with postMessage." />
            {result ? (
              <OutputPanel title="Latest submission" tone="success" testId="iframe-submission">
                <dl className="space-y-1 text-xs">
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500 dark:text-slate-400">Name</dt>
                    <dd className="font-semibold" data-testid="iframe-submission-name">
                      {result.name}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500 dark:text-slate-400">Email</dt>
                    <dd className="font-semibold" data-testid="iframe-submission-email">
                      {result.email}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500 dark:text-slate-400">Topic</dt>
                    <dd className="font-semibold" data-testid="iframe-submission-topic">
                      {result.topic}
                    </dd>
                  </div>
                </dl>
              </OutputPanel>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">Submit the form inside the iframe to see its values here.</p>
            )}
          </Card>
          <OutputPanel title="How to automate" tone="info">
            <ul className="list-disc space-y-1 pl-4 text-xs">
              <li>Playwright: <code className="font-mono">page.frameLocator('[data-testid=&quot;iframe-demo&quot;]')</code></li>
              <li>Selenium: <code className="font-mono">driver.switch_to.frame(...)</code> then <code className="font-mono">switch_to.default_content()</code></li>
              <li>Cypress: needs the <code className="font-mono">cypress-iframe</code> plugin</li>
            </ul>
          </OutputPanel>
        </>
      }
    >
      <Card testId="iframe-outer-card">
        <CardHeader
          icon={<Frame className="h-4 w-4" aria-hidden />}
          title="Nested document (same-origin iframe)"
          description="The iframe is rendered from a Blob URL with the same origin, so drivers can switch into it."
          actions={
            <Badge tone={frameReady ? 'success' : 'neutral'} testId="iframe-ready-badge">
              {frameReady ? 'frame ready' : 'loading frame'}
            </Badge>
          }
        />
        <iframe
          ref={iframeRef}
          title="Practice iframe"
          src="/iframe-demo.html"
          data-testid="iframe-demo"
          className="h-[430px] w-full rounded-xl border border-slate-200 bg-white dark:border-slate-700"
          onLoad={() => setFrameReady(true)}
        />
      </Card>

      <Card testId="iframe-parent-actions">
        <CardHeader title="Interact with the frame from the parent page" description="A second interaction path for automation practice." />
        <div className="flex flex-wrap items-end gap-2">
          <Input
            label="Value to send into the frame"
            name="iframe-outer-input"
            value={outerName}
            onChange={(event) => setOuterName(event.target.value)}
            placeholder="Type a name"
            data-testid="iframe-outer-input"
            wrapperClassName="max-w-xs"
          />
          <Button
            onClick={() => {
              const inner = iframeRef.current?.contentDocument ?? null;
              const input = inner?.querySelector<HTMLInputElement>('[data-testid="iframe-name"]');
              if (!input) {
                notify.error('iframe not ready', 'The frame document is still loading.');
                return;
              }
              input.value = outerName;
              input.dispatchEvent(new Event('input', { bubbles: true }));
              input.focus();
              notify.info('Value written into the iframe', outerName || '(empty)');
            }}
            data-testid="iframe-outer-send"
          >
            Send into frame
          </Button>
          <Button
            variant="outline"
            leftIcon={<RefreshCw className="h-4 w-4" aria-hidden />}
            onClick={() => {
              setFrameReady(false);
              if (iframeRef.current) iframeRef.current.src = `/iframe-demo.html?reload=${Date.now()}`;
              setResult(null);
              notify.info('iframe reloaded');
            }}
            data-testid="iframe-reload"
          >
            Reload frame
          </Button>
        </div>
        <p className="help">
          This demonstrates cross-document scripting which Selenium performs with <code className="font-mono">switch_to.frame</code>.
        </p>
      </Card>
    </PracticeGrid>
  );
}
