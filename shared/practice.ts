import { PRACTICE_MODULES, type Difficulty } from './modules';

/** Categories used to organise the practice labs on the homepage and lab directory. */
export interface PracticeCategory {
  id: string;
  title: string;
  summary: string;
  icon: string;
  /** Lucide icon tint. */
  accent: string;
  /** Lab slugs that belong to the category (order is respected). */
  labs: string[];
}

export const PRACTICE_CATEGORIES: PracticeCategory[] = [
  {
    id: 'web-ui',
    title: 'Web UI Automation',
    summary: 'Forms, tables, dropdowns and the everyday widgets every automation suite has to handle.',
    icon: 'MousePointerClick',
    accent: 'text-brand-600 dark:text-brand-300',
    labs: ['checkbox', 'radio', 'dropdown', 'form', 'webtable'],
  },
  {
    id: 'selenium',
    title: 'Selenium Practice',
    summary: 'Alerts, frames, windows and file uploads — the classic WebDriver challenges with copy-ready snippets.',
    icon: 'Compass',
    accent: 'text-emerald-600 dark:text-emerald-300',
    labs: ['alerts', 'iframe', 'file-upload', 'date-picker'],
  },
  {
    id: 'playwright',
    title: 'Playwright Practice',
    summary: 'Auto-waiting, shadow DOM piercing and mouse/keyboard interactions with modern locators.',
    icon: 'Layers',
    accent: 'text-accent-600 dark:text-accent-300',
    labs: ['shadow-dom', 'mouse', 'keyboard', 'notifications'],
  },
  {
    id: 'api',
    title: 'API Testing',
    summary: 'A real Express + SQLite API with validation, pagination and error envelopes to automate.',
    icon: 'Database',
    accent: 'text-sky-600 dark:text-sky-300',
    labs: ['webtable', 'form'],
  },
  {
    id: 'scenarios',
    title: 'Test Automation Scenarios',
    summary: 'End-to-end flows that combine several widgets into a realistic user journey.',
    icon: 'Workflow',
    accent: 'text-amber-600 dark:text-amber-300',
    labs: ['form', 'webtable', 'file-upload', 'date-picker'],
  },
  {
    id: 'advanced',
    title: 'Advanced Automation Challenges',
    summary: 'Synchronisation, drag & drop and shadow DOM — the problems that make suites flaky.',
    icon: 'Flame',
    accent: 'text-rose-600 dark:text-rose-300',
    labs: ['waits', 'drag-drop', 'shadow-dom', 'date-picker'],
  },
];

/** Labs surfaced first on the homepage as the most useful starting points. */
export const POPULAR_LABS = ['checkbox', 'form', 'webtable', 'dropdown', 'waits', 'alerts'];

export interface Scenario {
  title: string;
  summary: string;
  outcome: string;
}

export interface Challenge {
  id: string;
  title: string;
  level: Difficulty;
  category: string;
  icon: string;
  /** Labs the challenge is practised on. */
  labs: string[];
  scenario: string;
  objective: string;
  steps: string[];
  acceptance: string[];
  frameworks: string[];
}

