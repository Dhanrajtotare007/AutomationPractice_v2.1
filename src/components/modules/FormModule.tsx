import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, ClipboardList, Loader2, RotateCcw, Send } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { Checkbox, Input, Radio, Select, Textarea } from '@/components/ui/Field';
import { OutputPanel, PracticeGrid } from './PracticeGrid';
import { useNotify } from '@/components/ui/Toast';

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: string;
  dob: string;
  experience: string;
  country: string;
  gender: string;
  bio: string;
  terms: boolean;
  newsletter: boolean;
}

const INITIAL: FormValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  age: '',
  dob: '',
  experience: '',
  country: '',
  gender: '',
  bio: '',
  terms: false,
  newsletter: true,
};

type Errors = Partial<Record<keyof FormValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

function passwordChecks(password: string) {
  return [
    { label: 'At least 8 characters', ok: password.length >= 8, testId: 'rule-length' },
    { label: 'One uppercase letter', ok: /[A-Z]/.test(password), testId: 'rule-upper' },
    { label: 'One lowercase letter', ok: /[a-z]/.test(password), testId: 'rule-lower' },
    { label: 'One number', ok: /\d/.test(password), testId: 'rule-number' },
    { label: 'One symbol', ok: /[^A-Za-z0-9]/.test(password), testId: 'rule-symbol' },
  ];
}

export function validate(values: FormValues): Errors {
  const errors: Errors = {};
  if (values.firstName.trim().length < 2) errors.firstName = 'First name must be at least 2 characters';
  if (values.lastName.trim().length < 2) errors.lastName = 'Last name must be at least 2 characters';
  if (!values.email.trim()) errors.email = 'Email address is required';
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Enter a valid email address, e.g. name@example.com';
  if (!values.password) errors.password = 'Password is required';
  else if (passwordChecks(values.password).some((rule) => !rule.ok)) errors.password = 'Password does not meet all requirements';
  if (values.confirmPassword !== values.password) errors.confirmPassword = 'Passwords do not match';
  const age = Number(values.age);
  if (!values.age) errors.age = 'Age is required';
  else if (!Number.isFinite(age) || age < 18 || age > 99) errors.age = 'Age must be between 18 and 99';
  if (!values.dob) errors.dob = 'Date of birth is required';
  if (!values.experience) errors.experience = 'Select your experience level';
  if (!values.country) errors.country = 'Select a country';
  if (!values.gender) errors.gender = 'Select an option';
  if (values.bio.trim().length > 0 && values.bio.trim().length < 20) errors.bio = 'Bio must be at least 20 characters (or leave it empty)';
  if (!values.terms) errors.terms = 'You must accept the terms to continue';
  return errors;
}

