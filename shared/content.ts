/** Learning content used across the informational pages. */

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
      'With Selenium use WebDriverWait with expected_conditions and always scope the wait to the smallest possible condition - visibility, clickability, or the presence of a specific text. Practise this on the Dynamic Waits lab.',
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
      'When semantics are not enough, use a dedicated data-testid attribute. It decouples the test from styling and copy churn. Every control in the practice labs ships one.',
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
      'Write your first test against the Checkbox lab: navigate, locate a checkbox by role, click, assert.',
      'Add trace: on-first-retry so failing CI runs produce a complete timeline you can open locally.',
      'Finally, shard the suite across jobs to keep feedback under five minutes.',
    ],
  },
  {
    slug: 'shadow-dom-locators',
    title: 'Locating elements inside Shadow DOM',
    author: 'Chen Wei',
    date: '2026-08-21',
    minutes: 7,
    tags: ['Shadow DOM', 'Locators', 'Advanced'],
    excerpt:
      'Document level CSS cannot cross a shadow boundary. Here is how each framework pierces open shadow roots, and what to do when they are closed.',
    body: [
      'A shadow root encapsulates its subtree. document.querySelector will never see anything inside it, no matter how specific the selector is.',
      'Playwright pierces open shadow DOM automatically, so page.getByTestId() works through nested roots. Selenium needs element.shadow_root.find_element(...) at each level.',
      'Cypress needs .shadow() or the includeShadowDom option. Nested roots require chaining .shadow() once per boundary.',
      'Closed shadow roots are intentionally unreachable - if you need to test them, ask the component author for a test id on the host element instead.',
    ],
  },
  {
    slug: 'api-testing-checklist',
    title: 'The API testing checklist before you open the UI',
    author: 'Daniel Okafor',
    date: '2026-08-02',
    minutes: 5,
    tags: ['API', 'Test strategy'],
    excerpt:
      'Seeding data through the API keeps UI tests short and deterministic. These are the checks worth automating first.',
    body: [
      'Start with the contract: status codes, envelope shape and required fields. A fast contract test catches most breakages before the browser starts.',
      'Validate the negative paths - missing fields, wrong types, duplicate records. The practice API returns 400 with a details array you can assert on.',
      'Use the API to create fixtures for a UI test, then delete them afterwards. The employee endpoints on this playground support the full CRUD cycle.',
      'Keep one UI test that covers the golden path so the API contract never drifts away from what the interface actually needs.',
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
  {
    id: 'q9',
    category: 'Locators',
    level: 'Beginner',
    question: 'Why prefer getByRole over CSS selectors?',
    answer:
      'getByRole queries the accessibility tree, so it matches how a user (and a screen reader) perceives the page. It survives markup refactors and fails loudly when a control loses its semantics, which is usually a real accessibility bug.',
  },
  {
    id: 'q10',
    category: 'Data',
    level: 'Intermediate',
    question: 'How do you keep test data isolated between parallel runs?',
    answer:
      'Never share fixed records. Create data per test through an API fixture, namespace it with a unique prefix (timestamp, worker index), and clean up in a teardown hook. The webtable lab accepts any unique employee email, which makes it a good sandbox for this pattern.',
  },
];
