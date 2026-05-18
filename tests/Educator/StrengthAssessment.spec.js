/**
 * Test: Strength Assessment Flow — Educator
 *
 * Steps:
 *  1. Navigate to https://qa.thrively.com and log in.
 *  2. Select GECK school on the Choose Account page.
 *  3. Verify the Teacher Dashboard is visible.
 *  4. Navigate to the Profile page via sidebar.
 *  5. Click "Take the Strengths Assessment" and verify the intro page opens.
 *  6. Start the assessment and complete every question using the first option.
 *  7. Submit / finish the assessment.
 *  8. Verify successful submission (finish page, redirect, profile update).
 */

import { test, expect } from '../../Fixtures/baseTest.js';
import { LoginPage }               from '../../Pages/Educator/LoginPage.js';
import { StrengthAssessmentPage }  from '../../Pages/Educator/StrengthAssessmentPage.js';
import { Loginusers }              from '../../test-data/testdata.js';

// ─── Reusable login helper (mirrors the pattern in Login.spec.js) ────────────

async function loginAsEducator(page) {
  const user  = Loginusers.educator;
  const login = new LoginPage(page);

  await login.goto();
  await login.openLogin();
  await login.login(user);

  // Wait for and select school
  await expect(page.getByText('Choose Account')).toBeVisible();
  await login.selectSchool(user.schoolName);

  // Confirm redirect to dashboard
  await page.waitForURL('**/teacher/**/dashboard**');
}

// ─── Tests ───────────────────────────────────────────────────────────────────

test.describe('Strength Assessment Flow', () => {

  test('Educator can complete the Strength Assessment and view their profile', async ({ page }) => {
    const user       = Loginusers.educator;
    const assessment = new StrengthAssessmentPage(page);

    // ── Step 1 & 2: Login and select GECK school ─────────────────────────
    await loginAsEducator(page);

    // ── Step 3: Verify Teacher Dashboard is visible ───────────────────────
    await expect(page.locator('teacher-dashboard')).toBeVisible(
      { timeout: 15000 }
    );
    await expect(page).toHaveURL(/\/teacher\/\d+\/dashboard/);
    await expect(page.locator('.teacher-dashboard-tab')).toBeVisible();

    // ── Step 4: Navigate to Profile page via sidebar menu ─────────────────
    await assessment.navigateToProfile(user.userId);

    // Verify profile page loaded
    await expect(assessment.profileHeading).toBeVisible();
    await expect(page).toHaveURL(/\/teacher\/\d+\/profile/);

    // ── Step 5: Click "Take the Strengths Assessment" ─────────────────────
    await assessment.clickTakeStrengthAssessment();

    // Assert: assessment intro/page opened successfully
    await expect(page).toHaveURL(/\/assessments\/thrively\/intro/);
    await expect(assessment.unlockStrengthsHeading).toBeVisible();
    await expect(assessment.startAssessmentBtn).toBeVisible();

    // ── Step 6: Start and complete the assessment ─────────────────────────
    await assessment.clickStartAssessment();

    // Assert: first question page loaded
    await expect(page).toHaveURL(/\/assessments\/thrively\/q\/0/);
    await expect(assessment.progressHeading).toBeVisible();

    // Answer every question using the first available option
    await assessment.completeAllQuestionsWithFirstOption();

    // ── Step 7 & 8: Finish page assertions ────────────────────────────────

    // Assert: reached the finish/completion page
    await expect(page).toHaveURL(/\/assessments\/thrively\/finish/, { timeout: 15000 });
    await expect(assessment.finishHeading).toBeVisible();
    await expect(
      page.getByText("We're analyzing your responses to uncover your unique strengths")
    ).toBeVisible();
    await expect(assessment.viewStrengthProfileBtn).toBeVisible();

    // ── Redirect + Profile update validation ─────────────────────────────
    await assessment.clickViewStrengthProfile();

    // Assert: redirected back to profile page
    await expect(page).toHaveURL(/\/teacher\/\d+\/profile/, { timeout: 10000 });

    // Assert: Strengths Profile section is now visible (assessment completed)
    await expect(assessment.strengthsProfileHeading).toBeVisible();
    await expect(assessment.profileHeading).toBeVisible();

    // Assert: at least the "Top Strengths" list and description text are rendered,
    // confirming the profile was updated with assessment results
    await expect(page.getByText('Top Strengths:')).toBeVisible();
    await expect(page.locator('teacher-profile')).not.toContainText(
      'Take the Strengths Assessment',
      { timeout: 5000 }
    );
  });

});
