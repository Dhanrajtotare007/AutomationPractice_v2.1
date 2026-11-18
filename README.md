# QA Automation Labs — UI Automation Playground

A complete, production-ready practice environment for learning web UI automation.
It recreates the look and feel of a commercial QA training platform and ships **15 fully
interactive testing modules**, a documented **locator catalogue** (Playwright JS/Python,
Selenium Python and Cypress examples for every control), a **real Express + SQLite API**,
light/dark theming, responsive layouts and an end-to-end Playwright test suite that
verifies the whole application.

> The playground does **not** run Playwright, Selenium or Cypress inside the browser.
> It is a target application: you automate it from your own framework (it exposes stable
> `data-testid` attributes, accessible roles, labels and ids on every control).

---

## Table of contents

1. [Features](#features)
2. [Technology stack](#technology-stack)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Development commands](#development-commands)
6. [Production build & run](#production-build--run)
7. [Testing](#testing)
8. [API reference](#api-reference)
9. [Environment variables](#environment-variables)
10. [Project structure](#project-structure)
11. [Automation guide](#automation-guide)
12. [Deployment](#deployment)
13. [Known limitations](#known-limitations)

---

## Features

### Application shell
- Header with brand, 10 navigation items, search, theme toggle and a responsive
  hamburger menu (breakpoints: `< lg` hamburger, `lg–xl` condensed nav, `xl+` full nav).
- Collapsible **Testing Tools** sidebar with the current module highlighted and per-module
  progress badges; becomes an off-canvas drawer on phones/tablets with an explicit close button.
- Light and dark themes (persisted in `localStorage`, pre-paint boot script, no flash).
- Global toast system, error boundary, skip link, focus rings and keyboard support.

### Dashboard (`/testing`)
- Maroon hero with the four required feature indicators.
- Stats: available tools, completed exercises, overall progress, documented locators.
- Progress bars overall and per difficulty (Beginner / Intermediate / Advanced).
- Recently practiced modules, module cards with per-module progress, difficulty filter.
- Promotional/booking cards.
- Progress persistence in `localStorage` **plus** optional save/restore through the API.

### Content pages
`/` Home, `/about`, `/courses` (filter + reserve modal with validation), `/events`
(registration persisted to the API), `/shop` (cart with quantity and totals), `/api-docs`
(live request console + endpoint reference), `/blog` + `/blog/:slug`,
`/interview-preparation` (filterable Q&A), `/contact` (validated form → API), `/search`
(full-text index over modules, locators and content) and a styled 404.

### The 15 practice modules
| # | Module | Highlights |
|---|--------|-----------|
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

Every module page has two tabs: **Practice** (the widget) and **Locators & frameworks**
(the locator catalogue, filterable by strategy, with copy buttons and a live “Run check”
that evaluates the selector against the running DOM), plus framework starter snippets.

---

## Technology stack

| Layer | Choice |
|-------|--------|
| Frontend | React 19, TypeScript, Vite 7, Tailwind CSS 3, lucide-react, react-router-dom 7 |
| Backend | Node.js, Express 5, better-sqlite3, helmet, cors, compression |
| Database | SQLite (file based, zero configuration; swap for PostgreSQL in production) |
| Tests | Playwright Test (Chromium) — 46 passing tests across desktop, mobile and tablet |

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
npm test            # Playwright: builds are served by Express on port 4173
npm run test:ui     # interactive UI mode
```

The suite (`tests/`) covers:

| Spec | Coverage |
|------|----------|
| `navigation.spec.ts` | every primary nav item, footer links, blog article, 404, hamburger menu, theme persistence, header search, sidebar navigation across all 15 modules, sidebar collapse |
| `dashboard.spec.ts` | hero/feature indicators, stats, module filters, progress ticking + persistence + API save/restore, contact form, shop cart, courses, events, blog, interview prep, API console |
| `locators.spec.ts` | catalogue completeness (every module + all 10 strategies), **every locator expression resolved against the live DOM**, framework snippet generation, workbench copy/run-check/empty states |
| `modules-basic.spec.ts` | checkbox, radio, dropdown (native + searchable keyboard + dependent) and form (invalid + valid) |
| `modules-advanced.spec.ts` | web table CRUD, iframe, shadow DOM, drag & drop, notifications, alerts, mouse, keyboard, file upload, date picker, dynamic waits |
| `responsive.spec.ts` | drawer behaviour, navigation, **zero horizontal overflow on 22 routes at 3 viewports**, dark mode across all modules |

Every test also fails on any unexpected console error or page exception (`tests/fixtures.ts`).

Last full run: **46 passed, 2 skipped** (the two skips are desktop-only sidebar-link checks that
are replaced by the drawer test on mobile/tablet).

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
| POST | `/api/events/:eventId/registrations` | register for an event (idempotent per email) |

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
├── index.html                 # SPA shell + pre-paint theme script
├── public/                    # favicon + iframe practice document
│   └── iframe-demo.html
├── server/                    # Express API (ESM)
│   ├── index.js               # app wiring, static hosting, error handling, shutdown
│   ├── config.js              # env loading + derived config
│   ├── db.js                  # SQLite schema, seed data
│   ├── http.js                # HttpError + validation helpers
│   └── routes/                # employees, contact, progress, events
├── shared/                    # code shared by client, server and tests
│   ├── modules.ts             # 15 module definitions + exercises
│   ├── locators.ts            # locator catalogue (expressions + metadata)
│   ├── locatorEngine.ts       # expression builders + framework snippets
│   ├── content.ts             # courses, events, books, articles, interview Q&A
│   └── types.ts               # shared API types
├── src/
│   ├── components/
│   │   ├── layout/            # Header, Sidebar, Footer, AppLayout, ErrorBoundary…
│   │   ├── modules/           # the 15 practice modules + registry + cheatsheet
│   │   ├── ui/                # Button, Card, Field, Modal, Toast, CodeBlock…
│   │   └── LocatorWorkbench.tsx
│   ├── pages/                 # content pages + testing dashboard & module page
│   ├── lib/                   # api client, progress store, theme, utils
│   ├── config/navigation.ts
│   └── App.tsx / main.tsx
├── tests/                     # Playwright specs + fixtures
├── playwright.config.ts
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

---

## Automation guide

- Navigate to `http://localhost:5173` (dev) or `http://localhost:4000` (production build).
- Prefer `getByRole`/`getByLabel`, then `getByTestId` — every control has one.
- Module pages expose `data-testid="module-<slug>"`, `data-testid="module-title"` and
  `data-testid="practice-panel"` for smoke tests.
- The **Locators & frameworks** tab lists the exact expressions used by the test suite.
- State that is asserted lives in dedicated elements (`*-value`, `*-count`, `*-output`).

Example (Playwright):

```ts
await page.goto('http://localhost:5173/testing/checkbox');
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

- **No automated-test execution in the browser.** The playground is the *target*, not a runner;
  the “Run check” button only validates that a locator matches an element in the current DOM.
- **Single-user progress.** Progress is stored in the browser and, when saved, as one snapshot
  on the server (no accounts or authentication by design).
- **SQLite** suits a single instance; swap for PostgreSQL for horizontal scaling.
- **Cypress snippet for iframes** needs the `cypress-iframe` plugin — this is documented in the
  module itself.
- Demo content (prices, events, contact details, social links) is illustrative placeholder data.
- Automated tests run against Chromium only; the responsive suite simulates phone and tablet
  viewports rather than emulating them.
#   A u t o m a t i o n P r a c t i c e _ v 2 . 1  
 