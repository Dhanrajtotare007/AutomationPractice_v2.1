import { useState, type ReactNode } from 'react';
import { Copy, Check } from 'lucide-react';
import { clsx, type ClassValue } from '@/lib/clsx';

export function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API can be blocked (insecure origin / permissions) - fall back.
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      document.body.removeChild(area);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  return { copied, copy };
}

export function CopyButton({ value, label = 'Copy', testId }: { value: string; label?: string; testId?: string }) {
  const { copied, copy } = useCopy();
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={() => void copy(value)}
      className={clsx(
        'inline-flex h-7 items-center gap-1 rounded-md border border-slate-700/60 bg-slate-800 px-2 text-[11px] font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white',
        copied && 'border-emerald-500/60 text-emerald-300',
      )}
      aria-label={`Copy ${label.toLowerCase()}`}
    >
      {copied ? <Check className="h-3 w-3" aria-hidden /> : <Copy className="h-3 w-3" aria-hidden />}
      <span data-testid={testId ? `${testId}-state` : undefined}>{copied ? 'Copied' : label}</span>
    </button>
  );
}

const TOKEN_RE =
  /(\/\/[^\n]*|#[^\n]*|'[^']*'|"[^"]*"|`[^`]*`|\b(?:const|let|await|async|import|from|def|return|expect|driver|page|cy|class|new|function|if|else|for|in|True|False|None)\b|\b\d+\b)/g;

/** Extremely small syntax highlighter - keeps the bundle free of heavyweight deps. */
function highlight(code: string) {
  const parts = code.split(TOKEN_RE);
  return parts.map((part, index) => {
    if (!part) return null;
    let className = '';
    if (part.startsWith('//') || part.startsWith('#')) className = 'text-slate-500 italic';
    else if (/^['"`]/.test(part)) className = 'text-amber-300';
    else if (/^\d+$/.test(part)) className = 'text-cyan-300';
    else if (/^(const|let|await|async|import|from|def|return|expect|driver|page|cy|class|new|function|if|else|for|in|True|False|None)$/.test(part))
      className = 'text-burgundy-300';
    return className ? (
      <span key={index} className={className}>
        {part}
      </span>
    ) : (
      <span key={index}>{part}</span>
    );
  });
}

export function CodeBlock({
  code,
  language,
  title,
  className,
  testId,
  copyTestId,
  maxHeight = 'max-h-80',
}: {
  code: string;
  language?: string;
  title?: string;
  className?: ClassValue;
  testId?: string;
  copyTestId?: string;
  maxHeight?: string;
}) {
  return (
    <figure
      data-testid={testId}
      className={clsx('overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-inner dark:bg-slate-950', className)}
    >
      <figcaption className="flex items-center justify-between gap-2 border-b border-slate-800 px-3 py-2">
        <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <span className="h-2 w-2 rounded-full bg-burgundy-400" aria-hidden />
          {title ?? language ?? 'code'}
        </span>
        <CopyButton value={code} testId={copyTestId} />
      </figcaption>
      <pre className={clsx('scrollbar-thin overflow-auto p-3 text-[12.5px] leading-relaxed text-slate-200', maxHeight)}>
        <code>{highlight(code)}</code>
      </pre>
    </figure>
  );
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[12px] text-burgundy-700 dark:bg-slate-800 dark:text-burgundy-200">
      {children}
    </code>
  );
}
