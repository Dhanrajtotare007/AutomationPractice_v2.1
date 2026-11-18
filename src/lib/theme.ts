/**
 * Theme persistence helpers. Kept dependency free so it can be imported from
 * anywhere (including the pre-paint boot script in index.html, which uses the
 * raw `qa-theme` localStorage key).
 */
export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'qa-theme';

export const Theme = {
  storageKey: STORAGE_KEY,

  read(): ThemeMode {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      /* storage blocked */
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },

  apply(mode: ThemeMode) {
    const root = document.documentElement;
    root.classList.toggle('dark', mode === 'dark');
    root.dataset.theme = mode;
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore quota / privacy errors */
    }
  },
};
