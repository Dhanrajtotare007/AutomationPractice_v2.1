import { useEffect, useState } from 'react';
import { CheckCircle2, Mail, MapPin, MessageSquare, Phone, Send, LifeBuoy } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input, Select, Textarea } from '@/components/ui/Field';
import { useNotify } from '@/components/ui/Toast';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { BRAND } from '@/components/layout/Brand';

interface FormState {
  name: string;
  email: string;
  subject: string;
  topic: string;
  message: string;
}

const INITIAL: FormState = { name: '', email: '', subject: '', topic: 'general', message: '' };

export function ContactPage() {
  const notify = useNotify();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<{ id: number; name: string; createdAt: string } | null>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    document.title = `Contact & Support | ${BRAND.name}`;
    return () => {
      document.title = `${BRAND.name} | Learn by Automating`;
    };
  }, []);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = () => {
    const next: typeof errors = {};
    if (form.name.trim().length < 2) next.name = 'Please enter your name (2+ characters)';
    if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(form.email.trim())) next.email = 'Please enter a valid email address';
    if (form.subject.trim().length < 3) next.subject = 'Please add a subject (3+ characters)';
    if (form.message.trim().length < 10) next.message = 'Please write at least 10 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setAttempts((count) => count + 1);
    if (!validate()) {
      notify.error('Please fix the highlighted fields');
      return;
    }
    setSending(true);
    try {
      const response = await api.contact.submit({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: `${form.subject.trim()} [${form.topic}]`,
        message: form.message.trim(),
      });
      setSent({ id: response.data.id, name: response.data.name, createdAt: response.data.createdAt });
      notify.success('Message sent', 'We will reply within two business days.');
      setForm(INITIAL);
    } catch (error) {
      notify.error('Could not send the message', error instanceof ApiError ? error.message : 'Unknown error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4" data-testid="contact-page">
      <Breadcrumbs items={[{ label: 'Contact' }]} />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card testId="contact-form-card">
          <CardHeader
            icon={<MessageSquare className="h-4 w-4" aria-hidden />}
            title={`Talk to the ${BRAND.name} team`}
            description="Messages are saved to the practice database so you can assert the API response too."
            actions={<Badge tone="info">POST /api/contact</Badge>}
          />
          {sent ? (
            <div
              className="mb-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm dark:border-emerald-500/30 dark:bg-emerald-500/10"
              data-testid="contact-success"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
              <div>
                <p className="font-semibold text-emerald-800 dark:text-emerald-200">
                  Thanks {sent.name}! Message #{sent.id} was stored at {sent.createdAt}.
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">We reply within two business days.</p>
              </div>
            </div>
          ) : null}

          <form onSubmit={submit} noValidate className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Your name"
              name="contact-name"
              value={form.name}
              onChange={(event) => set('name', event.target.value)}
              error={errors.name}
              errorTestId="contact-error-name"
              required
              data-testid="contact-name"
              autoComplete="name"
            />
            <Input
              label="Email address"
              name="contact-email"
              type="email"
              value={form.email}
              onChange={(event) => set('email', event.target.value)}
              error={errors.email}
              errorTestId="contact-error-email"
              required
              data-testid="contact-email"
              autoComplete="email"
            />
            <Input
              label="Subject"
              name="contact-subject"
              value={form.subject}
              onChange={(event) => set('subject', event.target.value)}
              error={errors.subject}
              errorTestId="contact-error-subject"
              required
              data-testid="contact-subject"
            />
            <Select
              label="Topic"
              name="contact-topic"
              value={form.topic}
              onChange={(event) => set('topic', event.target.value)}
              options={[
                { value: 'general', label: 'General enquiry' },
                { value: 'feedback', label: 'Feedback on a practice lab' },
                { value: 'bug', label: 'Report a bug in the platform' },
                { value: 'partnership', label: 'Partnerships' },
              ]}
              data-testid="contact-topic"
            />
            <div className="sm:col-span-2">
              <Textarea
                label="Message"
                name="contact-message"
                rows={5}
                value={form.message}
                onChange={(event) => set('message', event.target.value)}
                error={errors.message}
                errorTestId="contact-error-message"
                hint={`${form.message.trim().length}/2000 characters (minimum 10)`}
                maxLength={2000}
                required
                data-testid="contact-message"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
              <Button type="submit" loading={sending} leftIcon={<Send className="h-4 w-4" aria-hidden />} data-testid="contact-submit">
                Send message
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setForm(INITIAL);
                  setErrors({});
                }}
                data-testid="contact-reset"
              >
                Clear form
              </Button>
              <span className="text-xs text-slate-500 dark:text-slate-400" data-testid="contact-attempts">
                Submit attempts: {attempts}
              </span>
            </div>
          </form>
        </Card>

        <div className="space-y-4">
          <Card testId="contact-details">
            <CardHeader icon={<LifeBuoy className="h-4 w-4" aria-hidden />} title="Support channels" />
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-600 dark:text-brand-300" aria-hidden />
                <a href="mailto:support@automationpractice.example" className="hover:underline">
                  support@automationpractice.example
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-600 dark:text-brand-300" aria-hidden />
                <a href="tel:+10000000000" className="hover:underline">
                  +1 (000) 000-0000
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-brand-600 dark:text-brand-300" aria-hidden />
                42 Automation Street, Test City
              </li>
            </ul>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Demo contact details — no real mailbox is monitored for this practice platform.
            </p>
          </Card>
          <Card testId="contact-faq">
            <CardHeader title="Quick answers" />
            <dl className="space-y-2 text-sm">
              {[
                ['Is the platform free?', 'Yes — no account, no payment.'],
                ['Do you run my tests?', 'No. You automate the labs from your own framework.'],
                ['Where is my progress stored?', 'In your browser, and optionally on the practice API.'],
                ['Can I request a new lab?', 'Yes — pick “Feedback” as the topic and describe the widget.'],
              ].map(([question, answer]) => (
                <div key={question}>
                  <dt className="font-semibold text-navy-800 dark:text-slate-100">{question}</dt>
                  <dd className="text-xs text-slate-500 dark:text-slate-400">{answer}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
