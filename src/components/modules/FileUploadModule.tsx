import { useRef, useState } from 'react';
import { AlertTriangle, FileText, Trash2, UploadCloud } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, EmptyState } from '@/components/ui/Card';
import { formatBytes } from '@/lib/utils';
import { useNotify } from '@/components/ui/Toast';
import { OutputPanel, PracticeGrid } from './PracticeGrid';

const SINGLE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'application/pdf'];
const MAX_SINGLE_BYTES = 2 * 1024 * 1024;
const MAX_MULTI_BYTES = 5 * 1024 * 1024;
const MAX_FILES = 5;

interface UploadEntry {
  name: string;
  size: number;
  type: string;
}

export function FileUploadModule() {
  const notify = useNotify();
  const [single, setSingle] = useState<UploadEntry | null>(null);
  const [singleError, setSingleError] = useState<string | null>(null);
  const [multiple, setMultiple] = useState<UploadEntry[]>([]);
  const [multiError, setMultiError] = useState<string | null>(null);
  const singleRef = useRef<HTMLInputElement>(null);
  const multiRef = useRef<HTMLInputElement>(null);

  const validateSingle = (file: File) => {
    if (!SINGLE_TYPES.includes(file.type)) {
      return `Unsupported file type “${file.type || 'unknown'}”. Allowed: PNG, JPEG, GIF, PDF.`;
    }
    if (file.size > MAX_SINGLE_BYTES) {
      return `File is too large (${formatBytes(file.size)}). Maximum size is 2 MB.`;
    }
    return null;
  };

  const handleSingle = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    const error = validateSingle(file);
    if (error) {
      setSingleError(error);
      setSingle(null);
      notify.error('Upload rejected', error);
      return;
    }
    setSingleError(null);
    setSingle({ name: file.name, size: file.size, type: file.type });
    notify.success('File accepted', file.name);
  };

  const handleMultiple = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const incoming = Array.from(files);
    if (incoming.length > MAX_FILES) {
      setMultiError(`Select at most ${MAX_FILES} files (you picked ${incoming.length}).`);
      setMultiple([]);
      notify.error('Too many files', `Select at most ${MAX_FILES} files.`);
      return;
    }
    const tooLarge = incoming.find((file) => file.size > MAX_MULTI_BYTES);
    if (tooLarge) {
      setMultiError(`“${tooLarge.name}” is ${formatBytes(tooLarge.size)} — the limit is 5 MB per file.`);
      setMultiple([]);
      notify.error('Upload rejected', 'One or more files exceed the 5 MB limit.');
      return;
    }
    setMultiError(null);
    setMultiple(incoming.map((file) => ({ name: file.name, size: file.size, type: file.type || 'unknown' })));
    notify.success(`${incoming.length} file(s) accepted`);
  };

  return (
    <PracticeGrid
      aside={
        <>
          <Card testId="upload-summary">
            <CardHeader title="Upload summary" description="Values exposed for assertions." />
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500 dark:text-slate-400">Single file</dt>
                <dd className="text-right font-semibold" data-testid="upload-single-name">
                  {single ? single.name : '—'}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500 dark:text-slate-400">Single size</dt>
                <dd className="font-semibold" data-testid="upload-single-size">
                  {single ? formatBytes(single.size) : '—'}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500 dark:text-slate-400">Multiple count</dt>
                <dd className="font-semibold" data-testid="upload-multiple-count">
                  {multiple.length}
                </dd>
              </div>
            </dl>
          </Card>
          <OutputPanel title="Validation rules" tone="info">
            <ul className="list-disc space-y-1 pl-4 text-xs">
              <li>Single: PNG, JPEG, GIF or PDF · max 2 MB</li>
              <li>Multiple: up to 5 files · max 5 MB each</li>
              <li>All checks run client-side before the file list updates</li>
            </ul>
          </OutputPanel>
        </>
      }
    >
      <Card testId="upload-single-card">
        <CardHeader
          icon={<UploadCloud className="h-4 w-4" aria-hidden />}
          title="Single file upload"
          description="Validated by MIME type and size. Use setInputFiles() / send_keys(path) directly on the input."
          actions={<Badge tone="brand">accept=.png,.jpg,.gif,.pdf</Badge>}
        />
        <label
          htmlFor="upload-single"
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-burgundy-400 hover:bg-burgundy-50/40 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-burgundy-600"
        >
          <UploadCloud className="h-7 w-7 text-burgundy-600 dark:text-burgundy-300" aria-hidden />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Click to choose a file, or drop it here</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">PNG, JPEG, GIF or PDF · up to 2 MB</span>
          <input
            ref={singleRef}
            id="upload-single"
            name="upload-single"
            type="file"
            accept=".png,.jpg,.jpeg,.gif,.pdf"
            className="sr-only"
            data-testid="upload-single"
            onChange={(event) => handleSingle(event.target.files)}
          />
        </label>
        {singleError ? (
          <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400" role="alert" data-testid="upload-single-error">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden /> {singleError}
          </p>
        ) : null}
        {single ? (
          <div className="mt-3 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm dark:border-emerald-900 dark:bg-emerald-950/40" data-testid="upload-single-result">
            <FileText className="h-4 w-4 text-emerald-600" aria-hidden />
            <span className="min-w-0 flex-1 truncate font-semibold text-emerald-800 dark:text-emerald-200">{single.name}</span>
            <span className="text-xs text-emerald-700 dark:text-emerald-300">{formatBytes(single.size)}</span>
            <button
              type="button"
              onClick={() => {
                setSingle(null);
                if (singleRef.current) singleRef.current.value = '';
              }}
              className="rounded p-1 text-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/60"
              aria-label="Remove selected file"
              data-testid="upload-single-remove"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        ) : null}
        <p className="help">The input keeps its native <code className="font-mono">FileList</code> so automation can set files directly.</p>
      </Card>

      <Card testId="upload-multiple-card">
        <CardHeader
          icon={<UploadCloud className="h-4 w-4" aria-hidden />}
          title="Multiple file upload"
          description="Select up to five files at once; each must be 5 MB or smaller."
          actions={<Badge tone="brand">multiple</Badge>}
        />
        <input
          ref={multiRef}
          id="upload-multiple"
          name="upload-multiple"
          type="file"
          multiple
          data-testid="upload-multiple"
          onChange={(event) => handleMultiple(event.target.files)}
          className="field file:mr-3 file:rounded-md file:border-0 file:bg-burgundy-700 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-burgundy-800"
        />
        {multiError ? (
          <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400" role="alert" data-testid="upload-multiple-error">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden /> {multiError}
          </p>
        ) : null}
        {multiple.length === 0 ? (
          <div className="mt-3">
            <EmptyState icon={<FileText className="h-6 w-6" aria-hidden />} title="No files selected" description="Choose one or more files to see them listed here." />
          </div>
        ) : (
          <ul className="mt-3 space-y-1" data-testid="upload-multiple-list">
            {multiple.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-700"
                data-testid={`upload-file-${index}`}
              >
                <FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
                <span className="min-w-0 flex-1 truncate font-medium text-slate-800 dark:text-slate-100">{file.name}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{formatBytes(file.size)}</span>
                <span className="hidden text-[10px] font-semibold uppercase text-slate-400 sm:block">{file.type}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setMultiple([]);
              setMultiError(null);
              if (multiRef.current) multiRef.current.value = '';
            }}
            data-testid="upload-multiple-clear"
          >
            Clear list
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              const file = new File(['QA Automation Labs'], 'generated-report.txt', { type: 'text/plain' });
              setMultiple([{ name: file.name, size: file.size, type: file.type }]);
              notify.info('Sample file added', 'generated-report.txt');
            }}
            data-testid="upload-multiple-sample"
          >
            Add sample file
          </Button>
        </div>
      </Card>
    </PracticeGrid>
  );
}
