import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import { Select } from '@/components/ui/Field';
import { PracticeGrid, OutputPanel } from './PracticeGrid';
import { cx } from '@/lib/utils';

const COUNTRIES = [
  { value: '', label: 'Select a country' },
  { value: 'in', label: 'India' },
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'au', label: 'Australia' },
  { value: 'ca', label: 'Canada' },
  { value: 'legacy', label: 'Narnia (deprecated)', disabled: true },
];

const LANGUAGES = [
  { value: 'js', label: 'JavaScript' },
  { value: 'ts', label: 'TypeScript' },
  { value: 'py', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cs', label: 'C#' },
  { value: 'rb', label: 'Ruby' },
];

const FRAMEWORKS = [
  'Playwright',
  'Selenium',
  'Cypress',
  'WebdriverIO',
  'Puppeteer',
  'TestCafe',
  'Nightwatch',
  'Robot Framework',
  'Appium',
];

const CITIES: Record<string, string[]> = {
  in: ['Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune'],
  us: ['New York', 'San Francisco', 'Austin', 'Seattle'],
  gb: ['London', 'Manchester', 'Edinburgh'],
  de: ['Berlin', 'Munich', 'Hamburg'],
  au: ['Sydney', 'Melbourne', 'Brisbane'],
  ca: ['Toronto', 'Vancouver', 'Montreal'],
};

const EXPERIENCE = [
  { value: '', label: 'Select experience' },
  { value: '0-1', label: '0 - 1 years' },
  { value: '2-4', label: '2 - 4 years' },
  { value: '5-8', label: '5 - 8 years' },
  { value: '8+', label: '8+ years' },
];

export function DropdownModule() {
  const [country, setCountry] = useState('');
  const [languages, setLanguages] = useState<string[]>(['js']);
  const [experience, setExperience] = useState('');
  const [city, setCity] = useState('');
  const [framework, setFramework] = useState<string | null>(null);
  const [frameworkQuery, setFrameworkQuery] = useState('');
  const [frameworkOpen, setFrameworkOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const comboRef = useRef<HTMLDivElement>(null);

  const cities = country ? CITIES[country] ?? [] : [];
  const filteredFrameworks = useMemo(
    () => FRAMEWORKS.filter((item) => item.toLowerCase().includes(frameworkQuery.trim().toLowerCase())),
    [frameworkQuery],
  );

  useEffect(() => {
    setCity('');
  }, [country]);

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (comboRef.current && !comboRef.current.contains(event.target as Node)) setFrameworkOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const selectFramework = (value: string) => {
    setFramework(value);
    setFrameworkQuery('');
    setFrameworkOpen(false);
  };

  const onComboKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setFrameworkOpen(true);
      setActiveIndex((index) => Math.min(index + 1, filteredFrameworks.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter' && frameworkOpen && filteredFrameworks[activeIndex]) {
      event.preventDefault();
      selectFramework(filteredFrameworks[activeIndex]);
    } else if (event.key === 'Escape') {
      setFrameworkOpen(false);
    }
  };

  return (
    <PracticeGrid
      aside={
        <>
          <Card testId="dropdown-state">
            <CardHeader icon={<SlidersHorizontal className="h-4 w-4" aria-hidden />} title="Selected values" />
            <dl className="space-y-2 text-sm">
              {[
                { label: 'Country', value: COUNTRIES.find((c) => c.value === country)?.label ?? '—', testId: 'dropdown-country-value' },
                {
                  label: 'Languages',
                  value: languages.length ? LANGUAGES.filter((l) => languages.includes(l.value)).map((l) => l.label).join(', ') : '—',
                  testId: 'dropdown-languages-value',
                },
                { label: 'Experience', value: experience ? EXPERIENCE.find((e) => e.value === experience)?.label : '—', testId: 'dropdown-experience-value' },
                { label: 'City', value: city || '—', testId: 'dropdown-city-value' },
                { label: 'Framework', value: framework ?? '—', testId: 'dropdown-framework-value' },
              ].map((row) => (
                <div key={row.label} className="flex items-start justify-between gap-3">
                  <dt className="text-slate-500 dark:text-slate-400">{row.label}</dt>
                  <dd className="text-right font-semibold" data-testid={row.testId}>
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
          <OutputPanel title="Automation tip" tone="info">
            <p className="text-xs">
              For <code className="font-mono">select</code> elements, prefer{' '}
              <code className="font-mono">selectOption</code> / <code className="font-mono">Select</code> helpers over
              clicking options - they work even when the native dropdown cannot be opened by the driver.
            </p>
          </OutputPanel>
        </>
      }
    >
      <Card testId="dropdown-standard">
        <CardHeader
          icon={<ChevronDown className="h-4 w-4" aria-hidden />}
          title="Standard dropdown"
          description="Native select with a disabled (deprecated) option."
          actions={<Badge tone="brand">{COUNTRIES.length - 2} countries</Badge>}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Select
            label="Country"
            name="country"
            id="dropdown-country"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            options={COUNTRIES.filter((option) => option.value !== '')}
            placeholder="Select a country"
            data-testid="dropdown-country"
          />
          <Select
            label="Experience level"
            name="experience"
            id="dropdown-experience"
            value={experience}
            onChange={(event) => setExperience(event.target.value)}
            options={EXPERIENCE.filter((option) => option.value !== '')}
            placeholder="Select experience"
            data-testid="dropdown-experience"
          />
        </div>
      </Card>

      <Card testId="dropdown-multi">
        <CardHeader
          title="Multi-select dropdown"
          description="Hold Ctrl (Windows) / Cmd (macOS) to select several languages."
          actions={
            <button
              type="button"
              onClick={() => setLanguages([])}
              className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-600 hover:border-burgundy-300 dark:border-slate-700 dark:text-slate-300"
              data-testid="dropdown-clear-languages"
            >
              <X className="h-3 w-3" aria-hidden /> Clear
            </button>
          }
        />
        <label className="label" htmlFor="dropdown-multi-languages">
          Programming languages
        </label>
        <select
          id="dropdown-multi-languages"
          name="languages"
          multiple
          size={5}
          data-testid="dropdown-multi-languages"
          value={languages}
          onChange={(event) => setLanguages(Array.from(event.target.selectedOptions, (option) => option.value))}
          className="field h-auto py-1"
          aria-describedby="dropdown-multiselect-hint"
        >
          {LANGUAGES.map((language) => (
            <option key={language.value} value={language.value} className="rounded px-1 py-0.5">
              {language.label}
            </option>
          ))}
        </select>
        <p id="dropdown-multiselect-hint" className="help">
          Selected {languages.length} of {LANGUAGES.length}
        </p>
      </Card>

      <Card testId="dropdown-dependent">
        <CardHeader title="Dependent dropdowns" description="The city list depends on the selected country." />
        <div className="grid gap-3 sm:grid-cols-2">
          <Select
            label="Country (source)"
            name="dependent-country"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            options={COUNTRIES.filter((option) => option.value !== '' && !option.disabled)}
            placeholder="Select a country"
            data-testid="dropdown-dependent-country"
          />
          <Select
            label="City (dependent)"
            name="city"
            id="dropdown-city"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            options={cities.map((item) => ({ value: item, label: item }))}
            placeholder={country ? (cities.length ? 'Select a city' : 'No cities available') : 'Select a country first'}
            disabled={!country || cities.length === 0}
            data-testid="dropdown-city"
          />
        </div>
        {country && cities.length === 0 ? (
          <p className="help mt-2" data-testid="dropdown-city-empty">
            No cities configured for this country.
          </p>
        ) : null}
      </Card>

      <Card testId="dropdown-searchable">
        <CardHeader icon={<Search className="h-4 w-4" aria-hidden />} title="Searchable dropdown" description="A combobox with keyboard support (↑ ↓ Enter Esc)." />
        <div ref={comboRef} className="relative" data-testid="dropdown-combobox">
          <label className="label" htmlFor="dropdown-search">
            Framework
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                id="dropdown-search"
                role="combobox"
                aria-expanded={frameworkOpen}
                aria-controls="dropdown-framework-listbox"
                aria-autocomplete="list"
                aria-label="Framework"
                placeholder="Search frameworks…"
                value={frameworkOpen ? frameworkQuery : framework ?? ''}
                onChange={(event) => {
                  setFrameworkQuery(event.target.value);
                  setFrameworkOpen(true);
                  setActiveIndex(0);
                }}
                onFocus={() => setFrameworkOpen(true)}
                onKeyDown={onComboKeyDown}
                className="field pl-9"
                data-testid="dropdown-search"
                autoComplete="off"
              />
            </div>
            {framework ? (
              <button
                type="button"
                onClick={() => {
                  setFramework(null);
                  setFrameworkQuery('');
                }}
                className="rounded-md border border-slate-300 px-2 py-2 text-[11px] font-semibold text-slate-500 dark:border-slate-700 dark:text-slate-300"
                data-testid="dropdown-clear-framework"
              >
                Clear
              </button>
            ) : null}
          </div>
          {frameworkOpen ? (
            <ul
              id="dropdown-framework-listbox"
              role="listbox"
              className="scrollbar-thin absolute z-20 mt-1 max-h-52 w-full overflow-auto rounded-xl border border-slate-200 bg-white p-1 shadow-card dark:border-slate-700 dark:bg-slate-900"
              data-testid="dropdown-framework-listbox"
            >
              {filteredFrameworks.length === 0 ? (
                <li className="px-3 py-2 text-xs text-slate-500">No frameworks match “{frameworkQuery}”</li>
              ) : (
                filteredFrameworks.map((item, index) => (
                  <li key={item}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={framework === item}
                      onClick={() => selectFramework(item)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cx(
                        'flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-sm',
                        index === activeIndex ? 'bg-burgundy-50 text-burgundy-800 dark:bg-burgundy-950/60 dark:text-burgundy-100' : 'text-slate-700 dark:text-slate-200',
                      )}
                      data-testid={`dropdown-framework-option-${item.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {item}
                      {framework === item ? <Check className="h-3.5 w-3.5" aria-hidden /> : null}
                    </button>
                  </li>
                ))
              )}
            </ul>
          ) : null}
        </div>
      </Card>
    </PracticeGrid>
  );
}
