/**
 * Test Suite: MIDAS Assessment Flow — Educator
 *
 * End-to-end test covering:
 *   1. Login with educator credentials
 *   2. School selection (GECK)
 *   3. Teacher Dashboard assertion
 *   4. Navigate to Profile page
 *   5. Open MIDAS Assessment → assert intro page elements
 *   6. Start assessment → assert first question page loaded
 *   7. Complete all questions using a rotating 1→2→3→1→2→3 option pattern
 *   8. Assert finish page (success heading, completion message, CTA button)
 *   9. Click "View Results" → assert redirect to profile
 *  10. Assert MIDAS results section rendered on profile (profile update validation)
 */

import { test, expect } from '../../Fixtures/baseTest.js';
import { LoginPage }           from '../../Pages/Educator/LoginPage.js';
import { MidasAssessmentPage } from '../../Pages/Educator/MidasAssessmentPage.js';
import { Loginusers }          from '../../test-data/testdata.js';

// ─── Shared login helper ─────────────────────────────────────────────────────
// Mirrors the pattern used in Login.spec.js — reuses LoginPage POM and testdata

async function loginAsEducator(page) {
  const user  = Loginusers.educator;
  const login = new LoginPage(page);

  await login.goto();
  await login.openLogin();
  await login.login(user);

  // Choose Account screen — select GECK
  await expect(page.getByText('Choose Account')).toBeVisible();
  await login.selectSchool(user.schoolName);

  // Wait until the dashboard URL is confirmed
  await page.waitForURL('**/teacher/**/dashboard**');
}

// ─── Test Suite ──────────────────────────────────────────────────────────────

test.describe('MIDAS Assessment Flow', () => {

  test(
    'Educator can complete MIDAS Assessment with rotating 1-2-3 pattern and view profile results',
    async ({ page }) => {
      const user  = Loginusers.educator;
      const midas = new MidasAssessmentPage(page);

      // ── Step 1 & 2: Login → select GECK school ─────────────────────────
      await loginAsEducator(page);

      // ── Step 3: Verify Teacher Dashboard ───────────────────────────────
      await expect(page.locator('teacher-dashboard')).toBeVisible({ timeout: 15000 });
      await expect(page).toHaveURL(/\/teacher\/\d+\/dashboard/);
      await expect(page.locator('.teacher-dashboard-tab')).toBeVisible();

      // ── Step 4: Navigate to Profile page ───────────────────────────────
      await midas.navigateToProfile(user.userId);

      // Assert profile page loaded
      await expect(midas.profileHeading).toBeVisible();
      await expect(page).toHaveURL(/\/teacher\/\d+\/profile/);

      // ── Step 5: Click "Take the MIDAS Assessment" ───────────────────────
      await midas.clickTakeMidasAssessment();

      // ── Assert: MIDAS intro page opened successfully ────────────────────
      await expect(page).toHaveURL(/\/assessments\/midas\/intro/);

      // Assessment title visibility
      await expect(midas.introHeading).toBeVisible();

      // Start button visibility
      await expect(midas.startAssessmentBtn).toBeVisible();

      // ── Step 6: Start the assessment → verify question page ─────────────
      await midas.clickStartAssessment();

      // Assert: landed on first question (q/0)
      await expect(page).toHaveURL(/\/assessments\/midas\/q\/0/);

      // Question container visibility (h2 with the question text)
      await expect(midas.questionHeading).toBeVisible();

      // Progress indicator visibility (8-section tab bar)
      await expect(midas.progressBar).toBeVisible();

      // Confirm 6 answer options are rendered
      await expect(midas.answerOptions).toHaveCount(6);

      // Next button is initially disabled (no option selected yet)
      await expect(midas.nextBtn).toBeDisabled();

      // ── Step 7: Complete all questions using rotating 1→2→3 pattern ─────
      // Pattern:  Q1→opt[0]  Q2→opt[1]  Q3→opt[2]  Q4→opt[0]  Q5→opt[1] …
      // Implemented via:  optionIndex = questionCounter % 3
      await midas.completeAllQuestionsWithRotatingPattern(0);

      // ── Step 8: Finish / Success page assertions ─────────────────────────

      // Success message (heading) visibility
      await expect(page).toHaveURL(/\/assessments\/midas\/finish/, { timeout: 20000 });
      await expect(midas.finishHeading).toBeVisible();

      // Completion state — supportive message paragraph
      await expect(midas.finishParagraph).toBeVisible();

      // "View Results" CTA button visible
      await expect(midas.viewResultsBtn).toBeVisible();

      // ── Step 9: Click "View Results" → redirect validation ───────────────
      await midas.clickViewResults();

      // Redirect to profile with #midasScore anchor
      await expect(page).toHaveURL(/\/teacher\/\d+\/profile.*midasScore/, { timeout: 10000 });

      // ── Step 10: Assessment status / profile update validation ────────────

      // Profile heading still present (user is on the right page)
      await expect(midas.profileHeading).toBeVisible();

      // "MIDAS Aptitude Profile" section is now rendered
      await expect(midas.midasProfileHeading).toBeVisible();

      // "Top 3 Smarts" results section is visible — confirms data was persisted
      await expect(midas.top3SmartsHeading).toBeVisible();

      // "Take the MIDAS Assessment" button is GONE — assessment is marked complete
      await expect(midas.takeMidasAssessBtn).not.toBeVisible();
    }
  );

});
