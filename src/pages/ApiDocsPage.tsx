import { useState } from 'react';
import { Database, Download, Send, ServerCog } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { useNotify } from '@/components/ui/Toast';
import { api, ApiError } from '@/lib/api';

const ENDPOINTS = [
  { method: 'GET', path: '/api/health', description: 'Service health, uptime and version.', sample: '/api/health' },
  { method: 'GET', path: '/api/employees', description: 'Paginated, searchable and sortable employee list.', sample: '/api/employees?page=1&pageSize=5&search=qa&sortBy=name&sortDir=asc' },
  { method: 'POST', path: '/api/employees', description: 'Create an employee. Requires name, email, department, role, salary, status, joined.', sample: '/api/employees' },
  { method: 'PUT', path: '/api/employees/:id', description: 'Update an existing employee (full record).', sample: '/api/employees/1' },
  { method: 'DELETE', path: '/api/employees/:id', description: 'Delete an employee.', sample: '/api/employees/12' },
  { method: 'GET', path: '/api/contact', description: 'Recent contact messages (max 50).', sample: '/api/contact' },
  { method: 'POST', path: '/api/contact', description: 'Submit a contact message (name, email, subject, message).', sample: '/api/contact' },
  { method: 'GET', path: '/api/progress', description: 'Read the progress snapshot stored on the server.', sample: '/api/progress' },
  { method: 'PUT', path: '/api/progress', description: 'Replace the progress snapshot with an array of exercise keys.', sample: '/api/progress' },
  { method: 'POST', path: '/api/events/:eventId/registrations', description: 'Register for an event (name, email).', sample: '/api/events/meetup-locators/registrations' },
];

const METHOD_TONE = { GET: 'info', POST: 'success', PUT: 'warning', DELETE: 'danger' } as const;

const SCHEMAS: Record<string, string> = {
  Employee: `{
  "id": 1,
  "name": "Aarav Sharma",
  "email": "aarav.sharma@qaautomationlabs.com",
  "department": "Engineering",
  "role": "SDET",
  "salary": 78000,
  "status": "Active",
  "joined": "2023-03-14"
}`,
  Error: `{
  "status": 400,
  "message": "Validation failed",
  "details": ["Name must be at least 2 characters"]
}`,
  List: `{
  "data": {
    "items": [ /* Employee[] */ ],
    "total": 12,
    "page": 1,
    "pageSize": 5,
    "totalPages": 3,
    "sortBy": "id",
    "sortDir": "asc"
  }
}`,
};

