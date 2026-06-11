# Claude Prompt — Thrively Playwright Test Generator

> **Purpose:** Copy this entire prompt into Claude (or any capable AI assistant) when you need to generate new Playwright test cases or Page Objects for the Thrively automation framework. The prompt encodes every framework rule so the AI produces code that is immediately copy-paste ready with zero manual adjustment.

---

## HOW TO USE THIS FILE

1. Open a new Claude conversation.
2. Paste this entire file as your **first message**.
3. Then describe what you need, e.g.:
   - *"Generate a test for the Educator Profile page that verifies the user can update their bio text."*
   - *"Create a Page Object for the new Course Builder page at `/ng/#/course-builder`."*
   - *"Write a test that verifies the parent can view their child's digital portfolio."*

Claude will generate code that strictly follows every rule below.

---

## SYSTEM CONTEXT

You are generating Playwright JavaScript automation code for the **Thrively education platform** (`https://qa.thrively.com`). This is an **Angular SSR (Server-Side Rendered) SPA** with hash-based routing (`#/path`). The framework is already built — you are extending it, not creating it from scratch.

**CRITICAL:** Every rule in this prompt is non-negotiable. Do not deviate from patterns shown here, even if you think a shorter approach would work.

---

## PART 1 — PROJECT STRUCTURE

```
Playwright_Automation/
├── Fixtures/baseTest.js              ← Extended test fixture — ALWAYS import test from here
├── Utility/
│   ├── stablePage.js                 ← SSR stability wrapper — MUST use in every POM action
│   ├── artifactHelper.js             ← Auto-captures screenshots/videos on failure
│   └── Commonfun.js                  ← saveUser(email) — persists created emails to JSON
├── Pages/
│   ├── Educator/                     ← 14 Page Objects for educator flows
│   ├── Parent/                       ← 4 Page Objects for parent flows
│   └── Student/                      ← 1 Page Object for student flows
├── tests/
│   ├── Educator/                     ← 14 spec files
│   ├── Parent/                       ← 4 spec files
│   ├── Student/                      ← 2 spec files
│   ├── APIs/                         ← 2 API spec files
│   └── utils/waitHelpers.js          ← Shared expect-based wait helpers
└── test-data/testdata.js             ← ALL test data — single source of truth
```

---

## PART 2 — ES MODULE RULES (MANDATORY)

The project uses `"type": "module"`. Violating any of these rules causes a runtime error:

```js
// ✅ ALWAYS use ES module import/export
import { test, expect } from '../../Fixtures/baseTest.js';
import { LoginPage }    from '../../Pages/Educator/LoginPage.js';
import { Loginusers }   from '../../test-data/testdata.js';

export class MyPage { ... }

// ❌ NEVER use require / module.exports
const { test } = require('@playwright/test');   // FORBIDDEN
module.exports = MyPage;                        // FORBIDDEN
```

**Every import path must include the `.js` extension.** Node.js ESM does not auto-resolve extensions.

---

## PART 3 — THE `stablePage` UTILITY (MOST IMPORTANT RULE)

**File:** `Utility/stablePage.js`

This function solves Angular SSR hydration race conditions. It must be called before AND after any action that causes navigation or a significant DOM re-render.

```js
// What stablePage does internally:
// 1. waitForLoadState('domcontentloaded')  — HTML parsed, Angular starts
// 2. waitForLoadState('networkidle')        — API calls settled
// 3. waitForTimeout(1000)                   — Angular NgZone flush buffer
// 4. Waits for spinners/loaders to disappear
```

**RULES:**

```js
// ✅ Call stablePage BEFORE and AFTER any click that triggers navigation
async clickSubmit() {
  await stablePage(this.page);
  await this.submitBtn.click();
  await stablePage(this.page);
}

// ✅ Call stablePage AFTER page.goto()
async goto() {
  await this.page.goto('https://qa.thrively.com/ng/#/path', { waitUntil: 'domcontentloaded' });
  await stablePage(this.page);
}

// ❌ NEVER skip stablePage around navigation actions
// ❌ NEVER add stablePage between filling form fields (no navigation = no need)
// ❌ NEVER add raw waitForTimeout() in test files or POM files outside of stablePage
```

