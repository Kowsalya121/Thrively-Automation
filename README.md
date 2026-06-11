# Thrively Playwright Automation Framework

> End-to-end test automation for the [Thrively](https://qa.thrively.com) education platform, built with Playwright + JavaScript. Covers Educator, Parent, Student user journeys and REST API validation.

---

## Table of Contents

1. [Framework Overview](#framework-overview)
2. [Technologies Used](#technologies-used)
3. [Folder Structure](#folder-structure)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Running Tests](#running-tests)
7. [Browser Support](#browser-support)
8. [Reporting](#reporting)
9. [Architecture Summary](#architecture-summary)
10. [Test Coverage Map](#test-coverage-map)

---

## Framework Overview

This is a **JavaScript Playwright** end-to-end automation framework targeting the Thrively Angular SSR web application. It automates complete user journeys across three role types:

| Role | Coverage |
|---|---|
| **Educator** | Login, Signup, Lander Pages, Dashboard Check-ins, My Class, Assessments (Strengths, MIDAS, Habits of Mind, RIASEC/Personalities), District Self-Assessment, Hope Audit, Demo/Quote flows, Webinar |
| **Parent** | Signup, Purchase flow, Dashboard, K-2 Assessment, Lander pages |
| **Student** | Signup, Digital Portfolio |
| **API** | Authentication, User Summary |

**Key design goals:**

- **SSR-stable** — Every page interaction is wrapped by a `stablePage()` utility that waits for `domcontentloaded` → `networkidle` → 1 s Angular flush → spinner dismissal, eliminating Angular hydration race conditions.
- **Page Object Model** — All locators and actions live in Page Classes; tests contain only business logic and assertions.
- **Getter-based locators** — All locators are JavaScript `get` properties (evaluated lazily at call time), preventing stale element references caused by Angular re-renders.
- **Dynamic test data** — Emails and usernames are timestamp-suffixed to prevent conflicts between runs.

---

## Technologies Used

| Technology | Version | Purpose |
|---|---|---|
| [Playwright](https://playwright.dev) | `^1.54.2` | Browser automation & test runner |
| [Node.js](https://nodejs.org) | `20+` | Runtime |
| `@types/node` | `^24.2.1` | TypeScript type hints in JSDoc |
| [dotenv](https://github.com/motdotla/dotenv) | `^16.1.0` | `.env` secret injection |
| `@modelcontextprotocol/sdk` | `^0.5.0` | MCP tooling (dev tooling, not test runtime) |

**Package type:** `"type": "module"` — all files use ES Module `import`/`export` syntax; every import **must** include the `.js` extension.

---

## Folder Structure

```
Playwright_Automation/
├── .env                          # Environment secrets (not committed)
├── .gitignore
├── Dockerfile                    # Containerised execution
├── package.json                  # Dependencies & project type
├── playwright.config.js          # Global Playwright configuration
│
├── Fixtures/
│   └── baseTest.js               # Extended test fixture with afterEach artifact capture
│
├── Utility/
│   ├── stablePage.js             # ✨ SSR stability core — must be used in every POM action
│   ├── artifactHelper.js         # Screenshot + video save on failure
│   └── Commonfun.js              # saveUser() — persists test-created emails to JSON
│
├── Pages/
│   ├── Educator/
│   │   ├── LoginPage.js
│   │   ├── CheckInPage.js
│   │   ├── DemoQuotePage.js
│   │   ├── HopeAudit.js
│   │   ├── Landerpages.js
│   │   ├── MyClassPage.js
│   │   ├── SchoolofHope.js
│   │   ├── Signup.js
│   │   ├── WebinarPage.js
│   │   ├── districtSelfAssessment.page.js
│   │   ├── StrengthAssessmentPage.js
│   │   ├── MidasAssessmentPage.js
│   │   ├── HabitsOfMindPage.js
│   │   └── PersonalitiesAssessmentPage.js
│   ├── Parent/
│   │   ├── K2Assessment.js
│   │   ├── ParentDashboard.js
│   │   ├── ParentLander.js
│   │   └── Parentsignup.js
│   └── Student/
│       └── StudentSignup.js
│
├── tests/
│   ├── Educator/
│   │   ├── Login.spec.js
│   │   ├── Signup.spec.js
│   │   ├── lander.spec.js
│   │   ├── HWCheckins.spec.js
│   │   ├── MyClass.spec.js
│   │   ├── DemoQuote.spec.js
│   │   ├── HopeAudit.spec.js
│   │   ├── SchoolofHope.spec.js
│   │   ├── Webinar.spec.js
│   │   ├── districtSelfAssessment.spec.js
│   │   ├── StrengthAssessment.spec.js
│   │   ├── MidasAssessment.spec.js
│   │   ├── HabitsOfMind.spec.js
│   │   └── PersonalitiesAssessment.spec.js
│   ├── Parent/
│   │   ├── K2Assessment.spec.js
│   │   ├── ParentDashboard.spec.js
│   │   ├── ParentLander.spec.js
│   │   └── Parentsignup.spec.js
│   ├── Student/
│   │   ├── StudentDP.spec.js
│   │   └── StudentSignup.spec.js
│   ├── APIs/
│   │   ├── Auth.spec.js
│   │   └── Summary.spec.js
│   └── utils/
│       └── waitHelpers.js        # Shared expect-based wait utilities
│
├── test-data/
│   └── testdata.js               # All static + dynamic test data exports
│
├── screenshots/                  # Auto-saved on test failure
├── videos/                       # Auto-saved on test failure
└── test-results/                 # Playwright internal results + userdata.json
```

---

## Installation

### Prerequisites

- **Node.js 20+** — [Download](https://nodejs.org)
- **Git**

### Steps

```bash
# 1. Clone the repository
git clone <repository-url>
cd Playwright_Automation

# 2. Install Node dependencies
npm install

# 3. Install Playwright browsers
npx playwright install

# 4. Set up environment variables
cp .env.example .env          # or create .env manually
# Edit .env with your values (see Configuration section)
```

### Docker (CI/headless)

```bash
docker build -t thrively-playwright .
docker run --rm thrively-playwright
```

---

## Configuration

### `.env` file

```dotenv
BASE_URL=https://qa.thrively.com
USERNAME=qa+kowsalya+thrive@liftoffllc.com
PASSWORD=pass@121
PARENT_EMAIL=kowsalya+autoparent@liftoffllc.com
PARENT_PASSWORD=Pass@121
CHILD_FIRST_NAME=kowsalya
CHILD_LAST_NAME=gowda
CHILD_AGE=6
CHILD_USERNAME=sonu2
CHILD_PASSWORD=123456
PROMO_CODE=strength
SCHOOL_OF_HOPE_CODE=73010
SLOW_MO=0         # milliseconds between actions — set to 500 for debugging
```

### `playwright.config.js` key settings

| Setting | Value | Why |
|---|---|---|
| `timeout` | 300 000 ms | Long assessments (80 questions) need extra time |
| `expect.timeout` | 30 000 ms | Angular SSR hydration can take several seconds |
| `actionTimeout` | 60 000 ms | Handles slow Angular event binding |
| `navigationTimeout` | 90 000 ms | SPA hash-routing can be slow on first load |
| `headless` | `false` | Visible browser for debugging; set `true` in CI |
| `screenshot` | `only-on-failure` | Saves to `screenshots/` automatically |
| `trace` | `on-first-retry` | Playwright trace saved on first retry |
| `video` | `retain-on-failure` | Video saved to `videos/` on failure |
| `reporter` | `html` | HTML report generated at `playwright-report/` |

---

## Running Tests

```bash
# Run all tests
npx playwright test

# Run a specific test file
npx playwright test tests/Educator/Login.spec.js

# Run all tests in a folder
npx playwright test tests/Educator/

# Run tests matching a title pattern
npx playwright test --grep "MIDAS Assessment"

# Run in headed mode (browser visible)
npx playwright test --headed

# Run in debug mode (step through)
npx playwright test --debug

# Run with slow motion (500ms between actions)
SLOW_MO=500 npx playwright test

# Run in headless mode (for CI)
npx playwright test --headless

# Run API tests only
npx playwright test tests/APIs/

# Run with custom timeout override
npx playwright test --timeout=600000 tests/Educator/HabitsOfMind.spec.js
```

### Viewing the HTML Report

```bash
npx playwright show-report
```

The report opens at `http://localhost:9323` by default.

---

## Browser Support

The framework is currently configured to run on **Chromium** (default Playwright browser). To add Firefox or WebKit, add a `projects` array to `playwright.config.js`:

```js
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
],
```

> ⚠️ The app is an Angular SPA. All browsers are supported by Playwright but the application has only been validated on Chromium during test development.

---

## Reporting

### Built-in HTML Report

Generated automatically at `playwright-report/index.html` after every run.

```bash
npx playwright show-report
```

### Failure Artifacts

On any test failure, two artifacts are saved automatically via `baseTest.js` → `ArtifactHelper`:

| Artifact | Location | When saved |
|---|---|---|
| Screenshot (full-page PNG) | `screenshots/<testName>_<timestamp>.png` | On failure |
| Video (.webm) | `videos/<testName>_<timestamp>.webm` | On failure |
| Playwright Trace | `test-results/` | On first retry |

### User Data Log

When tests create new accounts (signup flows), the registered email is appended to `test-results/userdata.json` via `Commonfun.saveUser()` for traceability.

---

## Architecture Summary

```
Test File (.spec.js)
      │
      ├── imports Page Object(s) from Pages/
      │         │
      │         ├── All locators as lazy getter properties
      │         └── All actions call stablePage() before/after
      │
      ├── imports test data from test-data/testdata.js
      │
      └── uses Fixtures/baseTest.js
                │
                └── afterEach → ArtifactHelper (screenshots + videos on failure)

Core stability:
  stablePage(page) ──► domcontentloaded ──► networkidle ──► 1s buffer ──► spinner wait
```

---

## Test Coverage Map

| Spec File | User Type | Functionality |
|---|---|---|
| `Login.spec.js` | Educator | Multi-user login + school selection |
| `Signup.spec.js` | Educator | Full registration + onboarding |
| `lander.spec.js` | Public | 7 marketing pages (Strengths, Wellbeing, Hope, Agency, Pricing, Overview, Why Thrively) |
| `HWCheckins.spec.js` | Educator | Hope check-in + Wellbeing check-in surveys |
| `MyClass.spec.js` | Educator | Add student manually |
| `DemoQuote.spec.js` | Public | Schedule Demo + Request Quote forms |
| `HopeAudit.spec.js` | Public | Hope Culture Survey (24 questions) |
| `SchoolofHope.spec.js` | Public | School of Hope survey via invite code |
| `Webinar.spec.js` | Public | Webinar registration |
| `districtSelfAssessment.spec.js` | Public | 6-question district assessment |
| `StrengthAssessment.spec.js` | Educator | Thrively Strengths Assessment (all questions, first-option strategy) |
| `MidasAssessment.spec.js` | Educator | MIDAS Assessment (rotating 1-2-3 pattern) |
| `HabitsOfMind.spec.js` | Educator | Thomas/Habits of Mind (80 questions, rotating 1-2-3) |
| `PersonalitiesAssessment.spec.js` | Educator | RIASEC Interest Profiler (60 questions, rotating 1-2-3) |
| `K2Assessment.spec.js` | Parent | Purchase + K-2 assessment flow |
| `ParentDashboard.spec.js` | Parent | Dashboard, career explorer, lesson detail |
| `ParentLander.spec.js` | Parent | Parent marketing pages + buy lander |
| `Parentsignup.spec.js` | Parent | Normal signup + purchase signup |
| `StudentSignup.spec.js` | Student | Email signup + invite code + interest selection |
| `StudentDP.spec.js` | Educator | Digital portfolio navigation |
| `Auth.spec.js` | API | POST /user/authenticate (valid + invalid) |
| `Summary.spec.js` | API | GET /user/summary with JWT auth |
