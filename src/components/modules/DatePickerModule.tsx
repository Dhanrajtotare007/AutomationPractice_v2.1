import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CalendarRange, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Field';
import { cx, formatDate, parseIsoDate, toIsoDate } from '@/lib/utils';
import { OutputPanel, PracticeGrid } from './PracticeGrid';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

/** Monday-first weekday index (0 = Monday). */
const weekdayIndex = (date: Date) => (date.getDay() + 6) % 7;

const isWeekend = (iso: string) => {
  const date = parseIsoDate(iso);
  return Boolean(date) && (date as Date).getDay() % 6 === 0;
};

export function Calendar({
  selected,
  onSelect,
  minIso,
  maxIso,
  disabledDates = [],
  rangeStart,
  rangeEnd,
  testIdPrefix = 'calendar',
  initialMonth,
}: {
  selected?: string;
  onSelect: (iso: string) => void;
  minIso?: string;
  maxIso?: string;
  disabledDates?: string[];
  rangeStart?: string;
  rangeEnd?: string;
  testIdPrefix?: string;
  initialMonth?: { year: number; month: number };
}) {
  const [view, setView] = useState(() => {
    if (initialMonth) return initialMonth;
    const initial = parseIsoDate(selected ?? rangeStart ?? '') ?? new Date();
    return { year: initial.getFullYear(), month: initial.getMonth() };
  });

  useEffect(() => {
    if (!rangeStart) return;
    const start = parseIsoDate(rangeStart);
    if (!start) return;
    setView({ year: start.getFullYear(), month: start.getMonth() });
  }, [rangeStart]);

  const grid = useMemo(() => {
    const first = new Date(view.year, view.month, 1);
    const lead = weekdayIndex(first);
    const total = daysInMonth(view.year, view.month);
    const cells: (string | null)[] = Array.from({ length: lead }, () => null);
    for (let day = 1; day <= total; day += 1) cells.push(toIsoDate(new Date(view.year, view.month, day)));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [view]);

  const shift = (delta: number) => {
    setView((current) => {
      const date = new Date(current.year, current.month + delta, 1);
      return { year: date.getFullYear(), month: date.getMonth() };
    });
  };

  const monthLabel = new Date(view.year, view.month, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  return (
    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700" data-testid={`${testIdPrefix}-widget`}>
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => shift(-1)}
          aria-label="Previous month"
          className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-brand-700 dark:hover:bg-slate-800 dark:hover:text-white"
          data-testid={`${testIdPrefix}-prev-month`}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100" data-testid={`${testIdPrefix}-month-label`}>
          {monthLabel}
        </p>
        <button
          type="button"
          onClick={() => shift(1)}
          aria-label="Next month"
          className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-brand-700 dark:hover:bg-slate-800 dark:hover:text-white"
          data-testid={`${testIdPrefix}-next-month`}
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {WEEKDAYS.map((day) => (
          <span key={day} className="pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {day}
          </span>
        ))}
        {grid.map((iso, index) => {
          if (!iso) return <span key={`empty-${index}`} />;
          const outsideRange = (minIso !== undefined && iso < minIso) || (maxIso !== undefined && iso > maxIso);
          const blocked = disabledDates.includes(iso);
          const disabled = outsideRange || blocked;
          const isSelected = iso === selected;
          const inRange = Boolean(rangeStart && rangeEnd && iso >= rangeStart && iso <= rangeEnd);
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              title={blocked ? 'Weekends are disabled in this example' : undefined}
              onClick={() => onSelect(iso)}
              aria-label={formatDate(iso)}
              aria-pressed={isSelected}
              data-testid={`${testIdPrefix}-day-${iso}`}
              data-disabled-reason={blocked ? 'weekend' : undefined}
              className={cx(
                'grid h-8 place-items-center rounded-md text-xs font-semibold transition',
                disabled && 'cursor-not-allowed text-slate-300 line-through dark:text-slate-600',
                !disabled && !isSelected && !inRange && 'text-slate-700 hover:bg-brand-50 hover:text-brand-700 dark:text-slate-200 dark:hover:bg-brand-950/50',
                inRange && !isSelected && 'bg-accent-100 text-accent-800 dark:bg-accent-950/60 dark:text-accent-200',
                isSelected && 'bg-brand-700 text-white',
              )}
            >
              {Number(iso.slice(-2))}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DatePickerModule() {
  const today = toIsoDate(new Date());
  const minDate = '2026-01-01';
  const maxDate = '2027-12-31';

  /** Weekends for the next 60 days are disabled in the range calendar. */
  const disabledDates = useMemo(() => {
    const list: string[] = [];
    const cursor = new Date();
    for (let i = 0; i < 60; i += 1) {
      const date = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + i);
      if (date.getDay() === 0 || date.getDay() === 6) list.push(toIsoDate(date));
    }
    return list;
  }, []);

  const [native, setNative] = useState('');
  const [calendarDate, setCalendarDate] = useState('2026-12-15');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');
  const [time, setTime] = useState('09:30');

  const rangeDays = useMemo(() => {
    const start = parseIsoDate(rangeStart);
    const end = parseIsoDate(rangeEnd);
    if (!start || !end) return 0;
    return Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
  }, [rangeStart, rangeEnd]);

  return (
    <PracticeGrid
      aside={
        <>
          <Card testId="date-summary">
            <CardHeader icon={<Clock className="h-4 w-4" aria-hidden />} title="Selected dates" />
            <dl className="space-y-1.5 text-sm">
              {[
                { label: 'Native date', value: native ? formatDate(native) : '—', testId: 'date-native-value' },
                { label: 'Calendar', value: calendarDate ? formatDate(calendarDate) : '—', testId: 'date-calendar-value' },
                { label: 'Range start', value: rangeStart ? formatDate(rangeStart) : '—', testId: 'date-range-start-value' },
                { label: 'Range end', value: rangeEnd ? formatDate(rangeEnd) : '—', testId: 'date-range-end-value' },
                { label: 'Time', value: time || '—', testId: 'date-time-value' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-2">
                  <dt className="text-slate-500 dark:text-slate-400">{row.label}</dt>
                  <dd className="font-semibold" data-testid={row.testId}>
                    {row.value}
                  </dd>
                </div>
              ))}
              <div className="flex items-center justify-between gap-2 border-t border-slate-200 pt-1.5 dark:border-slate-700">
                <dt className="text-slate-500 dark:text-slate-400">Days in range</dt>
                <dd className="font-semibold" data-testid="date-range-days">
                  {rangeStart && rangeEnd ? rangeDays : 0}
                </dd>
              </div>
            </dl>
          </Card>
          <OutputPanel title="Disabled dates" tone="info">
            <p className="text-xs">
              Weekends within the next 60 days are disabled in the range calendar, and both calendars are limited to{' '}
              <strong>1 Jan 2026 – 31 Dec 2027</strong>. Disabled days cannot be selected.
            </p>
          </OutputPanel>
        </>
      }
    >
      <Card testId="date-native-card">
        <CardHeader
          icon={<CalendarDays className="h-4 w-4" aria-hidden />}
          title="Native date and time inputs"
          description="The fastest path for automation: fill the value directly (ISO format)."
          actions={<Badge tone="brand">type=date</Badge>}
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <Input
            label="Appointment date"
            name="appointment-date"
            type="date"
            value={native}
            min={minDate}
            max={maxDate}
            onChange={(event) => setNative(event.target.value)}
            data-testid="date-native"
          />
          <Input
            label="Appointment time"
            name="appointment-time"
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
            data-testid="date-time"
          />
          <label className="block">
            <span className="label">Quick presets</span>
            <select
              className="field"
              value=""
              onChange={(event) => setNative(event.target.value)}
              data-testid="date-preset"
              aria-label="Date presets"
            >
              <option value="">Choose a preset…</option>
              <option value={today}>Today ({today})</option>
              <option value="2026-12-25">Christmas 2026</option>
              <option value="2027-01-01">New Year 2027</option>
            </select>
          </label>
        </div>
        <p className="help">
          Min: {formatDate(minDate)} · Max: {formatDate(maxDate)}
        </p>
      </Card>

      <Card testId="date-calendar-card">
        <CardHeader
          icon={<CalendarDays className="h-4 w-4" aria-hidden />}
          title="Custom calendar widget"
          description="A non-native calendar: navigate months, select a day and confirm."
          actions={
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCalendarOpen((open) => !open)}
              aria-expanded={calendarOpen}
              data-testid="date-calendar-trigger"
            >
              {calendarOpen ? 'Hide calendar' : 'Open calendar'}
            </Button>
          }
        />
        <div className="flex flex-wrap items-center gap-3">
          <input
            readOnly
            value={calendarDate ? formatDate(calendarDate) : ''}
            placeholder="No date selected"
            aria-label="Selected calendar date"
            className="field max-w-xs"
            data-testid="date-calendar-display"
          />
          <span className="text-xs text-slate-500 dark:text-slate-400">
            ISO value: <code className="font-mono" data-testid="date-calendar-iso">{calendarDate || '—'}</code>
          </span>
        </div>
        {calendarOpen ? (
          <div className="mt-3 max-w-sm">
            <Calendar selected={calendarDate} onSelect={setCalendarDate} minIso={minDate} maxIso={maxDate} initialMonth={{ year: 2026, month: 11 }} />
            <Button size="sm" className="mt-2 w-full" onClick={() => setCalendarOpen(false)} data-testid="date-calendar-confirm">
              Confirm {calendarDate ? formatDate(calendarDate) : ''}
            </Button>
          </div>
        ) : null}
      </Card>

      <Card testId="date-range-card">
        <CardHeader
          icon={<CalendarRange className="h-4 w-4" aria-hidden />}
          title="Date range with disabled dates"
          description="Pick a start and end date; weekend dates are disabled."
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Range start"
            name="range-start"
            type="date"
            value={rangeStart}
            min={minDate}
            max={rangeEnd || maxDate}
            onChange={(event) => {
              setRangeStart(event.target.value);
              if (rangeEnd && event.target.value > rangeEnd) setRangeEnd('');
            }}
            data-testid="date-range-start"
          />
          <Input
            label="Range end"
            name="range-end"
            type="date"
            value={rangeEnd}
            min={rangeStart || minDate}
            max={maxDate}
            onChange={(event) => setRangeEnd(event.target.value)}
            data-testid="date-range-end"
          />
        </div>
        <div className="mt-3">
          <Calendar
            testIdPrefix="range-calendar"
            selected={rangeStart}
            rangeStart={rangeStart || undefined}
            rangeEnd={rangeEnd || undefined}
            minIso={minDate}
            maxIso={maxDate}
            disabledDates={disabledDates}
            onSelect={(iso) => {
              if (isWeekend(iso)) return;
              if (!rangeStart || rangeEnd) {
                setRangeStart(iso);
                setRangeEnd('');
              } else if (iso < rangeStart) {
                setRangeStart(iso);
              } else {
                setRangeEnd(iso);
              }
            }}
          />
        </div>
        <p className="help mt-2" data-testid="date-range-summary">
          {rangeStart && rangeEnd
            ? `${formatDate(rangeStart)} → ${formatDate(rangeEnd)} · ${rangeDays} day(s)`
            : 'Select two dates to form a range (start then end).'}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setRangeStart('2026-03-02');
              setRangeEnd('2026-03-06');
            }}
            data-testid="date-range-preset"
          >
            Use 2 – 6 Mar 2026
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setRangeStart('');
              setRangeEnd('');
            }}
            data-testid="date-range-clear"
          >
            Clear range
          </Button>
        </div>
      </Card>
    </PracticeGrid>
  );
}
