import { test, expect } from '@playwright/test';
import { StudentSignup } from '../../Pages/Student/StudentSignup';
import { studentUser } from '../../test-data/testdata';

test('Student Signup Flow', async ({ page }) => {
  const student = new StudentSignup(page);

  await student.goto();
  await student.openStudentSignup();

  // Signup page assertions
  await expect(student.heading).toContainText('Join Thrively Today');
  await expect(student.registration).toContainText('You are signing up as a student');

  await expect(student.googleBtn).toBeVisible();
  await expect(student.microsoftBtn).toBeVisible();

  await student.clickEmailSignup();

  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();

  // DOB
  await student.fillDOB(studentUser.dob);

  // Form
  await student.fillSignupForm(studentUser);

  await page.locator('.mt20 > div').first().click();

  await student.submitSignup();
  //await student.submitSignup(); // kept as is (original flow)

  // Invite screen
  await expect(page.getByRole('heading')).toContainText('Join The Class');

  await expect(page.getByRole('paragraph')).toContainText(
    'Enter the invite code provided by your teacher'
  );

  await expect(page.locator('img')).toBeVisible();

  await student.enterInviteCode(studentUser.inviteCode);

  await expect(page.locator('a')).toContainText("I don't have the invite code");
  await expect(student.submitBtn).toBeVisible();
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();

  await student.submitInvite();

  // Confirmation
  await expect(page.locator('link-teacher-confirmation'))
    .toContainText('You requested to be linked to:');

  await expect(page.getByRole('button', { name: 'Back' })).toBeVisible();

  await page.getByRole('button', { name: 'Back' }).click();

  // No invite flow
  await page.getByText("I don't have the invite code").click();

  await expect(page.getByRole('paragraph')).toContainText(
    "Let's customize your Thrively experience"
  );

  await expect(page.locator('div:nth-child(3) > .check-box-img > .gradientBotToTop')).toBeVisible();

  await page.locator('div:nth-child(3) > .check-box-img > .gradientBotToTop').click();

  await student.clickNext();

  await expect(page.locator('h1')).toContainText("Let's Dive Deeper:");
  await expect(page.getByRole('paragraph')).toContainText(
    'Pick your interests in each of these categories'
  );
  await page.locator('div:nth-child(4) > .check-box-img > .gradientBotToTop').click();

  await student.clickNext();

  await expect(page.getByText('Your Top 3 Aspirations')).toContainText('Your Top 3 Aspirations');

  await page.locator('div:nth-child(4) > .check-box-img > .gradientBotToTop').click();

  await page.getByRole('button', { name: "I'm finished" }).click();

  // Dashboard
  await expect(page.locator('student-dashboard')).toContainText('My Dashboard');

  await expect(
    page.getByText('Hello kowsalya Edit Preferences ! Link To Teacher !Invite FamilyDigital')
  ).toBeVisible();
});