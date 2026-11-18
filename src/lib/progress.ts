/**
 * Progress tracking store (localStorage first, optional server sync).
 *
 * A "completed exercise" key looks like `checkbox-1` where the suffix is the
 * 1-based exercise number inside the module.
 */
import { PRACTICE_MODULES, TOTAL_EXERCISES } from '@shared/modules';

export const PROGRESS_STORAGE_KEY = 'qa-progress-v1';

export interface ModuleProgress {
  slug: string;
  title: string;
  completed: number;
  total: number;
  percent: number;
}

export interface ProgressSummary {
  completedKeys: string[];
  completedCount: number;
  total: number;
  percent: number;
  modules: ModuleProgress[];
}

export function readProgress(): string[] {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((key): key is string => typeof key === 'string') : [];
  } catch {
    return [];
  }
}

export function writeProgress(keys: string[]) {
  const unique = [...new Set(keys)].sort();
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(unique));
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new CustomEvent('qa-progress-change', { detail: unique }));
  return unique;
}

export function exerciseKey(module: string, index: number) {
  return `${module}-${index}`;
}

export function summarize(keys: string[]): ProgressSummary {
  const set = new Set(keys);
  const modules = PRACTICE_MODULES.map((module) => {
    let completed = 0;
    for (let i = 1; i <= module.exercises; i += 1) {
      if (set.has(exerciseKey(module.slug, i))) completed += 1;
    }
    return {
      slug: module.slug,
      title: module.title,
      completed,
      total: module.exercises,
      percent: Math.round((completed / module.exercises) * 100),
    };
  });
  const completedCount = modules.reduce((sum, m) => sum + m.completed, 0);
  return {
    completedKeys: [...set],
    completedCount,
    total: TOTAL_EXERCISES,
    percent: Math.round((completedCount / TOTAL_EXERCISES) * 100),
    modules,
  };
}

export function toggleProgress(keys: string[], key: string): string[] {
  const set = new Set(keys);
  if (set.has(key)) set.delete(key);
  else set.add(key);
  return writeProgress([...set]);
}

export function resetProgress(): string[] {
  return writeProgress([]);
}

export function completeProgress(keys: string[], key: string): string[] {
  const set = new Set(keys);
  set.add(key);
  return writeProgress([...set]);
}
