/** Marketing / learning content used across the informational pages. */

export interface BookResource {
  id: string;
  title: string;
  author: string;
  price: number;
  rating: number;
  tag: string;
  summary: string;
  coverFrom: string;
  coverTo: string;
}

export const BOOKS: BookResource[] = [
  {
    id: 'playwright-in-action',
    title: 'Playwright in Action',
    author: 'QA Automation Labs',
    price: 39,
    rating: 4.9,
    tag: 'Best seller',
    summary: 'Component-level testing, tracing, parallelism and CI pipelines with the modern Playwright API.',
    coverFrom: 'from-burgundy-700',
    coverTo: 'to-burgundy-500',
  },
  {
    id: 'selenium-python-handbook',
    title: 'Selenium with Python Workbook',
    author: 'QA Automation Labs',
    price: 29,
    rating: 4.7,
    tag: 'Updated 2026',
    summary: 'Page objects, fixtures and reliable waits - 40 graded exercises with reference solutions.',
    coverFrom: 'from-slate-800',
    coverTo: 'to-slate-600',
  },
  {
    id: 'cypress-essentials',
    title: 'Cypress Testing Essentials',
    author: 'QA Automation Labs',
    price: 34,
    rating: 4.8,
    tag: 'New',
    summary: 'From first cy.visit() to network stubbing, custom commands and visual regression.',
    coverFrom: 'from-cyan-700',
    coverTo: 'to-cyan-500',
  },
];

export interface Course {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  weeks: number;
  lessons: number;
  price: number;
  summary: string;
  highlights: string[];
}

export const COURSES: Course[] = [
  {
    id: 'playwright-fundamentals',
    title: 'Playwright Fundamentals',
    level: 'Beginner',
    weeks: 4,
    lessons: 28,
    price: 149,
    summary: 'Locators, auto-waiting, assertions and your first CI run with TypeScript Playwright.',
    highlights: ['Locator strategies', 'Trace viewer debugging', 'GitHub Actions pipeline'],
  },
  {
    id: 'selenium-python-professional',
    title: 'Selenium with Python - Professional',
    level: 'Intermediate',
    weeks: 6,
    lessons: 42,
    price: 199,
    summary: 'Build a maintainable framework: page objects, fixtures, reporting and parallel runs.',
    highlights: ['Pytest fixtures', 'Page object model', 'Allure reporting'],
  },
  {
    id: 'cypress-masterclass',
    title: 'Cypress Masterclass',
    level: 'Intermediate',
    weeks: 5,
    lessons: 36,
    price: 179,
    summary: 'Fast feedback loops with component testing, network control and custom commands.',
    highlights: ['Network stubbing', 'Component testing', 'Custom commands'],
  },
  {
    id: 'automation-architecture',
    title: 'Automation Architecture at Scale',
    level: 'Advanced',
    weeks: 8,
    lessons: 54,
    price: 299,
    summary: 'Design a multi-team test suite: sharding, flake detection, metrics and test data strategy.',
    highlights: ['Sharding & parallelism', 'Flake quarantine', 'Quality gates & metrics'],
  },
];

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  mode: 'Online' | 'In person' | 'Hybrid';
  seats: number;
  summary: string;
}

export const EVENTS: EventItem[] = [
  {
    id: 'meetup-locators',
    title: 'Locator Strategy Meetup',
    date: '2026-12-04',
    time: '18:00 - 20:00',
    location: 'Online (Zoom)',
    mode: 'Online',
    seats: 120,
    summary: 'Live walkthrough of resilient locator strategies across Playwright, Selenium and Cypress.',
  },
  {
    id: 'workshop-cicd',
    title: 'CI/CD for Test Automation Workshop',
    date: '2026-12-18',
    time: '10:00 - 16:00',
    location: 'Bengaluru, India',
    mode: 'Hybrid',
    seats: 40,
    summary: 'Hands-on: parallel sharding, artefacts, tracing and flake triage on a real pipeline.',
  },
  {
    id: 'summit-2027',
    title: 'QA Automation Summit 2027',
    date: '2027-02-11',
    time: '09:00 - 17:30',
    location: 'Amsterdam, NL',
    mode: 'In person',
    seats: 300,
    summary: 'Two tracks, twelve speakers - covering AI assisted testing and visual regression.',
  },
];

export interface Article {
  slug: string;
  title: string;
  author: string;
  date: string;
  minutes: number;
  tags: string[];
  excerpt: string;
  body: string[];
}