export function ApiDocsPage() {
  const notify = useNotify();
  const [response, setResponse] = useState<string>('');
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState('/api/employees?page=1&pageSize=5');

  const send = async () => {
    setLoading(true);
    setResponse('');
    setStatus(null);
    try {
      const result = await fetch(path, { headers: { Accept: 'application/json' } });
      const json = await result.json().catch(() => ({}));
      setStatus(result.status);
      setResponse(JSON.stringify(json, null, 2));
    } catch (error) {
      setStatus(0);
      setResponse(JSON.stringify({ error: error instanceof Error ? error.message : 'Request failed' }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const checkHealth = async () => {
    try {
      const health = await api.health();
      notify.success('API is healthy', `v${health.version} · up ${health.uptime}s`);
    } catch (error) {
      notify.error('API unreachable', error instanceof ApiError ? error.message : 'Unknown error');
    }
  };

  return (
    <div className="space-y-5" data-testid="api-page">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge tone="brand">API</Badge>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Playground REST API</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            A real Express + SQLite backend. Use it to practise API testing, request validation and data setup before a UI test.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => void checkHealth()} leftIcon={<ServerCog className="h-4 w-4" aria-hidden />} data-testid="api-health-check">
            Check health
          </Button>
          <a href="/api-docs/openapi.json" target="_blank" rel="noreferrer" className="inline-flex">
            <Button variant="ghost" leftIcon={<Download className="h-4 w-4" aria-hidden />}>
              OpenAPI JSON
            </Button>
          </a>
        </div>
      </header>

      <Card testId="api-console">
        <CardHeader icon={<Send className="h-4 w-4" aria-hidden />} title="Try a request" description="GET requests are sent straight from the browser." />
        <div className="flex flex-col gap-2 sm:flex-row">
          <span className="grid h-10 place-items-center rounded-lg bg-cyan-100 px-3 text-xs font-bold text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200">GET</span>
          <input
            value={path}
            onChange={(event) => setPath(event.target.value)}
            aria-label="Request path"
            className="field font-mono text-xs"
            data-testid="api-request-path"
          />
          <Button onClick={() => void send()} loading={loading} data-testid="api-send">
            Send
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {['/api/health', '/api/employees?page=1&pageSize=5', '/api/employees?search=engineer&sortBy=salary&sortDir=desc', '/api/progress', '/api/contact'].map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => setPath(sample)}
              className="rounded-full border border-slate-200 px-2.5 py-0.5 font-mono text-[11px] text-slate-600 hover:border-burgundy-300 hover:text-burgundy-700 dark:border-slate-700 dark:text-slate-300"
            >
              {sample}
            </button>
          ))}
        </div>
        {response ? (
          <div className="mt-3">
            <p className="mb-1 text-xs font-semibold">
              Status:{' '}
              <span className={status && status < 400 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'} data-testid="api-status">
                {status}
              </span>
            </p>
            <CodeBlock code={response} title="Response" maxHeight="max-h-72" testId="api-response" />
          </div>
        ) : (
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Send a request to see the response.</p>
        )}
      </Card>

      <Card testId="api-endpoints">
        <CardHeader icon={<Database className="h-4 w-4" aria-hidden />} title="Endpoints" description="All responses are wrapped in a `data` envelope; errors return `status`, `message` and optional `details`." />
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="px-2 py-2">Method</th>
                <th className="px-2 py-2">Path</th>
                <th className="px-2 py-2">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {ENDPOINTS.map((endpoint) => (
                <tr key={`${endpoint.method}-${endpoint.path}`} data-testid={`api-endpoint-${endpoint.method.toLowerCase()}-${endpoint.path.replace(/[/:]/g, '-')}`}>
                  <td className="px-2 py-2">
                    <Badge tone={METHOD_TONE[endpoint.method as keyof typeof METHOD_TONE]}>{endpoint.method}</Badge>
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 font-mono text-xs text-slate-800 dark:text-slate-100">{endpoint.path}</td>
                  <td className="px-2 py-2 text-xs text-slate-600 dark:text-slate-300">{endpoint.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {Object.entries(SCHEMAS).map(([name, schema]) => (
          <CodeBlock key={name} code={schema} title={`${name} schema`} maxHeight="max-h-80" testId={`api-schema-${name.toLowerCase()}`} />
        ))}
      </div>

      <Card testId="api-examples">
        <CardHeader title="Example calls" description="Copy into your API test suite." />
        <div className="grid gap-3 lg:grid-cols-2">
          <CodeBlock
            title="Playwright · Java$
Script"
            code={`import { test, expect } from '@playwright/test';

test('employee list contract', async ({ request }) => {
  const res = await request.get('/api/employees?pageSize=5');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.data.items.length).toBeLessThanOrEqual(5);
});`}
            maxHeight="max-h-56"
          />
          <CodeBlock
            title="Selenium · Python (requests)"
            code={`import requests

def test_create_employee():
    payload = {
        "name": "Test User",
        "email": "test.user@example.com",
        "department": "Quality Assurance",
        "role": "QA Engineer",
        "salary": 60000,
        "status": "Active",
        "joined": "2026-01-05",
    }
    res = requests.post("http://localhost:4000/api/employees", json=payload)
    assert res.status_code == 201
    assert res.json()["data"]["name"] == "Test User"`}
            maxHeight="max-h-56"
          />
        </div>
      </Card>
    </div>
  );
}