---

## PART 4 — PAGE OBJECT MODEL RULES

### 4.1 File location

```
Pages/{Educator|Parent|Student}/{FeatureName}Page.js
```

### 4.2 Mandatory class structure

```js
import { stablePage } from '../../Utility/stablePage.js';

export class FeaturePage {
  constructor(page) {
    this.page = page;
    // ⚠️ DO NOT assign any locators here — SSR re-renders will stale them
  }

  // ── SECTION 1: Locators — ALWAYS as getter properties ──────────────────

  get pageHeading()  { return this.page.getByRole('heading', { name: 'Title' }); }
  get submitBtn()    { return this.page.getByRole('button',  { name: 'Submit' }); }
  get emailInput()   { return this.page.getByRole('textbox', { name: 'Email' }); }
  get someSection()  { return this.page.locator('custom-component-tag'); }

  // ── SECTION 2: Action methods ───────────────────────────────────────────

  async goto() {
    await this.page.goto('https://qa.thrively.com/ng/#/route', {
      waitUntil: 'domcontentloaded',
    });
    await stablePage(this.page);
  }

  async clickSubmit() {
    await stablePage(this.page);
    await this.submitBtn.click();
    await stablePage(this.page);
  }

  async fillEmail(email) {
    // No stablePage between field fills — filling doesn't trigger navigation
    await this.emailInput.fill(email);
  }
}
```

### 4.3 WHY getters (not constructor properties)

Angular SSR destroys and recreates DOM elements during hydration. Constructor-assigned locators go stale. Getters re-query the DOM fresh on every call:

```js
// ❌ STALE — assigned once, breaks after Angular re-renders
constructor(page) {
  this.myBtn = page.locator('.btn');  // NEVER do this
}

// ✅ FRESH — re-evaluated on every access
get myBtn() { return this.page.locator('.btn'); }
```

### 4.4 Locator priority (use highest available)

```
1. getByRole('button', { name: '...' })        ← Most stable
2. getByRole('textbox', { name: '...' })
3. getByRole('heading', { name: '...' })
4. getByText('Exact text')
5. page.locator('custom-component-tag')         ← Angular component names are stable
6. page.locator('.specific-css-class')          ← Only for structural containers
7. page.locator('[formcontrolname="field"]')    ← For Angular reactive forms
8. page.locator('xpath=//...')                  ← Last resort
❌ getByRole('img', { name: '...' })           ← NEVER — SSR doesn't guarantee alt text
❌ page.locator('img').nth(N)                  ← NEVER — positional, breaks with DOM changes
```

---

## PART 5 — TEST FILE RULES

### 5.1 Imports

```js
// ✅ ALWAYS import test from baseTest (NOT from @playwright/test)
import { test, expect }      from '../../Fixtures/baseTest.js';
import { MyPageObject }      from '../../Pages/Educator/MyPage.js';
import { LoginPage }         from '../../Pages/Educator/LoginPage.js';
import { myData, Loginusers } from '../../test-data/testdata.js';

// ❌ Exception: API tests ONLY may import from @playwright/test
// because they use { request } fixture, not { page }
```

### 5.2 Test file template

```js
/**
 * Test Suite: <Feature Name> — <User Role>
 *
 * Steps:
 *  1. Login as educator
 *  2. Navigate to feature
 *  3. Perform action
 *  4. Assert result
 */

import { test, expect }      from '../../Fixtures/baseTest.js';
import { FeaturePage }       from '../../Pages/Educator/FeaturePage.js';
import { LoginPage }         from '../../Pages/Educator/LoginPage.js';
import { Loginusers, myData } from '../../test-data/testdata.js';

// ── Login helper — copy this EXACTLY for all educator tests ──────────────────
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
test.describe('Feature Name', () => {

  test('Educator can accomplish <goal>', async ({ page }) => {
    const feature = new FeaturePage(page);

    // ── Step 1: Login ──────────────────────────────────────────────────
    await loginAsEducator(page);

    // ── Step 2: Navigate ───────────────────────────────────────────────
    await feature.goto();
    await expect(feature.pageHeading).toBeVisible();
    await expect(page).toHaveURL(/expected-url-pattern/);

    // ── Step 3: Action ─────────────────────────────────────────────────
    await feature.doSomething();

    // ── Step 4: Assert ─────────────────────────────────────────────────
    await expect(page).toHaveURL(/result-url/);
    await expect(feature.successMessage).toBeVisible();
  });

});
```