export const ARTICLES: Article[] = [
  {
    slug: 'stop-using-sleeps',
    title: 'Stop using sleeps: explicit waits that actually work',
    author: 'Priya Raman',
    date: '2026-10-12',
    minutes: 6,
    tags: ['Playwright', 'Waits', 'Best practice'],
    excerpt:
      'Timeouts hide flakiness behind longer feedback loops. Here is how to convert sleeps into assertions that fail fast and explain themselves.',
    body: [
      'A fixed sleep is a promise that your application will never be slower than a magic number. That promise breaks the first time CI runs on a shared runner.',
      'Playwright retries locator actions automatically, so most sleeps can be deleted outright. Where a condition is genuinely asynchronous, assert on the outcome instead: expect(locator).toBeVisible().',
      'With Selenium use WebDriverWait with expected_conditions and always scope the wait to the smallest possible condition - visibility, clickability, or the presence of a specific text.',
      'Track flaky results over time. A wait that fails intermittently is telling you about a real product race condition, not a test problem.',
    ],
  },
  {
    slug: 'locator-strategy-ladder',
    title: 'The locator strategy ladder for resilient suites',
    author: 'Marco Silva',
    date: '2026-09-28',
    minutes: 8,
    tags: ['Locators', 'Cypress', 'Selenium'],
    excerpt:
      'Prefer user facing locators, then stable ids, then test ids. Everything else is a last resort - here is the ladder in practice.',
    body: [
      'Start from getByRole and getByLabel. If an element is reachable by a screen reader, it is reachable by a test.',
      'When semantics are not enough, use a dedicated data-testid attribute. It decouples the test from styling and copy churn.',
      'Avoid long CSS chains and generated classes. XPath by index is the most fragile option and should be reserved for tables where structure is meaningful.',
      'Record the reason next to the locator - a one line comment saves hours six months later.',
    ],
  },
  {
    slug: 'first-playwright-suite',
    title: 'Your first Playwright suite in 20 minutes',
    author: 'Aditi Verma',
    date: '2026-09-05',
    minutes: 10,
    tags: ['Playwright', 'Getting started'],
    excerpt:
      'Install, scaffold, write three tests, and wire up a CI pipeline that publishes traces on failure.',
    body: [
      'Run npm init playwright@latest and choose TypeScript. The generated configuration already contains sensible retries and trace on first retry.',
      'Write your first test against the playground: navigate, locate a checkbox by role, click, assert.',
      'Add trace: on-first-retry so failing CI runs produce a complete timeline you can open locally.',
      'Finally, shard the suite across jobs to keep feedback under five minutes.',
    ],
  },
];

export interface InterviewQuestion {
  id: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  answer: string;
}

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'q1',
    category: 'Locators',
    level: 'Beginner',
    question: 'What makes a locator resilient?',
    answer:
      'It targets something intrinsic to the element - its accessible role and name, a stable id, or an explicit data-testid - rather than its position, generated class names or surrounding text that marketing can change.',
  },
  {
    id: 'q2',
    category: 'Waits',
    level: 'Intermediate',
    question: 'Differentiate implicit and explicit waits.',
    answer:
      'An implicit wait tells the driver to poll for elements when they are not immediately found. An explicit wait polls for a specific condition (visibility, text, staleness) with its own timeout. Explicit waits are preferred because they are scoped and expressive.',
  },
  {
    id: 'q3',
    category: 'Frames',
    level: 'Intermediate',
    question: 'How do you interact with elements inside an iframe?',
    answer:
      'In Selenium switch the context with driver.switch_to.frame(...) and remember to return with switch_to.default_content(). In Playwright create a frameLocator and chain locators on it. In Cypress use cy.frameLoaded() / cy.iframe() or a plugin.',
  },
  {
    id: 'q4',
    category: 'Shadow DOM',
    level: 'Advanced',
    question: 'Why do simple CSS selectors fail inside Shadow DOM?',
    answer:
      'Shadow roots encapsulate their subtree - document level CSS queries cannot cross the shadow boundary. Playwright pierces open shadow DOM automatically; Selenium requires element.shadow_root.find_element(...).',
  },
  {
    id: 'q5',
    category: 'Flakiness',
    level: 'Advanced',
    question: 'How do you debug a flaky test?',
    answer:
      'Reproduce with retries enabled and capture traces or screenshots on failure, isolate shared state (test data, accounts, fixtures), replace fixed sleeps with assertions, and quarantine the test with an owner until the root cause is fixed.',
  },
  {
    id: 'q6',
    category: 'Alerts',
    level: 'Beginner',
    question: 'How do you handle native JavaScript dialogs?',
    answer:
      'Selenium switches to the dialog and calls accept(), dismiss() or send_keys(). Playwright registers a page.on("dialog") handler or uses page.once("dialog", d => d.accept()). Cypress uses cy.on("window:confirm", () => true).',
  },
  {
    id: 'q7',
    category: 'Architecture',
    level: 'Advanced',
    question: 'When should you choose page objects vs. helper functions?',
    answer:
      'Use page objects when a page has enough behaviour to justify a contract; use lightweight helpers for cross-cutting actions such as logging in or seeding data. Over-abstracting leads to page objects that mirror markup rather than intent.',
  },
  {
    id: 'q8',
    category: 'CI',
    level: 'Intermediate',
    question: 'What does a healthy automation pipeline include?',
    answer:
      'Deterministic environments, sharded parallel execution, artefact upload on failure (traces, videos, reports), flake metrics, a fast smoke gate on pull requests, and a nightly full regression run.',
  },
];