export const CHALLENGES: Challenge[] = [
  {
    id: 'registration-journey',
    title: 'Registration journey',
    level: 'Beginner',
    category: 'Web UI Automation',
    icon: 'UserPlus',
    labs: ['form', 'checkbox'],
    scenario: 'A new user signs up for the practice app and must accept the community guidelines.',
    objective: 'Validate required fields, inline errors, password rules and the success state.',
    steps: [
      'Open the Form lab and submit an empty form.',
      'Assert the inline error for every required field.',
      'Fill valid values but keep the password weak and assert the password rule feedback.',
      'Complete a valid submission and assert the success confirmation.',
      'Tick the matching exercises on the lab page when the test passes.',
    ],
    acceptance: [
      'Empty submit shows errors for first name, last name, email and password.',
      'A missing number and symbol fails the password strength check.',
      'The success panel contains the submitted email address.',
    ],
    frameworks: ['Playwright', 'Selenium', 'Cypress'],
  },
  {
    id: 'role-based-navigation',
    title: 'Role-based navigation',
    level: 'Beginner',
    category: 'Web UI Automation',
    icon: 'CircleDot',
    labs: ['radio', 'dropdown'],
    scenario: 'An admin picks a role and a department before saving a new teammate.',
    objective: 'Practise radio groups, dependent dropdowns and disabled options.',
    steps: [
      'Select a role radio button and assert the selected value output.',
      'Change to another role and assert only one option stays checked.',
      'Pick a country in the dependent dropdown and assert the city list updates.',
      'Assert that disabled options cannot be selected.',
    ],
    acceptance: [
      'Exactly one radio per group is checked after every click.',
      'The dependent city list only contains cities of the selected country.',
      'Disabled options stay disabled after the attempt.',
    ],
    frameworks: ['Playwright', 'Selenium', 'Cypress'],
  },
  {
    id: 'employee-record-lifecycle',
    title: 'Employee record lifecycle',
    level: 'Intermediate',
    category: 'Test Automation Scenarios',
    icon: 'Table2',
    labs: ['webtable'],
    scenario: 'HR creates, searches, edits and deletes an employee record in the management table.',
    objective: 'Cover CRUD on a paginated, sortable and searchable table.',
    steps: [
      'Create an employee with a unique email generated per test run.',
      'Search for the record and assert it appears on the first page.',
      'Sort by salary descending and verify the order of the salary column.',
      'Edit the record, then delete it and assert the row is gone.',
    ],
    acceptance: [
      'A duplicate email is rejected with a validation message.',
      'Search results only contain rows matching the query.',
      'The record disappears after deletion and the total count decreases.',
    ],
    frameworks: ['Playwright', 'Selenium', 'Cypress'],
  },
  {
    id: 'api-first-fixtures',
    title: 'API-first fixtures',
    level: 'Intermediate',
    category: 'API Testing',
    icon: 'Database',
    labs: ['webtable'],
    scenario: 'Seed test data through the REST API, then verify it in the UI.',
    objective: 'Practise contract checks, authentication-free fixtures and teardown.',
    steps: [
      'POST an employee to /api/employees and assert the 201 response envelope.',
      'Send an invalid payload and assert the 400 response with a details array.',
      'Open the Web Table lab and assert the seeded employee is visible.',
      'DELETE the employee in teardown so the suite stays deterministic.',
    ],
    acceptance: [
      'The created record is returned with an id and the submitted values.',
      'Validation errors are returned as a details array.',
      'Teardown leaves no records created by the run.',
    ],
    frameworks: ['Playwright request', 'Requests', 'Supertest'],
  },
  {
    id: 'shadow-dom-deep-dive',
    title: 'Shadow DOM deep dive',
    level: 'Advanced',
    category: 'Advanced Automation Challenges',
    icon: 'Layers',
    labs: ['shadow-dom'],
    scenario: 'A design-system component renders its inputs inside nested shadow roots.',
    objective: 'Pierce open shadow roots reliably across frameworks.',
    steps: [
      'Locate the outer custom element and read its rendered heading.',
      'Drill into the nested root and type into the inner input.',
      'Submit the component and assert the composed event log.',
      'Repeat the locator with a framework that does not pierce automatically.',
    ],
    acceptance: [
      'The inner input accepts text without a JavaScript DOM walk.',
      'The event log records the submitted value once.',
      'The locator strategy works after a page reload.',
    ],
    frameworks: ['Playwright', 'Selenium', 'Cypress'],
  },
  {
    id: 'kanban-drag-drop',
    title: 'Kanban drag & drop',
    level: 'Advanced',
    category: 'Advanced Automation Challenges',
    icon: 'Move',
    labs: ['drag-drop'],
    scenario: 'A product owner moves stories across a Kanban board.',
    objective: 'Automate native HTML5 drag events and pointer-driven drops.',
    steps: [
      'Drag a card from “To do” to “In progress” using native HTML5 events.',
      'Move the same card with a pointer drag sequence and compare the log.',
      'Add a new card, then remove it and assert the board state.',
      'Assert the persistent activity log entries.',
    ],
    acceptance: [
      'The card appears in the destination column after the drop.',
      'The activity log records one entry per move.',
      'Deleting a card removes it from every column.',
    ],
    frameworks: ['Playwright', 'Selenium'],
  },
  {
    id: 'async-synchronisation',
    title: 'Async synchronisation',
    level: 'Advanced',
    category: 'Test Automation Scenarios',
    icon: 'Timer',
    labs: ['waits', 'notifications'],
    scenario: 'A dashboard loads data asynchronously and shows transient toasts.',
    objective: 'Replace every sleep with an explicit condition that explains itself.',
    steps: [
      'Trigger a delayed element and wait for it with an explicit wait.',
      'Wait for a spinner to disappear before asserting on the result.',
      'Dismiss an auto-hiding toast before asserting it disappeared.',
      'Measure the total wait time and keep it under the configured timeout.',
    ],
    acceptance: [
      'No fixed sleeps exist in the finished test.',
      'The assertion fails when the delayed element never appears.',
      'The toast assertions work on a slow CI runner.',
    ],
    frameworks: ['Playwright', 'Selenium', 'Cypress'],
  },
  {
    id: 'file-validation',
    title: 'File upload validation',
    level: 'Intermediate',
    category: 'Selenium Practice',
    icon: 'UploadCloud',
    labs: ['file-upload'],
    scenario: 'A candidate attaches a CV and a portfolio archive to a job application.',
    objective: 'Cover file type, size and multi-file validation.',
    steps: [
      'Upload a supported PDF and assert the success entry.',
      'Attempt an unsupported extension and assert the error message.',
      'Upload several files at once and assert every entry is listed.',
      'Remove an uploaded file and assert the list updates.',
    ],
    acceptance: [
      'Happy path upload appears with name and size.',
      'Unsupported types are rejected with a readable message.',
      'Multi-file uploads keep every accepted file.',
    ],
    frameworks: ['Playwright', 'Selenium', 'Cypress'],
  },
  {
    id: 'dialog-handling',
    title: 'Native dialog handling',
    level: 'Beginner',
    category: 'Selenium Practice',
    icon: 'AlertTriangle',
    labs: ['alerts'],
    scenario: 'A destructive action asks for confirmation before continuing.',
    objective: 'Accept, dismiss and answer native browser dialogs.',
    steps: [
      'Register a dialog handler before triggering the confirm dialog.',
      'Accept the dialog and assert the on-screen result.',
      'Dismiss the dialog and assert the cancelled result.',
      'Answer the prompt with a custom value and assert it is echoed on screen.',
    ],
    acceptance: [
      'Accepted and dismissed outcomes are asserted separately.',
      'The prompt answer is reflected in the result panel.',
      'No dialog is left open at the end of the test.',
    ],
    frameworks: ['Playwright', 'Selenium', 'Cypress'],
  },
  {
    id: 'calendar-booking',
    title: 'Booking window selection',
    level: 'Intermediate',
    category: 'Test Automation Scenarios',
    icon: 'CalendarDays',
    labs: ['date-picker'],
    scenario: 'A traveller picks a check-in and check-out date inside an allowed window.',
    objective: 'Drive a calendar widget and native date inputs deterministically.',
    steps: [
      'Type a date into the native input and assert its value.',
      'Navigate months with the calendar arrows and pick a day.',
      'Attempt a date outside the min/max window and assert the rejection.',
      'Assert the range summary for check-in and check-out.',
    ],
    acceptance: [
      'The picked date is echoed in the selected-date output.',
      'Out-of-range dates are rejected on both inputs and the widget.',
      'The range summary matches the two selected dates.',
    ],
    frameworks: ['Playwright', 'Selenium', 'Cypress'],
  },
];

export const CHALLENGE_LEVELS: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];

export const CHALLENGES_BY_LEVEL = (level: Difficulty) => CHALLENGES.filter((challenge) => challenge.level === level);

/** Look up labs by slug and keep the requested order. */
export const labsBySlug = (slugs: string[]) =>
  slugs.map((slug) => PRACTICE_MODULES.find((module) => module.slug === slug)).filter((module): module is (typeof PRACTICE_MODULES)[number] => Boolean(module));
