import { useState } from 'react';
import { CircleDot, CreditCard, User } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import { Radio } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { PracticeGrid, OutputPanel } from './PracticeGrid';

const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

const PAYMENTS = [
  { value: 'credit-card', label: 'Credit card', hint: 'Visa, Mastercard, Amex' },
  { value: 'upi', label: 'UPI', hint: 'Pay using any UPI app' },
  { value: 'net-banking', label: 'Net banking', hint: 'Major Indian banks' },
  { value: 'paypal', label: 'PayPal', hint: 'International payments' },
];

const PLANS = [
  { value: 'basic', label: 'Basic — $0 / month', disabled: false },
  { value: 'premium', label: 'Premium — $19 / month', disabled: false },
  { value: 'enterprise', label: 'Enterprise — contact sales', disabled: false },
  { value: 'legacy', label: 'Legacy plan (no longer available)', disabled: true },
];

export function RadioModule() {
  const [gender, setGender] = useState('');
  const [payment, setPayment] = useState('credit-card');
  const [plan, setPlan] = useState('basic');

  const reset = () => {
    setGender('');
    setPayment('credit-card');
    setPlan('basic');
  };

  return (
    <PracticeGrid
      aside={
        <>
          <Card testId="radio-state">
            <CardHeader icon={<CircleDot className="h-4 w-4" aria-hidden />} title="Selected options" />
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500 dark:text-slate-400">Gender</dt>
                <dd className="font-semibold" data-testid="radio-gender-value">
                  {gender || '—'}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500 dark:text-slate-400">Payment</dt>
                <dd className="font-semibold" data-testid="radio-payment-value">
                  {payment}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500 dark:text-slate-400">Plan</dt>
                <dd className="font-semibold" data-testid="radio-plan-value">
                  {plan}
                </dd>
              </div>
            </dl>
            <Button size="sm" variant="outline" className="mt-3 w-full" onClick={reset} data-testid="radio-reset">
              Reset selections
            </Button>
          </Card>
          <OutputPanel title="Selection summary" tone="info" testId="radio-summary">
            <p className="text-xs">
              Profile: <strong>{gender || 'not selected'}</strong> · paying with <strong>{payment}</strong> on the{' '}
              <strong>{plan}</strong> plan.
            </p>
          </OutputPanel>
        </>
      }
    >
      <Card testId="radio-gender">
        <CardHeader
          icon={<User className="h-4 w-4" aria-hidden />}
          title="Gender selection"
          description="Classic single-choice radio group with a live readout."
          actions={<Badge tone="brand">name=&quot;gender&quot;</Badge>}
        />
        <fieldset>
          <legend className="label">Gender</legend>
          <div className="grid gap-0.5 sm:grid-cols-2">
            {GENDERS.map((option) => (
              <Radio
                key={option.value}
                name="gender"
                value={option.value}
                label={option.label}
                checked={gender === option.value}
                onChange={() => setGender(option.value)}
                data-testid={`radio-gender-${option.value}`}
              />
            ))}
          </div>
        </fieldset>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Radio
            name="gender-male-id"
            value="male-id"
            id="radio-male"
            testId="radio-male"
            label="I am male (dedicated id=radio-male)"
            checked={gender === 'male'}
            onChange={() => setGender('male')}
          />
          <Radio
            name="gender-female-label"
            value="female"
            testId="radio-female"
            label="Female"
            checked={gender === 'female'}
            onChange={() => setGender('female')}
          />
        </div>
      </Card>

      <Card testId="radio-payment">
        <CardHeader
          icon={<CreditCard className="h-4 w-4" aria-hidden />}
          title="Payment method"
          description="Payment options share the same name - only one can be selected."
        />
        <fieldset>
          <legend className="label">Payment method</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {PAYMENTS.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-start gap-2 rounded-xl border p-3 text-sm transition ${
                  payment === option.value
                    ? 'border-burgundy-500 bg-burgundy-50 dark:border-burgundy-500 dark:bg-burgundy-950/40'
                    : 'border-slate-200 hover:border-burgundy-300 dark:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={option.value}
                  className="mt-0.5 h-4 w-4 accent-burgundy-700"
                  checked={payment === option.value}
                  onChange={() => setPayment(option.value)}
                  data-testid={`radio-payment-${option.value}`}
                />
                <span>
                  <span className="block font-semibold text-slate-800 dark:text-slate-100">{option.label}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{option.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </Card>

      <Card testId="radio-plans">
        <CardHeader title="Subscription plan" description="Includes a disabled option that cannot be selected." />
        <fieldset>
          <legend className="label">Subscription plan</legend>
          <div className="grid gap-0.5">
            {PLANS.map((option) => (
              <Radio
                key={option.value}
                name="plan"
                value={option.value}
                label={
                  <span className="flex items-center gap-2">
                    {option.label}
                    {option.disabled ? (
                      <Badge tone="danger" className="text-[10px]">
                        disabled
                      </Badge>
                    ) : null}
                  </span>
                }
                disabled={option.disabled}
                checked={plan === option.value}
                onChange={() => setPlan(option.value)}
                testId={option.disabled ? 'radio-disabled' : `radio-plan-${option.value}`}
              />
            ))}
          </div>
        </fieldset>
      </Card>
    </PracticeGrid>
  );
}
