import { useState } from 'react';
import { Clock, GraduationCap, Layers } from 'lucide-react';
import { COURSES } from '@shared/content';
import { Badge, DifficultyBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Field';
import { useNotify } from '@/components/ui/Toast';

export function CoursesPage() {
  const notify = useNotify();
  const [level, setLevel] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [enroll, setEnroll] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  const visible = level === 'All' ? COURSES : COURSES.filter((course) => course.level === level);
  const active = COURSES.find((course) => course.id === enroll);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email.trim())) {
      setEmailError('Enter a valid email address');
      return;
    }
    setEmailError(null);
    notify.success('You are on the list', `We will e-mail ${email} when ${active?.title} opens.`);
    setEnroll(null);
    setEmail('');
  };

  return (
    <div className="space-y-5" data-testid="courses-page">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge tone="brand">Courses</Badge>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Learn automation that survives production</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Instructor-led and self-paced tracks built around the same modules you find in the playground. Prices are
            illustrative placeholders for this demo.
          </p>
        </div>
        <div className="flex gap-1" role="group" aria-label="Filter courses by level">
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setLevel(item)}
              aria-pressed={level === item}
              data-testid={`courses-filter-${item.toLowerCase()}`}
              className={
                level === item
                  ? 'rounded-full bg-burgundy-700 px-3 py-1 text-[11px] font-bold text-white'
                  : 'rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-600 hover:border-burgundy-300 dark:border-slate-700 dark:text-slate-300'
              }
            >
              {item}
            </button>
          ))}
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" data-testid="courses-grid">
        {visible.map((course) => (
          <Card key={course.id} className="flex flex-col" testId={`course-${course.id}`}>
            <div className="flex items-start justify-between gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-burgundy-50 text-burgundy-700 dark:bg-burgundy-900/40 dark:text-burgundy-200">
                <GraduationCap className="h-5 w-5" aria-hidden />
              </span>
              <DifficultyBadge level={course.level} />
            </div>
            <h2 className="mt-3 text-base font-bold text-slate-900 dark:text-white">{course.title}</h2>
            <p className="mt-1 flex-1 text-sm text-slate-500 dark:text-slate-400">{course.summary}</p>
            <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-800">
                <Clock className="h-3 w-3" aria-hidden /> {course.weeks} weeks
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-800">
                <Layers className="h-3 w-3" aria-hidden /> {course.lessons} lessons
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                ${course.price}
              </span>
            </div>
            <ul className="mt-3 space-y-0.5 text-xs text-slate-600 dark:text-slate-300">
              {course.highlights.map((highlight) => (
                <li key={highlight}>• {highlight}</li>
              ))}
            </ul>
            <Button className="mt-3" onClick={() => setEnroll(course.id)} data-testid={`course-enroll-${course.id}`}>
              Reserve a seat
            </Button>
          </Card>
        ))}
      </div>

      <Card testId="courses-outline">
        <CardHeader title="Path suggestion" description="Not sure where to start? Follow this order." />
        <ol className="grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
          <li>1. Playwright Fundamentals → practice Checkbox, Radio and Form modules</li>
          <li>2. Selenium with Python → practice Web Table, iframe and Alerts</li>
          <li>3. Cypress Masterclass → practice Dropdown, Notifications and Date Picker</li>
          <li>4. Automation Architecture → practice Shadow DOM, Drag &amp; Drop and Waits</li>
        </ol>
      </Card>

      <Modal
        open={Boolean(enroll)}
        onClose={() => setEnroll(null)}
        title={`Reserve a seat · ${active?.title ?? ''}`}
        testId="enroll-modal"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEnroll(null)}>
              Cancel
            </Button>
            <Button type="submit" form="enroll-form" data-testid="enroll-submit">
              Reserve
            </Button>
          </>
        }
      >
        <form id="enroll-form" onSubmit={submit} className="space-y-3" noValidate>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Leave your e-mail and we will notify you when enrolment opens. Price: <strong>${active?.price}</strong>.
          </p>
          <Input
            label="Email address"
            name="enroll-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={emailError ?? undefined}
            errorTestId="enroll-email-error"
            required
            data-testid="enroll-email"
          />
        </form>
      </Modal>
    </div>
  );
}