### 5.3 Rules for test body

```js
// ✅ Use Page Object methods — never raw page.locator() in tests
await feature.clickSubmit();

// ✅ Use expect-based waits
await expect(locator).toBeVisible({ timeout: 30000 });

// ✅ Use URL patterns with wildcards
await expect(page).toHaveURL(/\/teacher\/\d+\/dashboard/);

// ✅ Use toContainText (forgiving of whitespace) over toHaveText
await expect(section).toContainText('Expected text');

// ❌ NEVER use waitForTimeout in test files
await page.waitForTimeout(3000);  // FORBIDDEN

// ❌ NEVER use raw locators in test files
await page.locator('.my-button').click();  // FORBIDDEN — use a POM method

// ❌ NEVER hardcode test data
await input.fill('kowsalya@gmail.com');  // Use testdata.js instead
```

---

## PART 6 — ASSERTION PATTERNS

```js
// Element visibility
await expect(locator).toBeVisible();
await expect(locator).not.toBeVisible();

// Text content (prefer toContainText)
await expect(locator).toContainText('partial text');
await expect(locator).toHaveText('exact text');

// Count
await expect(locator).toHaveCount(6);

// URL
await expect(page).toHaveURL(/regex/);
await expect(page).toHaveURL('https://exact.url');

// Form state
await expect(button).toBeDisabled();
await expect(button).toBeEnabled();

// Explicit timeout override (only when needed)
await expect(locator).toBeVisible({ timeout: 60000 });
```

**SSR-safe assertion rule:** Never assert on image `alt` text. Use surrounding section text instead:

```js
// ❌ FRAGILE
await expect(page.getByRole('img', { name: 'Hero image' })).toBeVisible();

// ✅ STABLE
await expect(page.locator('jumbotron')).toContainText('Every Child Deserves to Thrive');
```

---

## PART 7 — WAIT STRATEGY

```js
// ✅ Wait for URL change after navigation
await page.waitForURL('**/teacher/**/dashboard**');
await page.waitForURL(/\/assessments\/midas\/q\/0/);

// ✅ Wait for element state
await expect(locator).toBeVisible({ timeout: 30000 });
await locator.waitFor({ state: 'enabled', timeout: 5000 });

// ✅ Wait for network to settle (inside stablePage — not in tests directly)
await page.waitForLoadState('networkidle');

// ❌ NEVER use hard waits in tests or POMs
await page.waitForTimeout(5000);  // FORBIDDEN outside of stablePage
```

---

## PART 8 — TEST DATA RULES

All test data lives in `test-data/testdata.js`. Never hardcode values in specs or POMs.

```js
// Import from testdata.js
import { Loginusers, myFeatureData } from '../../test-data/testdata.js';

// For unique emails, use timestamp-factory functions:
email: (ts) => `kowsalya+feature${ts}@liftoffllc.com`

// Usage:
const ts = Date.now();
const email = myFeatureData.email(ts);
```

**When adding new test data**, add a named export to `testdata.js`:
```js
export const newFeatureData = {
  email: (ts) => `kowsalya+new${ts}@liftoffllc.com`,
  name: 'Test User',
  role: 'Educator'
};
```

---

## PART 9 — EXISTING PAGE OBJECTS (DO NOT DUPLICATE)

These Page Objects already exist. Reuse them:

| Class | File | Use for |
|---|---|---|
| `LoginPage` | `Pages/Educator/LoginPage.js` | `.goto()`, `.openLogin()`, `.login(user)`, `.selectSchool(name)` |
| `CheckInPage` | `Pages/Educator/CheckInPage.js` | Hope/Wellbeing check-in surveys |
| `DemoQuotePage` | `Pages/Educator/DemoQuotePage.js` | Schedule Demo / Request Quote forms |
| `HopeAudit` | `Pages/Educator/HopeAudit.js` | Hope Culture Survey |
| `Landerpages` | `Pages/Educator/Landerpages.js` | All marketing lander pages |
| `MyClassPage` | `Pages/Educator/MyClassPage.js` | Add students manually |
| `SchoolofHope` | `Pages/Educator/SchoolofHope.js` | School of Hope invite-code survey |
| `Signup` | `Pages/Educator/Signup.js` | Educator registration + onboarding |
| `WebinarPage` | `Pages/Educator/WebinarPage.js` | Webinar registration |
| `DistrictSelfAssessmentPage` | `Pages/Educator/districtSelfAssessment.page.js` | District self-assessment |
| `StrengthAssessmentPage` | `Pages/Educator/StrengthAssessmentPage.js` | Thrively Strengths Assessment |
| `MidasAssessmentPage` | `Pages/Educator/MidasAssessmentPage.js` | MIDAS Assessment |
| `HabitsOfMindPage` | `Pages/Educator/HabitsOfMindPage.js` | Habits of Mind (80 questions) |
| `PersonalitiesAssessmentPage` | `Pages/Educator/PersonalitiesAssessmentPage.js` | RIASEC (60 questions) |
| `K2Assessment` | `Pages/Parent/K2Assessment.js` | Parent K-2 assessment |
| `ParentDashboard` | `Pages/Parent/ParentDashboard.js` | Parent dashboard |
| `ParentLander` | `Pages/Parent/ParentLander.js` | Parent lander pages |
| `Parentsignup` | `Pages/Parent/Parentsignup.js` | Parent signup flows |
| `StudentSignup` | `Pages/Student/StudentSignup.js` | Student registration |

---

## PART 10 — REPORTING

Tests import from `Fixtures/baseTest.js`, which automatically:
- Captures a **full-page screenshot** on test failure → `screenshots/`
- Saves a **video** on test failure → `videos/`
- Saves a **Playwright trace** on first retry

No reporting code is needed in individual tests. The `afterEach` hook handles everything automatically.

---

## PART 11 — ASSESSMENT PATTERNS

When writing tests for long-form assessments, use these established patterns:

### First-option strategy (Thrively Strengths)
```js
// Already implemented in StrengthAssessmentPage.completeAllQuestionsWithFirstOption()
// Just call:
await assessment.completeAllQuestionsWithFirstOption();
```

### Rotating 1-2-3 pattern (MIDAS, Habits of Mind, RIASEC)
```js
// Read question number from URL, apply modulo:
const qNum = parseInt(currentUrl.split('/q/')[1], 10);
const optionIndex = qNum % 3;  // 0→1→2→0→1→2...
await this.answerOptions.nth(optionIndex).click();
```

### Navigation in question loops
```js
// Preferred: wait for exact URL after each question
await this.nextBtn.click();
await this.page.waitForURL(`**/assessments/riasec/q/${qNum + 1}`, { timeout: 8000 });
```

---

## PART 12 — NAMING CONVENTIONS

| Item | Convention | Example |
|---|---|---|
| Page Object class | PascalCase + `Page` suffix | `LoginPage`, `MidasAssessmentPage` |
| Page Object file | Match class name | `LoginPage.js`, `MidasAssessmentPage.js` |
| Spec file | PascalCase + `.spec.js` | `MidasAssessment.spec.js` |
| Getter name | camelCase | `get submitBtn()`, `get emailInput()` |
| Action method | camelCase verb | `clickSubmit()`, `fillEmail()`, `goto()` |
| `test.describe` | Feature name | `'MIDAS Assessment Flow'` |
| `test()` | `'Role can accomplish goal'` | `'Educator can complete MIDAS Assessment'` |

---

## PART 13 — COMPLETE GENERATION CHECKLIST

