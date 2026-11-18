import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { clsx, type ClassValue } from '@/lib/clsx';

interface FieldShellProps {
  label?: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  errorTestId?: string;
  hintTestId?: string;
  className?: ClassValue;
  children: ReactNode;
}

export function FieldShell({ label, htmlFor, hint, error, required, errorTestId, hintTestId, className, children }: FieldShellProps) {
  return (
    <div className={clsx('w-full', className)}>
      {label ? (
        <label className="label" htmlFor={htmlFor}>
          {label}
          {required ? (
            <span className="ml-1 text-red-500" aria-hidden>
              *
            </span>
          ) : null}
        </label>
      ) : null}
      {children}
      {hint && !error ? (
        <p className="help" data-testid={hintTestId}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="mt-1 flex items-start gap-1 text-xs font-medium text-red-600 dark:text-red-400" data-testid={errorTestId} role="alert">
          <span aria-hidden>⚠</span>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  errorTestId?: string;
  hintTestId?: string;
  wrapperClassName?: ClassValue;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, errorTestId, hintTestId, wrapperClassName, className, id, required, ...rest },
  ref,
) {
  const inputId = id ?? rest.name;
  return (
    <FieldShell
      label={label}
      htmlFor={inputId}
      hint={hint}
      error={error}
      required={required}
      errorTestId={errorTestId}
      hintTestId={hintTestId}
      className={wrapperClassName}
    >
      <input
        ref={ref}
        id={inputId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorTestId : hint ? hintTestId : undefined}
        className={clsx('field', error && 'field-error', className)}
        {...rest}
      />
    </FieldShell>
  );
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  errorTestId?: string;
  wrapperClassName?: ClassValue;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, errorTestId, wrapperClassName, className, id, required, ...rest },
  ref,
) {
  const areaId = id ?? rest.name;
  return (
    <FieldShell label={label} htmlFor={areaId} hint={hint} error={error} required={required} errorTestId={errorTestId} className={wrapperClassName}>
      <textarea
        ref={ref}
        id={areaId}
        required={required}
        aria-invalid={error ? true : undefined}
        className={clsx('field min-h-24 resize-y', error && 'field-error', className)}
        {...rest}
      />
    </FieldShell>
  );
});

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  errorTestId?: string;
  options: SelectOption[];
  placeholder?: string;
  wrapperClassName?: ClassValue;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, errorTestId, options, placeholder, wrapperClassName, className, id, required, ...rest },
  ref,
) {
  const selectId = id ?? rest.name;
  return (
    <FieldShell label={label} htmlFor={selectId} hint={hint} error={error} required={required} errorTestId={errorTestId} className={wrapperClassName}>
      <select
        ref={ref}
        id={selectId}
        required={required}
        aria-invalid={error ? true : undefined}
        className={clsx('field appearance-none bg-[length:16px] pr-9', error && 'field-error', className)}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.6rem center',
        }}
        {...rest}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
});

export function Checkbox({
  label,
  testId,
  className,
  id,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; testId?: string }) {
  const inputId = id ?? rest.name;
  return (
    <label className={clsx('check-row cursor-pointer', rest.disabled && 'cursor-not-allowed opacity-60', className)} htmlFor={inputId}>
      <input
        id={inputId}
        type="checkbox"
        data-testid={testId}
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-burgundy-700 disabled:cursor-not-allowed"
        {...rest}
      />
      <span>{label}</span>
    </label>
  );
}

export function Radio({
  label,
  testId,
  className,
  id,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; testId?: string }) {
  const inputId = id ?? rest.name;
  return (
    <label className={clsx('check-row cursor-pointer', rest.disabled && 'cursor-not-allowed opacity-60', className)} htmlFor={inputId}>
      <input
        id={inputId}
        type="radio"
        data-testid={testId}
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer border-slate-300 accent-burgundy-700 disabled:cursor-not-allowed"
        {...rest}
      />
      <span>{label}</span>
    </label>
  );
}
