import { useCallback, useEffect, useMemo, useState } from 'react';
import { PRACTICE_MODULES } from '@shared/modules';
import { api } from '@/lib/api';
import {
  completeProgress,
  exerciseKey,
  readProgress,
  resetProgress,
  summarize,
  toggleProgress,
  writeProgress,
  type ProgressSummary,
} from '@/lib/progress';

const PROGRESS_EVENT = 'qa-progress-change';

/** Reactive progress hook shared by the dashboard, sidebar and module pages. */
export function useProgress() {
  const [keys, setKeys] = useState<string[]>(() => readProgress());
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<string[]>).detail;
      setKeys(Array.isArray(detail) ? detail : readProgress());
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'qa-progress-v1') setKeys(readProgress());
    };
    window.addEventListener(PROGRESS_EVENT, onChange as EventListener);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, onChange as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const summary: ProgressSummary = useMemo(() => summarize(keys), [keys]);

  const isComplete = useCallback((module: string, index: number) => keys.includes(exerciseKey(module, index)), [keys]);

  const toggle = useCallback((module: string, index: number) => {
    setKeys(toggleProgress(readProgress(), exerciseKey(module, index)));
  }, []);

  const complete = useCallback((module: string, index: number) => {
    setKeys(completeProgress(readProgress(), exerciseKey(module, index)));
  }, []);

  const reset = useCallback(() => {
    setKeys(resetProgress());
    void api.progress.save([]).catch(() => undefined);
  }, []);

  /** Push the local progress to the API so it survives a browser profile reset. */
  const syncToServer = useCallback(async () => {
    setSyncing(true);
    try {
      const response = await api.progress.save(readProgress());
      setKeys(writeProgress(response.data.completed));
      return { ok: true as const, updatedAt: response.data.updatedAt };
    } catch (error) {
      return { ok: false as const, message: error instanceof Error ? error.message : 'Sync failed' };
    } finally {
      setSyncing(false);
    }
  }, []);

  /** Merge progress stored on the server into the local store. */
  const pullFromServer = useCallback(async () => {
    setSyncing(true);
    try {
      const response = await api.progress.load();
      const merged = [...new Set([...readProgress(), ...response.data.completed])];
      setKeys(writeProgress(merged));
      return { ok: true as const, count: merged.length };
    } catch (error) {
      return { ok: false as const, message: error instanceof Error ? error.message : 'Restore failed' };
    } finally {
      setSyncing(false);
    }
  }, []);

  const recentlyPracticed = useMemo(() => {
    const order: string[] = [];
    [...keys].reverse().forEach((key) => {
      const slug = key.slice(0, key.lastIndexOf('-'));
      if (!order.includes(slug)) order.push(slug);
    });
    return order
      .map((slug) => PRACTICE_MODULES.find((module) => module.slug === slug))
      .filter((module): module is (typeof PRACTICE_MODULES)[number] => Boolean(module))
      .slice(0, 4);
  }, [keys]);

  return { keys, summary, isComplete, toggle, complete, reset, syncing, syncToServer, pullFromServer, recentlyPracticed };
}
