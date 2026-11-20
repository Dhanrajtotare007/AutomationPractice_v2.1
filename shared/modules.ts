export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface PracticeItem {
  /** Short label used in the locator playground and progress tracking. */
  label: string;
  /** Path segment of the module the exercise belongs to. */
  module: string;
}

export interface PracticeModule {
  slug: string;
  title: string;
  blurb: string;
  difficulty: Difficulty;
  exercises: number;
  /** lucide-react icon name resolved in the UI layer. */
  icon: string;
  /** Tailwind accent classes (soft background + text). */
  accent: string;
}

export const PRACTICE_MODULES: PracticeModule[] = [
  {
    slug: 'checkbox',
    title: 'Checkbox',
    blurb: 'Single, grouped and disabled checkboxes with select-all helpers and live state output.',
    difficulty: 'Beginner',
    exercises: 3,
    icon: 'CheckSquare',
    accent: 'from-emerald-500/15 to-emerald-500/5 text-emerald-700 dark:text-emerald-300',
  },
  {
    slug: 'radio',
    title: 'Radio Button',
    blurb: 'Multiple radio groups, gender & payment examples, disabled options and selected output.',
    difficulty: 'Beginner',
    exercises: 3,
    icon: 'CircleDot',
    accent: 'from-sky-500/15 to-sky-500/5 text-sky-700 dark:text-sky-300',
  },
  {
    slug: 'dropdown',
    title: 'Dropdown',
    blurb: 'Standard, multi-select, searchable and dependent selects plus disabled options.',
    difficulty: 'Intermediate',
    exercises: 4,
    icon: 'ChevronDownSquare',
    accent: 'from-amber-500/15 to-amber-500/5 text-amber-700 dark:text-amber-300',
  },
  {
    slug: 'form',
    title: 'Form',
    blurb: 'A full registration form with required fields, e-mail & password rules and reset.',
    difficulty: 'Intermediate',
    exercises: 4,
    icon: 'ClipboardList',
    accent: 'from-brand-500/15 to-brand-500/5 text-brand-700 dark:text-brand-300',
  },
  {
    slug: 'webtable',
    title: 'Web Table',
    blurb: 'Employee management table with search, sort, pagination and full CRUD.',
    difficulty: 'Advanced',
    exercises: 5,
    icon: 'Table2',
    accent: 'from-indigo-500/15 to-indigo-500/5 text-indigo-700 dark:text-indigo-300',
  },
  {
    slug: 'iframe',
    title: 'iFrame',
    blurb: 'A real same-origin iframe document with forms and a modal to switch frames into.',
    difficulty: 'Intermediate',
    exercises: 3,
    icon: 'Frame',
    accent: 'from-violet-500/15 to-violet-500/5 text-violet-700 dark:text-violet-300',
  },
  {
    slug: 'shadow-dom',
    title: 'Shadow DOM',
    blurb: 'Open and nested shadow roots with pierced locator examples for every framework.',
    difficulty: 'Advanced',
    exercises: 3,
    icon: 'Layers',
    accent: 'from-fuchsia-500/15 to-fuchsia-500/5 text-fuchsia-700 dark:text-fuchsia-300',
  },
  {
    slug: 'drag-drop',
    title: 'Drag & Drop',
    blurb: 'Native HTML5 drag events plus a pointer-driven Kanban board with drop feedback.',
    difficulty: 'Advanced',
    exercises: 4,
    icon: 'Move',
    accent: 'from-teal-500/15 to-teal-500/5 text-teal-700 dark:text-teal-300',
  },
  {
    slug: 'notifications',
    title: 'Notifications',
    blurb: 'Success, error, warning and info toasts with auto-dismiss and manual control.',
    difficulty: 'Beginner',
    exercises: 3,
    icon: 'Bell',
    accent: 'from-orange-500/15 to-orange-500/5 text-orange-700 dark:text-orange-300',
  },
  {
    slug: 'alerts',
    title: 'JavaScript Alerts',
    blurb: 'Native alert(), confirm() and prompt() dialogs with results displayed on screen.',
    difficulty: 'Beginner',
    exercises: 3,
    icon: 'AlertTriangle',
    accent: 'from-yellow-500/15 to-yellow-500/5 text-yellow-700 dark:text-yellow-300',
  },
  {
    slug: 'mouse',
    title: 'Mouse Actions',
    blurb: 'Click, double click, right click, hover, mouse tracking and click-and-hold.',
    difficulty: 'Intermediate',
    exercises: 4,
    icon: 'MousePointer2',
    accent: 'from-rose-500/15 to-rose-500/5 text-rose-700 dark:text-rose-300',
  },
  {
    slug: 'keyboard',
    title: 'Keyboard Actions',
    blurb: 'Enter, Tab, Escape, arrow keys, Backspace and copy/paste demonstrations.',
    difficulty: 'Intermediate',
    exercises: 4,
    icon: 'Keyboard',
    accent: 'from-slate-500/15 to-slate-500/5 text-slate-700 dark:text-slate-300',
  },
  {
    slug: 'file-upload',
    title: 'File Upload',
    blurb: 'Single and multiple uploads with type, size and count validation.',
    difficulty: 'Intermediate',
    exercises: 3,
    icon: 'UploadCloud',
    accent: 'from-lime-500/15 to-lime-500/5 text-lime-700 dark:text-lime-300',
  },
  {
    slug: 'date-picker',
    title: 'Date Picker',
    blurb: 'Calendar widget, native inputs, ranges, min/max limits and disabled dates.',
    difficulty: 'Advanced',
    exercises: 4,
    icon: 'CalendarDays',
    accent: 'from-accent-500/15 to-accent-500/5 text-accent-700 dark:text-accent-300',
  },
  {
    slug: 'waits',
    title: 'Dynamic Waits',
    blurb: 'Delayed elements, state transitions and spinners for explicit wait practice.',
    difficulty: 'Advanced',
    exercises: 3,
    icon: 'Timer',
    accent: 'from-emerald-500/15 to-emerald-500/5 text-emerald-700 dark:text-emerald-300',
  },
];

export const TOTAL_EXERCISES = PRACTICE_MODULES.reduce((sum, m) => sum + m.exercises, 0);

export const getModule = (slug: string): PracticeModule | undefined =>
  PRACTICE_MODULES.find((m) => m.slug === slug);
