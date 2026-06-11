/**
 * Test Suite: Habits of Mind (Thomas) Assessment Flow — Educator
 *
 * End-to-end test covering:
 *   1.  Navigate to https://qa.thrively.com and click Login
 *   2.  Login with educator credentials
 *   3.  Select GECK school on the Choose Account page
 *   4.  Verify the Teacher Dashboard is visible
 *   5.  Navigate to the Profile page
 *   6.  Click "Reveal Your Habits of Mind" → assert intro page opened
 *   7.  Assert intro page elements (title, description, Start button)
 *   8.  Click Start Assessment → assert first question page loaded
 *   9.  Assert question page elements (progress bar, section heading,
 *       question text, counter "1/80", 6 answer options, Next disabled)
 *  10.  Complete all 80 questions using rotating 1→2→3 pattern (modulo logic)
 *  11.  Assert the finish/success page (heading, completion paragraph, CTA)
 *  12.  Click "View Results" → assert redirect to profile#thomasScore
 *  13.  Assert Habits of Mind results rendered on profile (profile update validation)
 *       - "Habits of Mind Profile" section heading visible
 *       - "TOP 3 HABITS" heading visible
 *       - "Reveal Your Habits of Mind" button is GONE (assessment marked complete)
 */

import { test, expect }     from '../../Fixtures/baseTest.js';
import { LoginPage }         from '../../Pages/Educator/LoginPage.js';
import { HabitsOfMindPage }  from '../../Pages/Educator/HabitsOfMindPage.js';
import { Loginusers }        from '../../test-data/testdata.js';

// ─── Shared login helper ──────────────────────────────────────────────────────
// Mirrors the pattern in Login.spec.js — reuses LoginPage POM and testdata

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

test.describe('Habits of Mind Assessment Flow', () => {
  test.setTimeout(700000);
  test(
    'Educator can complete Habits of Mind Assessment with rotating 1-2-3 pattern and view profile results',
    async ({ page }) => {
      const user   = Loginusers.educator;
      const habits = new HabitsOfMindPage(page);

      // ── Steps 1–3: Login and select GECK school ───────────────────────
      await loginAsEducator(page);

      // ── Step 4: Verify Teacher Dashboard is visible ───────────────────
      await expect(page.locator('teacher-dashboard')).toBeVisible({ timeout: 15000 });
      await expect(page).toHaveURL(/\/teacher\/\d+\/dashboard/);
      await expect(page.locator('.teacher-dashboard-tab')).toBeVisible();

      // ── Step 5: Navigate to Profile page ─────────────────────────────
      await habits.navigateToProfile(user.userId);

      // Assert: profile page loaded correctly
      await expect(habits.profileHeading).toBeVisible();
      await expect(page).toHaveURL(/\/teacher\/\d+\/profile/);
      await page.mouse.wheel(0, 1500);
      await expect(habits.revealHabitsBtn).toBeVisible({ timeout: 10000 });
      await habits.revealHabitsBtn.scrollIntoViewIfNeeded();

      // Assert: "Reveal Your Habits of Mind" button is present before assessment
      await expect(habits.revealHabitsBtn).toBeVisible();

      // ── Step 6: Click "Reveal Your Habits of Mind" ────────────────────
      await habits.clickRevealHabitsOfMind();

      // ── Step 7: Assert intro page opened successfully ─────────────────

      // URL changed to the Thomas assessment intro
      await expect(page).toHaveURL(/\/assessments\/thomas\/intro/);

      // Assessment title visibility
      await expect(habits.introHeading).toBeVisible();

      // Start button visibility
      await expect(habits.startAssessmentBtn).toBeVisible();

      // ── Step 8: Start the assessment → assert question page ───────────
      await habits.clickStartAssessment();

      // Assert: landed on first question (q/0)
      await expect(page).toHaveURL(/\/assessments\/thomas\/q\/0/);

      // ── Step 9: Assert first question page elements ───────────────────

      // Progress bar component visibility
      await expect(habits.progressBar).toBeVisible();

      // Section heading ("Listening with Understanding and empathy" for Part 1)
      await expect(habits.sectionHeading).toBeVisible();

      // Question text visibility
      await expect(habits.questionHeading).toBeVisible();

      // Progress counter shows "1/80" — confirms 80-question assessment
      await expect(habits.questionCounter).toHaveText('1/80');

      // All 6 answer options rendered
      await expect(habits.answerOptions).toHaveCount(6);

      // Next button is disabled until an option is selected
      await expect(habits.nextBtn).toBeDisabled();

      // ── Step 10: Complete all 80 questions — rotating 1→2→3 pattern ───
      //
      //   The pattern is driven by the question number extracted from the URL:
      //     optionIndex = qNum % 3
      //
      //   qNum=0 → index 0 (Option 1)
      //   qNum=1 → index 1 (Option 2)
      //   qNum=2 → index 2 (Option 3)
      //   qNum=3 → index 0 (Option 1)  ← wraps back
      //   …and so on for all 80 questions.
      //
      //   After q/79 the app shows a brief "Generating results…" screen
      //   then auto-transitions to /assessments/thomas/finish.
      await habits.completeAllQuestionsWithRotatingPattern();

      // ── Step 11: Finish / success page assertions ─────────────────────

      // URL transitioned to the finish page (after auto-generating results)
      await expect(page).toHaveURL(/\/assessments\/thomas\/finish/, { timeout: 30000 });

      // Success message heading
      await expect(habits.finishHeading).toBeVisible();

      // Completion state — encouragement paragraph
      await expect(habits.finishParagraph).toBeVisible();

      // "View Results" CTA is visible
      await expect(habits.viewResultsBtn).toBeVisible();

      // ── Step 12: Click "View Results" → redirect validation ───────────
      await habits.clickViewResults();

      // Redirected to profile with #thomasScore anchor
      await expect(page).toHaveURL(/\/teacher\/\d+\/profile.*thomasScore/, { timeout: 15000 });

      // ── Step 13: Assessment status / profile update validation ─────────

      // User is on the right page
      await expect(habits.profileHeading).toBeVisible();

      // "Habits of Mind Profile" section is now rendered
      await expect(habits.habitsProfileHeading).toBeVisible();

      // "TOP 3 HABITS" results section visible — confirms data was persisted
      await expect(habits.top3HabitsHeading).toBeVisible();

      // "Reveal Your Habits of Mind" button is GONE — assessment marked complete
      await expect(habits.revealHabitsBtn).not.toBeVisible();
    }
  );

});
