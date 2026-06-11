# Framework Guide — Thrively Playwright Automation

> Complete technical reference for maintaining, extending, and understanding every layer of the framework. Written for an engineer with no prior knowledge of the project.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [ES Module System](#2-es-module-system)
3. [Core Stability Layer — `stablePage`](#3-core-stability-layer--stablepage)
4. [Fixtures — `baseTest.js`](#4-fixtures--basetestjs)
5. [Page Object Model — Full Specification](#5-page-object-model--full-specification)
6. [Utility Classes](#6-utility-classes)
7. [Test Data Management](#7-test-data-management)
8. [Test File Structure](#8-test-file-structure)
9. [Assertion Patterns](#9-assertion-patterns)
10. [Wait Strategy](#10-wait-strategy)
11. [Login Flow Patterns](#11-login-flow-patterns)
12. [Assessment Automation Patterns](#12-assessment-automation-patterns)
13. [API Testing](#13-api-testing)
14. [Reporting & Artifacts](#14-reporting--artifacts)
15. [Configuration Management](#15-configuration-management)
16. [Naming Conventions](#16-naming-conventions)
17. [Coding Standards](#17-coding-standards)
18. [How to Create a New Page Class](#18-how-to-create-a-new-page-class)
19. [How to Create a New Test File](#19-how-to-create-a-new-test-file)
20. [How to Add Reusable Methods](#20-how-to-add-reusable-methods)
21. [SSR-Safe Locator Guidelines](#21-ssr-safe-locator-guidelines)
22. [Page Object Reference](#22-page-object-reference)
23. [Troubleshooting Guide](#23-troubleshooting-guide)
24. [Best Practices](#24-best-practices)
25. [Framework Design Decisions](#25-framework-design-decisions)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Test Layer                                │
│   tests/{Role}/{Feature}.spec.js                                 │
│   • Imports Page Objects and test data                           │
│   • Contains ONLY test logic and assertions                      │
│   • No locators, no raw page.locator() calls                     │
└──────────────────────┬──────────────────────────────────────────┘
                       │ uses
┌──────────────────────▼──────────────────────────────────────────┐
│                     Page Object Layer                            │
│   Pages/{Role}/{Feature}Page.js                                  │
│   • Lazy getter locators (evaluated at call time)                │
│   • Action methods (stablePage → action → stablePage)            │
│   • No assertions, no hardcoded test data                        │
└──────────────────────┬──────────────────────────────────────────┘
                       │ uses
┌──────────────────────▼──────────────────────────────────────────┐
│                    Utility / Core Layer                          │
│   Utility/stablePage.js      — SSR stability wrapper            │
│   Utility/artifactHelper.js  — Failure artifact capture         │
│   Utility/Commonfun.js       — saveUser() helper                 │
│   Fixtures/baseTest.js       — Extended test + afterEach hook    │
└──────────────────────┬──────────────────────────────────────────┘
                       │ reads
┌──────────────────────▼──────────────────────────────────────────┐
│                    Data Layer                                    │
│   test-data/testdata.js      — All exported test data           │
│   .env                       — Environment-specific secrets      │
└─────────────────────────────────────────────────────────────────┘
```

The application under test is an **Angular SSR (Server-Side Rendered)** SPA. This introduces a hydration delay between the initial HTML render and when Angular event listeners are active. Every framework decision accounts for this.

---

## 2. ES Module System

The `package.json` declares `"type": "module"`. This means:

- Every file uses `import` / `export`, **never** `require()` / `module.exports`
- Every import path **must** include the `.js` file extension — Node.js ESM does not auto-resolve extensions

```js
// ✅ CORRECT
import { stablePage } from '../../Utility/stablePage.js';
import { LoginPage }  from '../../Pages/Educator/LoginPage.js';

// ❌ WRONG — missing .js
import { stablePage } from '../../Utility/stablePage';
import { LoginPage }  from '../../Pages/Educator/LoginPage';
```

---

## 3. Core Stability Layer — `stablePage`

**File:** `Utility/stablePage.js`

This is the single most important utility in the framework. It solves Angular SSR hydration flakiness.

### What it does

```
stablePage(page)
    │
    ├── 1. waitForLoadState('domcontentloaded')  ← HTML parsed, Angular starts
    ├── 2. waitForLoadState('networkidle')        ← API calls and JS chunks settled
    ├── 3. waitForTimeout(1000)                   ← NgZone change-detection flush
    └── 4. Wait for spinners to disappear         ← Blocks on any visible loader
```

All four steps use `.catch(() => {})` — a timeout in any step is non-fatal; the downstream assertion will surface the real failure with a meaningful message.

### When to call it

| Situation | Call `stablePage`? |
|---|---|
| After `page.goto()` | ✅ Yes |
| Before the first action on a page | ✅ Yes |
| After any `.click()` that triggers navigation | ✅ Yes |
| After any `.click()` that triggers a significant DOM re-render | ✅ Yes |
| Between filling form fields (no navigation) | ❌ No — wastes time |
| Before assertions on an already-stable page | ❌ No |

### Standard action wrapper pattern

```js
// Every navigation/click action in a POM MUST follow:
async clickSomethingThatNavigates() {
  await stablePage(this.page);   // ensure page is stable BEFORE acting
  await this.someButton.click();
  await stablePage(this.page);   // ensure page is stable AFTER acting
}
```

### Adding new spinner selectors

If a new loading indicator is added to the app, add its CSS selector to the `spinnerSelectors` array in `stablePage.js`:

```js
const spinnerSelectors = [
  '.loading',
  '.spinner',
  '.loader',
  '[class*="loading"]',
  '[class*="spinner"]',
  'ngx-spinner',
  '.overlay',
  '.my-new-loader',   // ← add here
];
```

---

## 4. Fixtures — `baseTest.js`

**File:** `Fixtures/baseTest.js`

Every test file imports `{ test, expect }` from this file, **not** from `@playwright/test` directly.

```js
// ✅ All test files use this import
import { test, expect } from '../../Fixtures/baseTest.js';

// ❌ Do NOT import directly from playwright in most specs
import { test, expect } from '@playwright/test';
```

**Why:** The fixture wraps Playwright's `test` with an `afterEach` hook that automatically captures a full-page screenshot and saves the video when a test fails.

```js
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await ArtifactHelper.captureScreenshot(page, testInfo);
    await ArtifactHelper.saveVideo(page, testInfo);
  }
});
```

> **Exception:** Pure API tests (`tests/APIs/`) use `@playwright/test` directly since they use the `request` fixture, not `page`.

---

## 5. Page Object Model — Full Specification

### 5.1 File location

```
Pages/{Role}/{FeatureName}Page.js
```

- Educator pages → `Pages/Educator/`
- Parent pages → `Pages/Parent/`
- Student pages → `Pages/Student/`

### 5.2 Class structure

```js
import { stablePage } from '../../Utility/stablePage.js';

export class FeaturePage {
  constructor(page) {
    this.page = page;
    // ⚠️ DO NOT assign locators here (stale element risk)
  }

  // ── Section 1: Locators (all as getters) ────────────────────────────────

  get myButton()  { return this.page.getByRole('button', { name: 'Click Me' }); }
  get myInput()   { return this.page.getByRole('textbox', { name: 'Email' }); }
  get myHeading() { return this.page.getByRole('heading', { name: 'Welcome' }); }

  // ── Section 2: Action methods ────────────────────────────────────────────

  async goto() {
    await this.page.goto('https://qa.thrively.com/ng/#/some-path', {
      waitUntil: 'domcontentloaded',
    });
    await stablePage(this.page);
  }

  async clickMyButton() {
    await stablePage(this.page);
    await this.myButton.click();
    await stablePage(this.page);
  }

  async fillForm(data) {
    await this.myInput.fill(data.email);
    // No stablePage needed between field fills
  }
}
```

### 5.3 Getter locators — WHY this pattern

```js
// ❌ BAD — assigned in constructor, resolved once at construction time
constructor(page) {
  this.page = page;
  this.myButton = page.locator('.btn');  // Angular may re-render this element!
}

// ✅ GOOD — getter is a function, re-evaluated fresh every time it is accessed
get myButton() { return this.page.locator('.btn'); }
```

When Angular hydrates or re-renders a component, DOM elements are destroyed and recreated. A locator resolved in the constructor points to the old element and will throw `ElementHandle is not attached to the DOM`. Getters solve this by re-querying every time.

### 5.4 Locator priority (most stable → least stable)

Use locators in this priority order:

| Priority | Locator type | Example | Why |
|---|---|---|---|
| 1 | Role + accessible name | `getByRole('button', { name: 'Sign In' })` | Survives CSS/HTML changes |
| 2 | Placeholder / label text | `getByRole('textbox', { name: 'Email' })` | Survives CSS refactoring |
| 3 | Visible text | `getByText('Join Thrively Now')` | Good for unique text |
| 4 | Custom component tag | `page.locator('teacher-dashboard')` | Angular components are stable identifiers |
| 5 | CSS class | `page.locator('.teacher-dashboard-tab')` | Use only for structural containers |
| 6 | `data-testid` | `getByTestId('submit-btn')` | Best if added by developers |
| 7 | XPath | `page.locator('xpath=//span[text()="X"]')` | Last resort |
| ❌ | Image alt text | `getByRole('img', { name: '...' })` | SSR does not guarantee alt text |
| ❌ | nth-child on dynamic lists | `locator('img').nth(2)` | Breaks if list order changes |

### 5.5 Constructor-only vs getter locators

Some older Page Objects (e.g., `StrengthAssessmentPage`, `MidasAssessmentPage`, `HabitsOfMindPage`) still assign locators in the constructor. These are being migrated. New Page Objects must use getters exclusively.

---

## 6. Utility Classes

### 6.1 `stablePage.js`

See [Section 3](#3-core-stability-layer--stablepage) for full documentation.

**Usage:**
```js
import { stablePage } from '../../Utility/stablePage.js';
await stablePage(this.page);
```

### 6.2 `artifactHelper.js`

**Purpose:** Saves failure evidence (screenshots and videos) to disk.  
**Used by:** `Fixtures/baseTest.js` `afterEach` hook — not called directly in tests.

**Methods:**

```js
ArtifactHelper.captureScreenshot(page, testInfo)
// Saves: screenshots/<testName>_<ISO-timestamp>.png (full page)

ArtifactHelper.saveVideo(page, testInfo)
// Saves: videos/<testName>_<ISO-timestamp>.webm
// Only runs when test.video = 'retain-on-failure' is set in config
```

**Helper internals:**
- `getSafeName(testInfo)` — strips whitespace and special characters from test title, appends ISO timestamp
- `ensureDir(dir)` — creates directory if it doesn't exist (`fs.mkdirSync(..., { recursive: true })`)

### 6.3 `Commonfun.js`

**Purpose:** Persist test-created user emails so they can be inspected after a run.

**Usage:**
```js
import { saveUser } from '../../Utility/Commonfun.js';

saveUser('kowsalya+parent1234567890@liftoffllc.com');
// Appends { email } object to test-results/userdata.json
```

### 6.4 `tests/utils/waitHelpers.js`

**Purpose:** Reusable `expect`-based wait wrappers for use in test files.

```js
import { waitForVisible, waitForText, waitForURL, waitForEnabled, retryAction }
  from '../../tests/utils/waitHelpers.js';

await waitForVisible(locator);               // toBeVisible({ timeout: 30000 })
await waitForText(locator, 'some text');     // toContainText
await waitForURL(page, /dashboard/);         // waitForURL({ timeout: 30000 })
await waitForEnabled(buttonLocator);         // toBeEnabled({ timeout: 15000 })

await retryAction(async () => {              // retry up to 3 times with 500ms delay
  await myUnstableButton.click();
});
```

---

## 7. Test Data Management

**File:** `test-data/testdata.js`

All test data is centralized in named exports. No test data is hardcoded in spec files or POM files.

### 7.1 Export structure

| Export | Type | Used by |
|---|---|---|
| `Loginusers` | Object with `educator` user | Login, all assessment specs |
| `signupData` | Educator signup fields | Signup.spec.js |
| `schoolofhopeuser` | School of Hope valid + demo user | SchoolofHope.spec.js |
| `parentData` | Parent signup + purchase + child | Parentsignup, ParentDashboard |
| `hopeaudituser` | Hope Audit signup + invite user | HopeAudit.spec.js |
| `hopeAuditQuestions` | 24 questions with answers | HopeAudit.spec.js |
| `studentUser` | Student DOB, name, invite code | StudentSignup.spec.js |
| `webinarUser` | Webinar registration fields | Webinar.spec.js |
| `childData` | Shared child creation data | K2Assessment, ParentDashboard |
| `parentQuestions` | 16 K-2 parent questions + answers | K2Assessment.spec.js |
| `childQuestions` | 14 child questions (image/text) | K2Assessment.spec.js |
| `DemoQuotedata` | Factory function for demo/quote form | DemoQuote.spec.js |
| `checkinData` | Login creds + question arrays | HWCheckins.spec.js |
| `districtData` | URLs + 6 question configs | districtSelfAssessment.spec.js |
| `educatorUser` | Educator for My Class flow | MyClass.spec.js |
| `landerData` | URLs for 7 lander pages | lander.spec.js |

### 7.2 Dynamic email pattern

Emails that must be unique per run use a timestamp-factory function:

```js
// testdata.js
email: (ts) => `kowsalya+parent${ts}@liftoffllc.com`

// Usage in test
const ts = Date.now();
const email = data.email(ts);
```

For data objects that generate emails at import time, `Date.now()` is called inline:

```js
email: `kowsalya+${Date.now()}@liftoffllc.com`
```

### 7.3 Adding new test data

1. Add the export to `test-data/testdata.js`
2. Use timestamp suffix for any email or username that must be unique
3. Import it in the spec file:
   ```js
   import { myNewData } from '../../test-data/testdata.js';
   ```

---

## 8. Test File Structure

### 8.1 Standard template

```js
/**
 * Test Suite: <Feature Name> — <User Role>
 *
 * Steps:
 *   1. Brief description of what this test does
 *   2. ...
 */

import { test, expect }        from '../../Fixtures/baseTest.js';     // NOT from @playwright/test
import { SomePageObject }      from '../../Pages/Educator/SomePage.js';
import { someTestData }        from '../../test-data/testdata.js';

// ── Reusable helper (if login is needed) ──────────────────────────────────────
async function loginAsEducator(page) {
  // ... login steps
}

// ── Test Suite ────────────────────────────────────────────────────────────────
test.describe('Feature Name', () => {

  test('User can accomplish <goal>', async ({ page }) => {
    const po = new SomePageObject(page);

    // Steps with inline comments explaining intent
    await loginAsEducator(page);

    await po.navigateTo();
    await expect(po.pageHeading).toBeVisible();

    await po.doAction();
    await expect(page).toHaveURL(/expected-url/);
  });

});
```

### 8.2 Key rules

- **One `test.describe` per file** — groups all tests for a feature
- **Inline step comments** — every logical group of actions gets a `// ── Step N: Description` comment
- **No raw `page.locator()`** in tests — all DOM queries go through Page Objects
- **No hardcoded waits** (`page.waitForTimeout`) in tests — use `expect(locator).toBeVisible()` or Page Object actions
- **Local login helper** — each spec defines its own `loginAsEducator(page)` function; this pattern is intentional (spec files are self-contained)

---

## 9. Assertion Patterns

### 9.1 Standard timeouts

All assertions use the global `expect.timeout: 30000` from `playwright.config.js`. Explicit timeouts are added only when a specific step is known to take longer:

```js
// Uses global 30s default
await expect(locator).toBeVisible();

// Override for longer operations (e.g., dashboard load after SSR)
await expect(locator).toBeVisible({ timeout: 15000 });
```

### 9.2 Preferred assertion patterns

```js
// Element visibility
await expect(locator).toBeVisible();
await expect(locator).not.toBeVisible();

// Text content
await expect(locator).toContainText('some text');
await expect(locator).toHaveText('exact text');

// URL validation
await expect(page).toHaveURL(/regex-pattern/);
await expect(page).toHaveURL('https://exact.url/path');

// Count validation (e.g., number of answer options)
await expect(locator).toHaveCount(6);

// State validation
await expect(button).toBeDisabled();
await expect(button).toBeEnabled();

// Negative (use sparingly, can be slow)
await expect(locator).not.toBeVisible();
await expect(locator).not.toContainText('text');
```

### 9.3 SSR-safe assertion rule

> **Never assert on image `alt` text.** Angular SSR may not render `alt` attributes on decorative images, or the text may differ from what the browser DOM shows.

```js
// ❌ FRAGILE — SSR does not guarantee alt text
await expect(page.getByRole('img', { name: 'Hero image 2' })).toBeVisible();

// ✅ STABLE — assert on surrounding text content or custom component
await expect(page.locator('jumbotron')).toContainText('Every Child Deserves to Thrive');
```

---

## 10. Wait Strategy

The framework uses a layered wait strategy. Each layer is chosen deliberately:

| Layer | Mechanism | Where used |
|---|---|---|
| **Navigation wait** | `page.waitForURL(pattern)` | After click triggers URL change |
| **State wait** | `page.waitForLoadState('networkidle')` | Inside `stablePage()` |
| **SSR buffer** | `page.waitForTimeout(1000)` | Inside `stablePage()` only |
| **Element wait** | `expect(locator).toBeVisible()` | In test assertions |
| **Enable wait** | `locator.waitFor({ state: 'enabled' })` | Before clicking disabled buttons |
| **Spinner wait** | `spinner.waitFor({ state: 'hidden' })` | Inside `stablePage()` |

### Wait anti-patterns to avoid

```js
// ❌ Hard wait — makes tests slow and still flaky
await page.waitForTimeout(5000);

// ❌ waitForSelector (legacy, use Locator API instead)
await page.waitForSelector('.some-class');

// ✅ Use expect-based waits
await expect(page.locator('.some-class')).toBeVisible({ timeout: 15000 });
```

---

## 11. Login Flow Patterns

### 11.1 Educator login (most common)

Every educator spec defines a local `loginAsEducator(page)` helper:

```js
async function loginAsEducator(page) {
  const user  = Loginusers.educator;   // from testdata.js
  const login = new LoginPage(page);

  await login.goto();           // navigate + stablePage
  await login.openLogin();      // click Login button + stablePage
  await login.login(user);      // fill email/password + signIn + stablePage

  await expect(page.getByText('Choose Account')).toBeVisible();
  await login.selectSchool(user.schoolName);       // click GECK + stablePage

  await page.waitForURL('**/teacher/**/dashboard**');
}
```

### 11.2 Parent login

```js
const parent = new ParentDashboard(page);
await parent.login(parentLoginUser);
// parentLoginUser = { email: '...', password: '...' }
```

### 11.3 `storageState.json`

`Login.spec.js` captures `storageState.json` after a successful login:
```js
await page.context().storageState({ path: 'storageState.json' });
```

`StudentDP.spec.js` reuses it:
```js
test.use({ storageState: 'storageState.json' });
```

This avoids repeating the login flow in the Digital Portfolio test.

---

## 12. Assessment Automation Patterns

The framework covers four assessments on the Educator profile. Each uses one of two answer strategies.

### 12.1 First-option strategy (Strengths Assessment)

```js
async answerFirstOption() {
  // Handle two question types:
  // 1. Text list: ul > li
  const liCount = await this.page.locator('ul li').count();
  if (liCount > 0) {
    await this.page.locator('ul li').first().click();
    return 'list';
  }
  // 2. Hidden radio (image questions): click label via JS
  const labelCount = await this.page.evaluate(
    () => document.querySelectorAll('label[for*="radio"]').length
  );
  if (labelCount > 0) {
    await this.page.evaluate(() => {
      document.querySelector('label[for*="radio"]').click();
    });
    return 'image-radio';
  }
}
```

### 12.2 Rotating 1-2-3 pattern (MIDAS, Habits of Mind, RIASEC)

All three long-form assessments use modulo arithmetic to cycle through answers:

```js
// qNum is extracted from the URL: /assessments/midas/q/42 → qNum = 42
const qNum = parseInt(currentUrl.split('/q/')[1], 10);
const optionIndex = qNum % 3;   // 0 → 1 → 2 → 0 → 1 → 2 ...
await this.answerOptions.nth(optionIndex).click();
```

This guarantees a deterministic, repeatable pattern without hardcoding per-question answers.

### 12.3 Navigation in assessment loops

RIASEC (best pattern — uses `waitForURL`):
```js
await this.nextBtn.click();
if (isLastQ) {
  await this.page.waitForURL('**/assessments/riasec/finish**', { timeout: 15000 });
} else {
  await this.page.waitForURL(`**/assessments/riasec/q/${qNum + 1}`, { timeout: 8000 });
}
```

MIDAS (polling loop):
```js
if (currentUrl === prevUrl) continue;   // skip until URL changes
prevUrl = currentUrl;
// ... answer and click Next
```

### 12.4 Assessment comparison table

| Assessment | URL slug | Questions | Options | Answer strategy |
|---|---|---|---|---|
| Strengths (Thrively) | `/thrively/` | Variable | 2 types (list + image radio) | First option |
| MIDAS | `/midas/` | ~120 | 6 (text list) | Rotating 1-2-3 |
| Habits of Mind (Thomas) | `/thomas/` | 80 | 6 (text list) | Rotating 1-2-3 |
| RIASEC (Personalities) | `/riasec/` | 60 | 5 (text list, fixed text) | Rotating 1-2-3 |

---

## 13. API Testing

API tests live in `tests/APIs/` and use Playwright's `request` fixture.

```js
import { test, expect } from "@playwright/test";  // Direct import (no page fixture needed)

test('POST /user/authenticate', async ({ request }) => {
  const response = await request.post('https://qa.thrively.com/user/authenticate', {
    data: { options: { ... }, user: { mode: 'email', mode_id: '...', password: '...' } }
  });
  expect(response.status()).toBe(200);
});
```

### JWT auth pattern (Summary test)

```js
// Step 1: Get token
const loginRes = await request.post('.../authenticate', { data: { ... } });
const { jwt_token } = await loginRes.json();

// Step 2: Use token in Authorization header
const response = await request.get('.../user/summary', {
  headers: { Authorization: `Bearer ${jwt_token}` }
});
expect(response.status()).toBe(200);
```

---

## 14. Reporting & Artifacts

### HTML Report

Generated automatically at `playwright-report/index.html`.

```bash
npx playwright show-report
```

Features: test timeline, failure screenshots, trace viewer links, video playback.

### Failure Artifacts (auto-captured)

`baseTest.js` calls `ArtifactHelper` in `afterEach`:

```
screenshots/
  LoginTest_Educator_2024-01-15T10-30-45-123Z.png

videos/
  LoginTest_Educator_2024-01-15T10-30-45-123Z.webm
```

Filename format: `{test_title_sanitized}_{ISO_timestamp}`

### Trace Files

Playwright traces are captured on first retry (`trace: 'on-first-retry'` in config). View them with:

```bash
npx playwright show-trace test-results/<path-to-trace>.zip
```

Traces show DOM snapshots, network calls, console logs, and screenshots at every action.

---

## 15. Configuration Management

### `playwright.config.js` — key settings to know

```js
{
  timeout: 300_000,          // Per-test (5 min) — needed for 80-question assessments
  expect: { timeout: 30_000 }, // Per-assertion — handles Angular SSR delays

  use: {
    headless: false,             // Set true in CI
    actionTimeout:     60_000,   // Per action (Angular binding can be slow)
    navigationTimeout: 90_000,   // Per navigation (SPA routing)
    slowMo: process.env.SLOW_MO  // Debug mode: SLOW_MO=500 npx playwright test
  }
}
```

### Overriding timeout for a single test

```js
test.describe('Long Assessment', () => {
  test.setTimeout(700_000);  // Override global timeout for this suite
  test('...', async ({ page }) => { ... });
});
```

### Environment variable injection

```js
// In testdata.js or spec files:
process.env.SCHOOL_OF_HOPE_CODE  // reads from .env via dotenv
process.env.BASE_URL
```

---

## 16. Naming Conventions

### Files

| Item | Convention | Example |
|---|---|---|
| Page Object files | PascalCase + `Page.js` suffix | `LoginPage.js`, `MidasAssessmentPage.js` |
| Spec files | PascalCase + `.spec.js` | `MidasAssessment.spec.js` |
| Utility files | camelCase | `stablePage.js`, `artifactHelper.js` |
| Test data file | camelCase | `testdata.js` |

### Classes and methods

| Item | Convention | Example |
|---|---|---|
| Class names | PascalCase | `LoginPage`, `MidasAssessmentPage` |
| Method names | camelCase | `clickLogin()`, `fillSignupForm()` |
| Getter names | camelCase | `get loginBtn()`, `get emailInput()` |
| Test data exports | camelCase | `Loginusers`, `parentData`, `DemoQuotedata` |

### Test naming

```js
// test.describe — feature or page name
test.describe('MIDAS Assessment Flow', () => {

  // test — "User role + can + action + goal"
  test('Educator can complete MIDAS Assessment with rotating 1-2-3 pattern', ...);

});
```

---

## 17. Coding Standards

### Imports

```js
// 1. Playwright imports first
import { test, expect } from '../../Fixtures/baseTest.js';

// 2. Page Objects
import { LoginPage } from '../../Pages/Educator/LoginPage.js';

// 3. Test data
import { Loginusers } from '../../test-data/testdata.js';
```

### Async/await

- All functions that interact with the browser are `async`
- Every Playwright API call is `await`ed — never fire-and-forget
- `Promise.all` is used where parallel operations are genuinely parallel (e.g., `context.waitForEvent('page')` + click that opens popup)

### Error handling

- POM action methods use `.catch(() => {})` only on `waitForLoadState` and `waitFor` calls inside `stablePage`
- Tests do NOT use try/catch — test failures should propagate naturally to the reporter
- Assessment loop safety: all `while(true)` / `for` loops include either a `maxIterations` cap or an explicit `break` condition

---

## 18. How to Create a New Page Class

### Step-by-step

**1. Create the file**
```
Pages/{Role}/{FeatureName}Page.js
```

**2. Use this template**
```js
import { stablePage } from '../../Utility/stablePage.js';

export class MyFeaturePage {
  constructor(page) {
    this.page = page;
  }

  // ── Locators ─────────────────────────────────────────────────────────────

  get pageHeading()  { return this.page.getByRole('heading', { name: 'My Heading' }); }
  get submitButton() { return this.page.getByRole('button', { name: 'Submit' }); }
  get emailInput()   { return this.page.getByRole('textbox', { name: 'Email' }); }

  // ── Actions ──────────────────────────────────────────────────────────────

  async goto() {
    await this.page.goto('https://qa.thrively.com/ng/#/my-path', {
      waitUntil: 'domcontentloaded',
    });
    await stablePage(this.page);
  }

  async fillEmail(email) {
    await this.emailInput.fill(email);
    // No stablePage needed — filling a field doesn't trigger navigation
  }

  async clickSubmit() {
    await stablePage(this.page);          // stable before action
    await this.submitButton.click();
    await stablePage(this.page);          // stable after navigation/re-render
  }
}
```

**3. Export checklist**
- [ ] Class name matches file name
- [ ] All locators are getters (`get name() { return ... }`)
- [ ] `stablePage` wraps all navigation actions
- [ ] `goto()` uses `{ waitUntil: 'domcontentloaded' }`
- [ ] `.js` extension on all imports
- [ ] Named export (`export class`, not `export default`)

---

## 19. How to Create a New Test File

### Step-by-step

**1. Create the file**
```
tests/{Role}/{FeatureName}.spec.js
```

**2. Use this template**
```js
/**
 * Test Suite: <Feature> — <Role>
 * Steps covered: list the user journey steps
 */

import { test, expect }      from '../../Fixtures/baseTest.js';
import { MyFeaturePage }     from '../../Pages/Educator/MyFeaturePage.js';
import { LoginPage }         from '../../Pages/Educator/LoginPage.js';
import { myData, Loginusers } from '../../test-data/testdata.js';

// ── Login helper (copy-paste this exact pattern for educator tests) ─────────
async function loginAsEducator(page) {
  const user  = Loginusers.educator;
  const login = new LoginPage(page);
  await login.goto();
  await login.openLogin();
  await login.login(user);
  await expect(page.getByText('Choose Account')).toBeVisible();
  await login.selectSchool(user.schoolName);
  await page.waitForURL('**/teacher/**/dashboard**');
}

// ── Test Suite ────────────────────────────────────────────────────────────────
test.describe('My Feature Name', () => {

  test('User can <accomplish something>', async ({ page }) => {
    const feature = new MyFeaturePage(page);

    // ── Step 1: Login ──────────────────────────────────────────────────
    await loginAsEducator(page);

    // ── Step 2: Navigate to feature ────────────────────────────────────
    await feature.goto();
    await expect(feature.pageHeading).toBeVisible();

    // ── Step 3: Perform action ─────────────────────────────────────────
    await feature.fillEmail(myData.email);
    await feature.clickSubmit();

    // ── Step 4: Assert result ──────────────────────────────────────────
    await expect(page).toHaveURL(/success/);
    await expect(page.getByText('Thank you')).toBeVisible();
  });

});
```

**3. Checklist**
- [ ] Import `test, expect` from `../../Fixtures/baseTest.js` (not `@playwright/test`)
- [ ] All imports have `.js` extension
- [ ] No raw `page.locator()` or `page.waitForTimeout()` in test body
- [ ] Step comments explain each logical block
- [ ] Assertions use `expect(locator).toBeVisible()` not `expect(await locator.isVisible()).toBe(true)`

---

## 20. How to Add Reusable Methods

### Option A: Add to an existing Page Object

If the method belongs to a specific page, add it as an action method in the relevant Page Object.

```js
// In LoginPage.js
async loginAndSelectSchool(user) {
  await this.goto();
  await this.openLogin();
  await this.login(user);
  await this.selectSchool(user.schoolName);
}
```

### Option B: Add to `tests/utils/waitHelpers.js`

If the method is a generic wait or retry helper useful across multiple tests:

```js
// In waitHelpers.js
export async function waitForModalClose(page) {
  await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10000 });
}
```

### Option C: Add to `Utility/Commonfun.js`

If the method involves file system, environment variables, or shared state:

```js
// In Commonfun.js
export function loadSavedUsers() {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}
```

### Option D: Local helper function in spec file

If the helper is only used within one spec file, define it as a local `async function` above the `test.describe` block:

```js
// Local to this spec only
async function completeOnboarding(page) {
  for (let i = 0; i < 7; i++) {
    await page.getByRole('button', { name: 'Next' }).click();
  }
}
```

---

## 21. SSR-Safe Locator Guidelines

The app runs Angular SSR. These rules prevent SSR-specific failures:

### DO

```js
// ✅ Use component tag selectors — Angular custom elements are always present
page.locator('teacher-dashboard')
page.locator('hope-audit-lander')
page.locator('assessments-questions')

// ✅ Use text content for section visibility checks
await expect(section).toContainText('Expected Section Heading');

// ✅ Use role + name for interactive elements
page.getByRole('button', { name: 'Sign In' })
page.getByRole('textbox', { name: 'Email or Username' })

// ✅ Use URL patterns to confirm navigation
await expect(page).toHaveURL(/\/assessments\/midas\/intro/);
```

### DO NOT

```js
// ❌ Image alt text — unreliable in SSR
page.getByRole('img', { name: 'Hero image 2' })

// ❌ Generic positional img selectors
page.locator('img').nth(3)

// ❌ Clicking images — images are decorative in SSR
await page.getByRole('img', { name: '...' }).click();

// ❌ Assuming a section is visible just because an image loads
```

---

## 22. Page Object Reference

| Class | File | Purpose |
|---|---|---|
| `LoginPage` | `Pages/Educator/LoginPage.js` | Educator login, school selection |
| `CheckInPage` | `Pages/Educator/CheckInPage.js` | Hope + Wellbeing teacher check-in surveys |
| `DemoQuotePage` | `Pages/Educator/DemoQuotePage.js` | Schedule Demo and Request Quote forms |
| `HopeAudit` | `Pages/Educator/HopeAudit.js` | Hope Culture Survey (signup + invite + 24 questions) |
| `Landerpages` | `Pages/Educator/Landerpages.js` | All 7 SSR marketing lander pages |
| `MyClassPage` | `Pages/Educator/MyClassPage.js` | Add student manually to a class |
| `SchoolofHope` | `Pages/Educator/SchoolofHope.js` | School of Hope survey (invite code flow) |
| `Signup` | `Pages/Educator/Signup.js` | Educator registration + onboarding |
| `WebinarPage` | `Pages/Educator/WebinarPage.js` | Webinar signup and video viewing |
| `DistrictSelfAssessmentPage` | `Pages/Educator/districtSelfAssessment.page.js` | 6-question district assessment + results |
| `StrengthAssessmentPage` | `Pages/Educator/StrengthAssessmentPage.js` | Thrively Strengths Assessment (first-option strategy) |
| `MidasAssessmentPage` | `Pages/Educator/MidasAssessmentPage.js` | MIDAS Multiple Intelligences Assessment |
| `HabitsOfMindPage` | `Pages/Educator/HabitsOfMindPage.js` | Thomas / Habits of Mind Assessment (80 questions) |
| `PersonalitiesAssessmentPage` | `Pages/Educator/PersonalitiesAssessmentPage.js` | RIASEC Interest Profiler (60 questions) |
| `K2Assessment` | `Pages/Parent/K2Assessment.js` | Parent login, add child, purchase, K-2 assessment |
| `ParentDashboard` | `Pages/Parent/ParentDashboard.js` | Parent dashboard, career explorer, lesson detail |
| `ParentLander` | `Pages/Parent/ParentLander.js` | Parent marketing pages + assessment purchase |
| `Parentsignup` | `Pages/Parent/Parentsignup.js` | Parent signup (normal + purchase flows) |
| `StudentSignup` | `Pages/Student/StudentSignup.js` | Student registration, invite code, interests |

---

## 23. Troubleshooting Guide

### Test times out waiting for element

```
Error: expect(locator).toBeVisible() → Timeout 30000ms
```

**Causes & fixes:**
1. Angular not yet hydrated → ensure `stablePage()` is called before the action
2. Element is inside a lazy-loaded component → increase timeout: `.toBeVisible({ timeout: 60000 })`
3. Locator is wrong → use Playwright's Inspector (`npx playwright codegen https://qa.thrively.com`) to find the correct locator
4. Test account state is wrong (e.g., assessment already completed) → reset account state or use a different test account

### `ElementHandle is not attached to the DOM`

**Cause:** A locator was stored in the constructor (old style) and Angular re-rendered the element.  
**Fix:** Convert to a getter: `get myEl() { return this.page.locator(...) }`

### `import { X } from '...' — Cannot find module`

**Cause:** Missing `.js` extension on import.  
**Fix:** Add `.js`: `import { X } from './X.js'`

### Assessment loop doesn't advance past a question

**Symptom:** Loop iterates many times but `prevUrl === currentUrl` keeps returning early.  
**Cause:** Option click not registered; `Next` never enables.  
**Fix:** Add a `waitFor({ state: 'enabled' })` before clicking Next:
```js
await this.nextBtn.waitFor({ state: 'enabled', timeout: 5000 }).catch(() => {});
```

### `storageState.json not found`

**Cause:** `Login.spec.js` hasn't been run, or it failed before capturing state.  
**Fix:** Run `Login.spec.js` first, or remove `test.use({ storageState: '...' })` from `StudentDP.spec.js` and add a full login.

### Video not saved after failure

**Cause:** `playwright.config.js` `video: 'retain-on-failure'` requires that the test was run with video enabled.  
**Fix:** Ensure `video: 'retain-on-failure'` is set (it is by default). Check that `videos/` directory exists (created automatically by `ArtifactHelper.ensureDir`).

### Spinner wait blocks test for 15 seconds

**Cause:** `stablePage` waits up to 15 s for a spinner to disappear.  
**Fix:** If no spinners exist on this page, the selector simply won't match and `isVisible({ timeout: 500 })` returns `false` quickly. If a new spinner class is causing a mismatch, remove it from `spinnerSelectors` or fix the selector.

### School of Hope test fails at code entry

**Cause:** `SCHOOL_OF_HOPE_CODE` env variable not set.  
**Fix:** Add `SCHOOL_OF_HOPE_CODE=73010` to your `.env` file. The code may also expire — get a fresh code from the product team.

---

## 24. Best Practices

1. **One test per user journey** — assessment tests are long by design; don't split them across multiple tests, as each step depends on the previous.

2. **Keep test data in `testdata.js`** — never hardcode emails, passwords, or school names in spec files or POMs.

3. **Always use `stablePage` around navigation** — never skip it "to save time"; SSR hydration failures are the biggest source of flakiness.

4. **Prefer `toContainText` over `toHaveText`** — Angular may inject whitespace or child elements that make exact text matching fragile.

5. **Use custom Angular component tags as parent containers** — `page.locator('teacher-dashboard')` is more stable than any CSS class inside it.

6. **Document assessment URLs and selectors in POM JSDoc** — future engineers rely on these comments to understand what `ul.m0imp li.mtb10` means.

7. **Use timestamp-suffixed emails** — `kowsalya+${Date.now()}@liftoffllc.com` prevents email-already-registered errors between runs.

8. **Prefer `waitForURL` over `waitForLoadState` for navigation confirmation** — `waitForURL` is more precise for Angular hash routing.

9. **Use `page.waitForURL('**/dashboard**')` patterns** — double-asterisk glob patterns work across different teacher IDs without hardcoding user-specific IDs.

10. **Never click images** — they are decorative in SSR. Click the CTA button or text link that is always present.

---

## 25. Framework Design Decisions

### Why Playwright (not Selenium/Cypress)?

- Built-in support for Angular SSR's `networkidle` wait state
- Native handling of iframes (used for YouTube and rich-text editors)
- `waitForURL` API is perfect for Angular hash-routing (`#/path`)
- First-class API testing via `request` fixture in the same framework
- Automatic screenshot/video/trace on failure with minimal setup

### Why ES Modules (`"type": "module"`)?

- Modern JavaScript standard; aligns with Playwright's recommended setup
- `import` is statically analyzable, making IDE auto-complete and dead code detection better
- Required for top-level `await` without wrapper functions

### Why getter-based locators?

Angular's change detection destroys and recreates DOM elements during hydration. Locators evaluated in the constructor (once) become stale. Getter properties evaluate the locator fresh on every access, resolving to the current DOM state.

### Why per-spec `loginAsEducator()` functions?

Each spec is designed to be runnable independently without shared state. A shared `beforeEach` login would require all tests in a suite to depend on prior state. Local functions make specs self-contained and easier to debug in isolation.

### Why `stablePage` instead of just `networkidle`?

`networkidle` alone isn't sufficient for Angular SSR because:
1. Angular's `NgZone` runs microtasks after the last network request
2. The app uses lazy loading — components hydrate asynchronously after initial load
3. Some Angular animations run via `requestAnimationFrame`, not tied to network activity

The 1 s `waitForTimeout` buffer is the minimal reliable approach for Angular change-detection flush without making tests overly slow.

### Why `getByRole` over CSS selectors?

Role-based selectors match how users and screen readers perceive the page, not how it's styled. They survive CSS refactoring, class name changes, and designer-driven DOM restructuring — all common in an actively developed SaaS product.