When generating any Page Object, verify:
- [ ] `import { stablePage }` from correct relative path with `.js`
- [ ] `export class` (named export, not default)
- [ ] Constructor only stores `this.page = page`
- [ ] ALL locators are `get` properties (zero locator assignments in constructor)
- [ ] ALL `goto()` methods use `{ waitUntil: 'domcontentloaded' }`
- [ ] ALL navigation actions call `stablePage` before AND after
- [ ] NO `getByRole('img', ...)` locators
- [ ] NO `page.locator('img').nth(N)` locators

When generating any test file, verify:
- [ ] Imports `test, expect` from `../../Fixtures/baseTest.js`
- [ ] All import paths have `.js` extension
- [ ] Defines local `loginAsEducator(page)` for educator tests
- [ ] No raw `page.locator()` calls in test body
- [ ] No `page.waitForTimeout()` calls in test body
- [ ] No hardcoded test data (use `testdata.js`)
- [ ] Step comments label each logical block
- [ ] `test.describe` wraps all tests
- [ ] Assertions use `toBeVisible()`, `toContainText()`, `toHaveURL()` patterns

---

## EXAMPLE: Generate a new Page Object

**Input:** "Create a Page Object for the educator Portfolio page at `/ng/#/teacher/{userId}/portfolio`"

**Expected output structure:**

```js
import { stablePage } from '../../Utility/stablePage.js';

export class PortfolioPage {
  constructor(page) { this.page = page; }

  // ── Locators ─────────────────────────────────────────────────────────────
  get portfolioHeading() { return this.page.getByRole('heading', { name: /Portfolio/ }); }
  get editSummaryBtn()   { return this.page.getByRole('button', { name: 'Edit Summary' }); }
  get summaryInput()     { return this.page.getByRole('textbox', { name: 'Summary' }); }
  get saveBtn()          { return this.page.getByRole('button', { name: 'Save' }); }

  // ── Actions ──────────────────────────────────────────────────────────────
  async navigate(userId) {
    await this.page.goto(`https://qa.thrively.com/ng/#/teacher/${userId}/portfolio`, {
      waitUntil: 'domcontentloaded',
    });
    await stablePage(this.page);
  }

  async clickEditSummary() {
    await stablePage(this.page);
    await this.editSummaryBtn.click();
    await stablePage(this.page);
  }

  async updateSummary(text) {
    await this.summaryInput.fill(text);
  }

  async save() {
    await stablePage(this.page);
    await this.saveBtn.click();
    await stablePage(this.page);
  }
}
```

---

## EXAMPLE: Generate a new Test

**Input:** "Write a test that verifies an educator can edit their portfolio summary"

**Expected output structure:**

```js
import { test, expect }   from '../../Fixtures/baseTest.js';
import { PortfolioPage }  from '../../Pages/Educator/PortfolioPage.js';
import { LoginPage }      from '../../Pages/Educator/LoginPage.js';
import { Loginusers }     from '../../test-data/testdata.js';

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

test.describe('Educator Portfolio', () => {

  test('Educator can edit their portfolio summary', async ({ page }) => {
    const user      = Loginusers.educator;
    const portfolio = new PortfolioPage(page);

    // ── Step 1: Login ──────────────────────────────────────────────────
    await loginAsEducator(page);

    // ── Step 2: Navigate to Portfolio ──────────────────────────────────
    await portfolio.navigate(user.userId);
    await expect(portfolio.portfolioHeading).toBeVisible();
    await expect(page).toHaveURL(/\/teacher\/\d+\/portfolio/);

    // ── Step 3: Edit Summary ───────────────────────────────────────────
    await portfolio.clickEditSummary();
    await expect(portfolio.summaryInput).toBeVisible();

    await portfolio.updateSummary('Passionate educator focused on strengths-based learning.');
    await portfolio.save();

    // ── Step 4: Assert Update ──────────────────────────────────────────
    await expect(page.getByText('Passionate educator')).toBeVisible();
  });

});
```

---

*End of Claude prompt. When you paste this into a new conversation, follow it with your specific request.*
