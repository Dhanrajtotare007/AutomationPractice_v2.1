# Automation Practice — Learn by Automating

A free, production-ready **practice platform for automation testing**. `Automation Practice`
ships **15 fully interactive practice labs**, ten **scenario-based challenges**, a documented
**locator catalogue** (Playwright JS/Python, Selenium Python and Cypress examples for every
control), a **real Express + SQLite API**, light/dark theming, responsive layouts and an
end-to-end Playwright suite that verifies the whole application.

> The platform does **not** run Playwright, Selenium or Cypress inside the browser.
> It is a target application: you automate it from your own framework (it exposes stable
> `data-testid` attributes, accessible roles, labels and ids on every control).

---

## Table of contents

1. [Features](#features)
2. [Routes](#routes)
3. [Technology stack](#technology-stack)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
6. [Development commands](#development-commands)
7. [Production build & run](#production-build--run)
8. [Testing](#testing)
9. [API reference](#api-reference)
10. [Environment variables](#environment-variables)
11. [Project structure](#project-structure)
12. [Automation guide](#automation-guide)
13. [Deployment](#deployment)
14. [Known limitations](#known-limitations)

---

## Features

### Application shell
- Sticky header with the `Automation Practice` wordmark, tagline, five primary links
  (Home · Practice Labs · Challenges · Resources · About), a Resources dropdown, header search,
  theme toggle and a prominent **Start Practicing** call to action.
- Responsive navigation: full inline nav on desktop, hamburger + scrollable panel with grouped
  sub-links on tablet and mobile (closes on navigation, `Escape` closes dropdowns).
- Collapsible **Practice Labs** sidebar on every lab route with per-lab progress badges; becomes
  an off-canvas drawer on small screens.
- Light and dark themes (persisted in `localStorage`, pre-paint boot script, no flash).
- Design system: indigo `brand`, teal `accent`, navy `secondary`, slate text — consistent
  buttons, fields, cards, badges, breadcrumbs, empty states and toasts.
- Global toast system, error boundary, skip link, focus rings and keyboard support.

### Homepage (`/`)
Hero (“Master Automation Testing Through Practice”) with the two required CTAs, six practice
areas backed by real labs, six popular labs with difficulty/category/start buttons,
“Why Automation Practice?”, the Beginner → Intermediate → Advanced journey and a footer with
practice lab, resource, platform and contact links.

### Practice Labs (`/labs`)
Stats, overall + per-difficulty progress, recently practiced labs, searchable directory with
difficulty **and** category filters, per-lab progress bars and empty states.

### Challenges (`/challenges`)
Ten ticket-style briefs (scenario, objective, suggested steps, acceptance criteria) filtered by
level, each linking to the labs it is practised on. Solved state is persisted locally and shown
as an overall progress bar.

### Resources (`/resources`)
A single hub with a live index over every guide, interview question, lab and locator, framework
examples, the latest guides, quick links and every practice area.

### Learning resources
`/blog` + `/blog/:slug` (5 guides with tag filters), `/interview-preparation` (10 filterable
Q&A), `/api-docs` (live request console, endpoint reference, schemas and example suites),
`/contact` (validated form → API), `/search` (full-text index over the whole platform) and a
styled 404. Legacy `/testing` URLs redirect to the matching `/labs` route.

### The 15 practice labs
| # | Lab | Highlights |
|---|-----|-----------|
| 1 | Checkbox | single, group, select/deselect all, indeterminate master, disabled, live output |
| 2 | Radio Button | gender, payment, subscription plans, disabled option, live output |
| 3 | Dropdown | native select, multi-select, searchable combobox (keyboard), dependent selects |
| 4 | Form | text/email/password/number/date/textarea/checkbox/radio/select, full validation, submit, reset |
| 5 | Web Table | search, sort, pagination, row selection, add/edit/delete against the API |
| 6 | iFrame | real same-origin frame document with its own form and nested modal, `postMessage` bridge |
| 7 | Shadow DOM | custom elements with open + nested shadow roots, React-in-shadow-root counter |
| 8 | Drag & Drop | HTML5 drag events + pointer dragging, accept/reject zones, event log |
| 9 | Notifications | success/error/warning/info toasts, custom duration, manual dismiss, burst |
| 10 | JavaScript Alerts | `alert`, `confirm`, `prompt` with acceptance/cancellation history |
| 11 | Mouse Actions | click, double click, right click, hover, pointer tracking, click-and-hold |
| 12 | Keyboard Actions | Enter/Escape/arrows/Tab/Ctrl+A capture, copy & paste demonstration |
| 13 | File Upload | single (type + 2 MB limit) and multiple (≤ 5 files, 5 MB each) with validation |
| 14 | Date Picker | native date/time inputs, custom calendar, range selection, min/max, disabled dates |
| 15 | Dynamic Waits | delayed elements, visibility toggles and async text for explicit-wait practice |

Every lab page has two tabs — **Practice** (the widget) and **Locators & frameworks** (the
locator catalogue, filterable by strategy, with copy buttons and a live “Run check” that
evaluates the selector against the running DOM) — plus a framework cheat-sheet.

---

## Routes

| Route | Page |
|-------|------|
| `/` | Homepage |
| `/labs` | Practice lab directory (filters, search, progress) |
| `/labs/:moduleSlug` | A single practice lab (`checkbox`, `radio`, `dropdown`, `form`, `webtable`, `iframe`, `shadow-dom`, `drag-drop`, `notifications`, `alerts`, `mouse`, `keyboard`, `file-upload`, `date-picker`, `waits`) |
| `/challenges` | Scenario-based testing challenges |
| `/resources` | Learning resources hub |
| `/blog`, `/blog/:slug` | Automation guides |
| `/interview-preparation` | SDET interview questions |
| `/api-docs` | API reference + console |
| `/contact` | Contact & support |
| `/search` | Global search |
| `/about` | About the platform |
| `/testing`, `/testing/:moduleSlug` | Permanent redirects to `/labs…` |

---

## Technology stack

| Layer | Choice |
|-------|--------|
| Frontend | React 19, TypeScript, Vite 7, Tailwind CSS 3, lucide-react, react-router-dom 7 |
| Backend | Node.js, Express 5, better-sqlite3, helmet, cors, compression |
| Database | SQLite (file based, zero configuration; swap for PostgreSQL in production) |
| Tests | Playwright Test (Chromium) — desktop, mobile and tablet projects |

No other runtime dependencies were introduced.

---

## Prerequisites

- **Node.js ≥ 20.19** (Vite 7 requirement) — verified on Node 24
- npm (or pnpm/yarn with equivalent commands)
- A C++ build toolchain is **not** required: `better-sqlite3` ships prebuilt binaries for
  Node 20/22/24 on Windows, macOS and Linux. If your platform lacks a prebuild,
  `npm rebuild better-sqlite3` compiles it (requires Python + a compiler).

---

## Installation

```bash
npm install          # installs client, server and test dependencies
npx playwright install chromium   # only needed to run the bundled e2e suite
cp .env.example .env              # optional: adjust PORT / CORS_ORIGINS / DATABASE_FILE
```

---

## Development commands

```bash
npm run dev        # API on :4000 + Vite dev server on :5173 (both watched)
npm run dev:web    # Vite only (expects the API at :4000)
npm run dev:api    # Express only (node --watch)
npm run typecheck  # strict TypeScript check for src/, shared/, tests/
npm run build      # typecheck + production bundle into dist/
npm start          # serve dist/ + API from one Express process (NODE_ENV=production)
npm run preview    # same as start but without forcing NODE_ENV
```

Vite proxies `/api` to `http://localhost:4000`, so the browser bundle is identical in
development and production.

---

## Production build & run

```bash
npm run build
npm start                # http://localhost:4000  (PORT configurable)
```

In production the Express server:
- serves the SPA from `dist/` with hashed-asset caching and SPA fallback routing,
- exposes the `/api` router,
- applies `helmet` security headers to API responses and CORS restricted to configured origins,
- returns JSON errors (`{ status, message, details? }`) and shuts down gracefully on SIGINT/SIGTERM.

---

## Testing

```bash
npm test            # Playwright: the build in dist/ is served by Express on port 4173
npm run test:ui     # interactive UI mode
```

The suite (`tests/`) covers:

| Spec | Coverage |
|------|----------|
| `navigation.spec.ts` | every primary + footer link, homepage sections, Resources dropdown, 404, hamburger menu, theme persistence, header search, sidebar navigation across all 15 labs, sidebar collapse |
| `dashboard.spec.ts` | lab directory filters/search, progress ticking + persistence + API save/restore, homepage lab cards, challenges (filters + solved state), resources hub, contact form, blog, interview prep, API console |
| `locators.spec.ts` | catalogue completeness (every lab + all 10 strategies), **every locator expression resolved against the live DOM**, framework snippet generation, workbench copy/run-check/empty states |
| `modules-basic.spec.ts` | checkbox, radio, dropdown (native + searchable keyboard + dependent) and form (invalid + valid) |
| `modules-advanced.spec.ts` | web table CRUD, iframe, shadow DOM, drag & drop, notifications, alerts, mouse, keyboard, file upload, date picker, dynamic waits |
| `responsive.spec.ts` | drawer behaviour, navigation, **zero horizontal overflow on the main pages and all 15 labs at 3 viewports**, dark mode across all labs |

Every test also fails on any unexpected console error or page exception (`tests/fixtures.ts`).

---

## API reference

Base URL: `/api` (same origin). Responses are wrapped as `{ "data": … }`; errors return
`{ "status", "message", "details"? }`.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | status, uptime, version |
| GET | `/api/employees` | paginated, searchable, sortable (`search`, `page`, `pageSize`, `sortBy`, `sortDir`) |
| POST | `/api/employees` | create (validated: name, email, department, role, salary, status, joined) |
| PUT | `/api/employees/:id` | update |
| DELETE | `/api/employees/:id` | delete |
| GET | `/api/contact` | 50 most recent contact messages |
| POST | `/api/contact` | submit a message (name, email, subject, message) |
| GET | `/api/progress` | progress snapshot stored server-side |
| PUT | `/api/progress` | replace snapshot (`{ completed: string[] }`) |

Try the endpoints interactively at **`/api-docs`**.

---

## Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | `4000` | API/static server port |
| `HOST` | `0.0.0.0` | bind address |
| `NODE_ENV` | `development` | enables production behaviours |
| `DATABASE_FILE` | `data/playground.db` | SQLite file location |
| `CORS_ORIGINS` | — | extra allowed browser origins (the server's own origin and the Vite dev server are always allowed) |
| `VITE_API_BASE_URL` | `/api` | override the API base URL baked into the bundle |
| `VITE_API_PROXY` | `http://localhost:4000` | Vite dev proxy target |

Secrets are never hard-coded; everything is read from the environment (`.env` is git-ignored).

---

## Project structure

```
.
├── index.html                 # SPA shell: title, meta/OG tags, pre-paint theme script
├── public/                    # favicon + iframe practice document
│   └── iframe-demo.html
├── server/                    # Express API (ESM)
│   ├── index.js               # app wiring, static hosting, error handling, shutdown
│   ├── config.js              # env loading + derived config
│   ├── db.js                  # SQLite schema, seed data
│   ├── http.js                # HttpError + validation helpers
│   └── routes/                # employees, contact, progress
├── shared/                    # code shared by client and tests
│   ├── modules.ts             # 15 practice lab definitions + exercise counts
│   ├── practice.ts            # categories, popular labs, challenge briefs
│   ├── locators.ts            # locator catalogue (expressions + metadata)
│   ├── locatorEngine.ts       # expression builders + framework snippets
│   ├── content.ts             # guides + interview questions
│   └── types.ts               # shared API types
├── src/
│   ├── components/
│   │   ├── layout/            # Brand, Header, Sidebar, Footer, Breadcrumbs, AppLayout…
│   │   ├── modules/           # the 15 practice labs + registry + cheatsheet
│   │   ├── ui/                # Button, Card, Field, Modal, Toast, CodeBlock…
│   │   └── LocatorWorkbench.tsx
│   ├── pages/                 # home, labs directory, challenges, resources, guides,…
│   ├── lib/                   # api client, progress store, theme, utils
│   ├── config/navigation.ts   # primary + footer navigation
│   └── App.tsx / main.tsx
├── tests/                     # Playwright specs + fixtures
├── playwright.config.ts
├── tailwind.config.js         # brand / accent / navy design tokens
├── vite.config.ts
└── tsconfig.json
```

---

## Automation guide

- Navigate to `http://localhost:5173` (dev) or `http://localhost:4000` (production build).
- Prefer `getByRole`/`getByLabel`, then `getByTestId` — every control has one.
- Lab pages expose `data-testid="module-<slug>"`, `data-testid="module-title"` and
  `data-testid="practice-panel"` for smoke tests.
- The **Locators & frameworks** tab lists the exact expressions used by the test suite.
- State that is asserted lives in dedicated elements (`*-value`, `*-count`, `*-output`).

Example (Playwright):

```ts
await page.goto('http://localhost:5173/labs/checkbox');
await page.getByTestId('checkbox-accept-terms').check();
await expect(page.getByTestId('checkbox-accepted-value')).toHaveText('true');
```

---

## Deployment

**Single container / VM (recommended)**

```bash
npm ci
npm run build
NODE_ENV=production PORT=4000 npm start
```

**Platforms** (Render, Railway, Fly.io, Azure App Service): use `npm run build` as the build
command and `npm start` as the start command. Set `PORT` from the platform, and
`DATABASE_FILE=/var/data/playground.db` mounted on a persistent disk (SQLite is file based).

**Reverse proxy (nginx)**

```nginx
location / {
  proxy_pass http://127.0.0.1:4000;
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

The Express app sets `trust proxy = 1` so protocol and client IPs are correct behind one hop.
For multi-instance deployments, replace SQLite with PostgreSQL (`server/db.js` is the only file
that talks to the database).

---

## Known limitations

- **No automated-test execution in the browser.** The platform is the *target*, not a runner;
  the “Run check” button only validates that a locator matches an element in the current DOM.
- **Single-user progress.** Lab and challenge progress is stored in the browser and, when saved,
  as one snapshot on the server (no accounts or authentication by design).
- **SQLite** suits a single instance; swap for PostgreSQL for horizontal scaling.
- **Cypress snippet for iframes** needs the `cypress-iframe` plugin — this is documented in the
  lab itself.
- Demo content (contact details, social links, sample employee data) is illustrative placeholder
  data.
- Automated tests run against Chromium only; the responsive suite simulates phone and tablet
  viewports rather than emulating them.
