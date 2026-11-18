import { useState } from 'react';
import { CalendarClock, MapPin, Users } from 'lucide-react';
import { EVENTS } from '@shared/content';
import { api, ApiError } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { useNotify } from '@/components/ui/Toast';

const MODE_TONE = { Online: 'info', 'In person': 'brand', Hybrid: 'warning' } as const;

export function EventsPage() {
  const notify = useNotify();
  const [selected, setSelected] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [saving, setSaving] = useState(false);

  const active = EVENTS.find((event) => event.id === selected);

  const submit = async (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault();
    const nextErrors: typeof errors = {};
    if (name.trim().length < 2) nextErrors.name = 'Name must be at least 2 characters';
    if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email.trim())) nextErrors.email = 'Enter a valid email address';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !active) return;
    setSaving(true);
    try {
      const response = await fetch('/api/events/' + encodeURIComponent(active.id) + '/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new ApiError(payload?.message ?? 'Registration failed', response.status, payload?.details);
      if (payload?.data?.alreadyRegistered) {
        notify.warning('Already registered', `${email} is already on the list for ${active.title}.`);
      } else {
        notify.success('Seat reserved', `${active.title} · confirmation sent to ${email}.`);
      }
      setSelected(null);
      setName('');
      setEmail('');
    } catch (error) {
      notify.error('Registration failed', error instanceof ApiError ? error.message : 'Check that the API server is running.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5" data-testid="events-page">
      <header>
        <Badge tone="brand">Events</Badge>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Workshops, meetups and the annual summit</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Registrations are stored through the playground API, so you can practise API testing alongside the UI flow.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {EVENTS.map((event) => (
          <Card key={event.id} className="flex flex-col" testId={`event-${event.id}`}>
            <div className="flex items-center justify-between">
              <Badge tone={MODE_TONE[event.mode]}>{event.mode}</Badge>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{formatDate(event.date)}</span>
            </div>
            <h2 className="mt-3 text-base font-bold text-slate-900 dark:text-white">{event.title}</h2>
            <p className="mt-1 flex-1 text-sm text-slate-500 dark:text-slate-400">{event.summary}</p>
            <ul className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-1.5">
                <CalendarClock className="h-3.5 w-3.5 text-slate-400" aria-hidden /> {formatDate(event.date)} · {event.time}
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400" aria-hidden /> {event.location}
              </li>
              <li className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-slate-400" aria-hidden /> {event.seats} seats
              </li>
            </ul>
            <Button className="mt-3" onClick={() => setSelected(event.id)} data-testid={`event-register-${event.id}`}>
              Register
            </Button>
          </Card>
        ))}
      </div>

      <Card testId="events-agenda">
        <CardHeader title="What to expect" description="Every session is hands-on and recorded." />
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { title: 'Live coding', text: 'Build and debug real locators against this playground.' },
            { title: 'Q&A with SDETs', text: 'Bring your flakiest test — we will triage it live.' },
            { title: 'Take-home exercises', text: 'Every attendee gets a graded exercise pack.' },
          ].map((item) => (
            <div key={item.title} className="surface-muted p-3">
              <p className="text-sm font-bold text-slate-800 dark:text-white">{item.title}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.text}</p>
            </div>
          ))}
        </div>
      </Card>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={`Register · ${active?.title ?? ''}`}
        testId="event-modal"
        footer={
          <>
            <Button variant="ghost" onClick={() => setSelected(null)}>
              Cancel
            </Button>
            <Button type="submit" form="event-form" loading={saving} data-testid="event-submit">
              Reserve seat
            </Button>
          </>
        }
      >
        <form id="event-form" className="space-y-3" onSubmit={submit} noValidate>
          <Input
            label="Full name"
            name="event-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={errors.name}
            errorTestId="event-name-error"
            required
            data-testid="event-name"
          />
          <Input
            label="Email address"
            name="event-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={errors.email}
            errorTestId="event-email-error"
            required
            data-testid="event-email"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">You can register once per e-mail address.</p>
        </form>
      </Modal>
    </div>
  );
}

void api;