export function FormModule() {
  const [values, setValues] = useState<FormValues>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const notify = useNotify();

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const rules = passwordChecks(values.password);
  const strength = useMemo(() => Math.round((rules.filter((rule) => rule.ok).length / rules.length) * 100), [rules]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    setSubmitCount((count) => count + 1);
    if (Object.keys(found).length > 0) {
      setSubmitted(null);
      notify.error('Please fix the highlighted fields', `${Object.keys(found).length} validation error(s) found.`);
      const firstKey = Object.keys(found)[0];
      document.getElementById(`form-field-${firstKey}`)?.focus();
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setSubmitted(values);
      notify.success('Account created', `Welcome aboard, ${values.firstName}!`);
    }, 600);
  };

  const handleReset = () => {
    setValues(INITIAL);
    setErrors({});
    setSubmitted(null);
    notify.info('Form reset', 'All fields have been cleared.');
  };

  return (
    <form onSubmit={handleSubmit} noValidate data-testid="registration-form">
      <PracticeGrid
        aside={
          <>
            <Card testId="form-summary">
              <CardHeader icon={<ClipboardList className="h-4 w-4" aria-hidden />} title="Submission" description="Results of the last submit attempt." />
              <p className="text-xs text-slate-500 dark:text-slate-400" data-testid="form-submit-count">
                Submit attempts: <strong>{submitCount}</strong> · errors: <strong>{Object.keys(errors).length}</strong>
              </p>
              {submitted ? (
                <OutputPanel title="Submitted values" tone="success" testId="form-success">
                  <dl className="space-y-1 text-xs">
                    {[
                      ['Name', `${submitted.firstName} ${submitted.lastName}`],
                      ['Email', submitted.email],
                      ['Age', submitted.age],
                      ['DOB', submitted.dob],
                      ['Experience', submitted.experience],
                      ['Country', submitted.country],
                      ['Gender', submitted.gender],
                      ['Newsletter', submitted.newsletter ? 'yes' : 'no'],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-3">
                        <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
                        <dd className="text-right font-semibold">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </OutputPanel>
              ) : (
                <OutputPanel title="No successful submission yet" testId="form-pending">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Complete the required fields and press <strong>Create account</strong>. Validation messages appear
                    inline next to each field.
                  </p>
                </OutputPanel>
              )}
            </Card>

            <Card testId="form-password-strength">
              <CardHeader title="Password rules" description="Live feedback - all rules must pass." />
              <div className="mb-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full transition-all ${strength < 40 ? 'bg-red-500' : strength < 100 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${strength}%` }}
                  data-testid="form-password-meter"
                  data-value={strength}
                />
              </div>
              <ul className="grid gap-1 text-xs">
                {rules.map((rule) => (
                  <li key={rule.testId} className="flex items-center gap-1.5" data-testid={`form-${rule.testId}`} data-ok={rule.ok}>
                    {rule.ok ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
                    ) : (
                      <AlertTriangle className="h-3.5 w-3.5 text-slate-400" aria-hidden />
                    )}
                    <span className={rule.ok ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}>{rule.label}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </>
        }
      >
        <Card testId="form-card">
          <CardHeader
            icon={<ClipboardList className="h-4 w-4" aria-hidden />}
            title="Create your account"
            description="A realistic registration form with required fields and cross-field validation."
            actions={<Badge tone="warning">required fields marked *</Badge>}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <div id="form-field-firstName">
              <Input
                label="First name"
                name="firstName"
                id="form-first-name"
                placeholder="Enter your first name"
                value={values.firstName}
                onChange={(event) => set('firstName', event.target.value)}
                error={errors.firstName}
                errorTestId="form-error-first-name"
                required
                data-testid="form-first-name"
                autoComplete="given-name"
              />
            </div>
            <Input
              label="Last name"
              name="lastName"
                id="form-last-name"
              placeholder="Enter your last name"
              value={values.lastName}
              onChange={(event) => set('lastName', event.target.value)}
              error={errors.lastName}
              errorTestId="form-error-last-name"
              required
              data-testid="form-last-name"
              autoComplete="family-name"
            />
            <Input
              label="Email address"
              name="email"
                id="form-email"
              type="email"
              placeholder="name@example.com"
              value={values.email}
              onChange={(event) => set('email', event.target.value)}
              error={errors.email}
              errorTestId="form-error-email"
              required
              data-testid="form-email"
              autoComplete="email"
            />
            <Input
              label="Password"
              name="password"
                id="form-password"
              type="password"
              placeholder="Minimum 8 characters"
              value={values.password}
              onChange={(event) => set('password', event.target.value)}
              error={errors.password}
              errorTestId="form-error-password"
              required
              data-testid="form-password"
              autoComplete="new-password"
            />
            <Input
              label="Confirm password"
              name="confirmPassword"
                id="form-confirm-password"
              type="password"
              placeholder="Re-enter the password"
              value={values.confirmPassword}
              onChange={(event) => set('confirmPassword', event.target.value)}
              error={errors.confirmPassword}
              errorTestId="form-error-confirm-password"
              required
              data-testid="form-confirm-password"
              autoComplete="new-password"
            />
            <Input
              label="Age"
              name="age"
                id="form-age"
              type="number"
              min={18}
              max={99}
              placeholder="18 - 99"
              value={values.age}
              onChange={(event) => set('age', event.target.value)}
              error={errors.age}
              errorTestId="form-error-age"
              required
              data-testid="form-age"
            />
            <Input
              label="Date of birth"
              name="dob"
                id="form-dob"
              type="date"
              value={values.dob}
              onChange={(event) => set('dob', event.target.value)}
              error={errors.dob}
              errorTestId="form-error-dob"
              required
              data-testid="form-dob"
            />
            <Select
              label="Experience level"
              name="experience"
              value={values.experience}
              onChange={(event) => set('experience', event.target.value)}
              options={[
                { value: 'junior', label: 'Junior (0-2 years)' },
                { value: 'mid', label: 'Mid (2-5 years)' },
                { value: 'senior', label: 'Senior (5+ years)' },
                { value: 'lead', label: 'Lead / Architect' },
              ]}
              placeholder="Select experience"
              error={errors.experience}
              errorTestId="form-error-experience"
              required
              data-testid="form-experience"
            />
            <Select
              label="Country"
              name="country"
              value={values.country}
              onChange={(event) => set('country', event.target.value)}
              options={[
                { value: 'in', label: 'India' },
                { value: 'us', label: 'United States' },
                { value: 'gb', label: 'United Kingdom' },
                { value: 'de', label: 'Germany' },
                { value: 'au', label: 'Australia' },
              ]}
              placeholder="Select country"
              error={errors.country}
              errorTestId="form-error-country"
              required
              data-testid="form-country"
            />
            <div className="sm:col-span-2">
              <Textarea
                label="Short bio (optional)"
                name="bio"
                rows={3}
                placeholder="Tell us about your automation experience…"
                value={values.bio}
                onChange={(event) => set('bio', event.target.value)}
                error={errors.bio}
                errorTestId="form-error-bio"
                hint="Minimum 20 characters if provided."
                data-testid="form-bio"
              />
            </div>
            <fieldset className="sm:col-span-2">
              <legend className="label">Gender *</legend>
              <div className="grid gap-1 sm:grid-cols-3">
                {[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                ].map((option) => (
                  <Radio
                    key={option.value}
                    name="form-gender"
                    value={option.value}
                    label={option.label}
                    checked={values.gender === option.value}
                    onChange={() => set('gender', option.value)}
                    data-testid={`form-gender-${option.value}`}
                  />
                ))}
              </div>
              {errors.gender ? (
                <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400" data-testid="form-error-gender" role="alert">
                  ⚠ {errors.gender}
                </p>
              ) : null}
            </fieldset>
            <div className="sm:col-span-2 space-y-1">
              <Checkbox
                name="terms"
                label="I agree to the terms of service and privacy policy"
                checked={values.terms}
                onChange={(event) => set('terms', event.target.checked)}
                data-testid="form-terms"
              />
              {errors.terms ? (
                <p className="text-xs font-medium text-red-600 dark:text-red-400" data-testid="form-error-terms" role="alert">
                  ⚠ {errors.terms}
                </p>
              ) : null}
              <Checkbox
                name="form-newsletter"
                label="Send me product updates and automation tips"
                checked={values.newsletter}
                onChange={(event) => set('newsletter', event.target.checked)}
                data-testid="form-newsletter"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
            <Button
              type="submit"
              loading={submitting}
              leftIcon={submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
              data-testid="form-submit-text"
            >
              Create account
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              leftIcon={<RotateCcw className="h-4 w-4" aria-hidden />}
              data-testid="form-reset"
            >
              Reset form
            </Button>
            <span className="self-center text-xs text-slate-500 dark:text-slate-400">
              No data is sent to a server - this form is for practice only.
            </span>
          </div>
        </Card>
      </PracticeGrid>
    </form>
  );
}
