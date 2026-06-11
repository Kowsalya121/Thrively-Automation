/**
 * Test Suite: Personalities (RIASEC / Thrively Interest Profiler) Assessment Flow — Educator
 *
 * End-to-end test covering:
 *   1.  Navigate to https://qa.thrively.com and click Login
 *   2.  Login with educator credentials
 *   3.  Select GECK school on the Choose Account page
 *   4.  Verify the Teacher Dashboard is visible
 *   5.  Navigate to the Profile page
 *   6.  Click "Reveal Your Personalities" → assert intro page opened
 *   7.  Assert intro page elements (title heading, description, Start button)
 *   8.  Click Start Assessment → assert first question page loaded
 *   9.  Assert question page elements:
 *         - Question heading visibility
 *         - Counter "1/60" (confirms 60-question assessment)
 *         - 5 answer options rendered
 *         - Next button disabled until an option is selected
 *  10.  Complete all 60 questions using rotating 1→2→3 pattern (modulo logic)
 *  11.  Assert the finish/success page (heading, completion paragraph, CTA)
 *  12.  Click "View Results" → assert redirect to profile#riasecScore
 *  13.  Assert Personalities results rendered on profile (profile update validation):
 *         - "Thrively Interest Profile" section heading visible
 *         - "TOP 3 PERSONALITIES" heading visible
 *         - "Reveal Your Personalities" button is GONE (assessment marked complete)
 */

import { test, expect }                from '../../Fixtures/baseTest.js';
import { LoginPage }                   from '../../Pages/Educator/LoginPage.js';
import { PersonalitiesAssessmentPage } from '../../Pages/Educator/PersonalitiesAssessmentPage.js';
import { Loginusers }                  from '../../test-data/testdata.js';

// ─── Shared login helper ──────────────────────────────────────────────────────
// Mirrors the pattern in Login.spec.js / MidasAssessment.spec.js / HabitsOfMind.spec.js

async function loginAsEducator(page) {
  const user  = Loginusers.educator;
  const login = new LoginPage(page);

  await login.goto();
  await login.openLogin();
  await login.login(user);

  // Choose Account screen — select GECK
  await expect(page.getByText('Choose Account')).toBeVisible();
  await login.selectSchool(user.schoolName);

  // Confirm redirect to Teacher Dashboard
  await page.waitForURL('**/teacher/**/dashboard**');
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

test.describe('Personalities (RIASEC) Assessment Flow', () => {

  test(
    'Educator can complete Personalities Assessment with rotating 1-2-3 pattern and view profile results',
    async ({ page }) => {
      const user          = Loginusers.educator;
      const personalities = new PersonalitiesAssessmentPage(page);

      // ── Steps 1–3: Login and select GECK school ───────────────────────
      await loginAsEducator(page);

      // ── Step 4: Verify Teacher Dashboard is visible ───────────────────
      await expect(page.locator('teacher-dashboard')).toBeVisible({ timeout: 15000 });
      await expect(page).toHaveURL(/\/teacher\/\d+\/dashboard/);
      await expect(page.locator('.teacher-dashboard-tab')).toBeVisible();

      // ── Step 5: Navigate to Profile page ─────────────────────────────
      await personalities.navigateToProfile(user.userId);

      // Assert: profile page loaded correctly
      await expect(personalities.profileHeading).toBeVisible();
      await expect(page).toHaveURL(/\/teacher\/\d+\/profile/);

      // Assert: "Reveal Your Personalities" button is present before assessment
      await expect(personalities.revealPersonalitiesBtn).toBeVisible();

      // ── Step 6: Click "Reveal Your Personalities" ─────────────────────
      await personalities.clickRevealYourPersonalities();

      // ── Step 7: Assert intro page opened successfully ─────────────────

      // URL navigated to RIASEC intro
      await expect(page).toHaveURL(/\/assessments\/riasec\/intro/);

      // Assessment title (h2) visibility
      await expect(personalities.introHeading).toBeVisible();

      // Start Assessment button visibility
      await expect(personalities.startAssessmentBtn).toBeVisible();

      // ── Step 8: Start the assessment ─────────────────────────────────
      await personalities.clickStartAssessment();

      // Assert: landed on first question (q/0)
      await expect(page).toHaveURL(/\/assessments\/riasec\/q\/0/);

      // ── Step 9: Assert first question page elements ───────────────────

      // Question text heading visible
      await expect(personalities.questionHeading).toBeVisible();

      // Counter "1/60" confirms this is a 60-question assessment
      await expect(personalities.questionCounter).toHaveText('1/60');

      // All 5 answer options rendered
      // ("Strongly Dislike" / "Dislike" / "Unsure" / "Like" / "Strongly Like")
      await expect(personalities.answerOptions).toHaveCount(5);

      // Next button is disabled until an option is selected
      await expect(personalities.nextBtn).toBeDisabled();

      // ── Step 10: Complete all 60 questions — rotating 1→2→3 pattern ───
      //
      //   Pattern driven by question number from URL:
      //     optionIndex = qNum % 3
      //
      //   qNum=0  → index 0 → "Strongly Dislike"  (Option 1)
      //   qNum=1  → index 1 → "Dislike"            (Option 2)
      //   qNum=2  → index 2 → "Unsure"             (Option 3)
      //   qNum=3  → index 0 → "Strongly Dislike"   (wraps back)
      //   …repeated for all 60 questions.
      //
      //   Uses waitForURL per question instead of polling for reliable navigation.
      await personalities.completeAllQuestionsWithRotatingPattern();

      // ── Step 11: Finish / success page assertions ─────────────────────

      // URL transitioned to finish page
      await expect(page).toHaveURL(/\/assessments\/riasec\/finish/, { timeout: 15000 });

      // Success heading: "Congratulations! You've finished the Thrively Interest Profiler…"
      await expect(personalities.finishHeading).toBeVisible();

      // Completion paragraph: "Your interests can help you find careers…"
      await expect(personalities.finishParagraph).toBeVisible();

      // "View Results" CTA button visible
      await expect(personalities.viewResultsBtn).toBeVisible();

      // ── Step 12: Click "View Results" → redirect validation ───────────
      await personalities.clickViewResults();

      // Redirected to profile with #riasecScore anchor
      await expect(page).toHaveURL(/\/teacher\/\d+\/profile.*riasecScore/, { timeout: 15000 });

      // ── Step 13: Assessment status / profile update validation ─────────

      // User is on the profile page
      await expect(personalities.profileHeading).toBeVisible();

      // "Thrively Interest Profile" section heading is now rendered
      await expect(personalities.interestProfileHeading).toBeVisible();

      // "TOP 3 PERSONALITIES" heading visible — confirms results were persisted
      await expect(personalities.top3PersonalitiesHeading).toBeVisible();

      // "Reveal Your Personalities" button is GONE — assessment marked complete
      await expect(personalities.revealPersonalitiesBtn).not.toBeVisible();
    }
  );

});
