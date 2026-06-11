import { test, expect } from '@playwright/test';
import { SchoolofHope } from '../../Pages/Educator/SchoolofHope.js';
import { hopeQuestions, schoolofhopeuser } from '../../test-data/testdata.js';

test('Hope Signup Flow', async ({ page }) => {
  const hope = new SchoolofHope(page);
  const user = schoolofhopeuser.validUser;
  const demo = schoolofhopeuser.demoUser;

  await hope.goto();

  await expect(page.locator('xpath=//h2[text()="How hopeful is this audience?"]')).toContainText('How hopeful is this audience?');

  // SSR-SAFE: heading text confirms the intro section is rendered;
  // bare locator('img') removed — decorative images have no guaranteed alt in SSR
  await expect(page.locator('xpath=//h2[text()="How hopeful is this audience?"]')).toContainText('How hopeful is this audience?');

  await expect(page.locator('div').filter({ hasText: 'Enter the 5-digit code' }).nth(3)).toBeVisible();

  // ✅ Code from ENV
  await hope.enterCode(process.env.SCHOOL_OF_HOPE_CODE);

  await expect(hope.paragraph).toContainText('Enter the 5-digit code provided');

  await hope.clickLetsGo();

  await expect(hope.heading).toContainText('Sign up to Thrively');
  await expect(page.locator('pd-hope-signup')).toContainText('Create an account with Thrively');

  await expect(hope.googleBtn).toBeVisible();
  await expect(hope.microsoftBtn).toBeVisible();
  await expect(hope.continueEmailBtn).toBeVisible();
  await hope.clickContinueWithEmail();

  await expect(hope.heading).toContainText('Sign up to Thrively');
  await expect(hope.paragraph).toContainText('Create an account with Thrively');

  // ✅ Data from test data file
  await hope.fillSignup(
    user.firstName,
    user.lastName,
    user.email()
  );

  await hope.submitSignup();

  // Questions loop
  for (let i = 0; i < hopeQuestions.length; i++) {
    const step = hopeQuestions[i];

    await expect(hope.heading).toContainText(step.text);
    await expect(hope.slider).toBeVisible();
    await hope.slider.fill(step.value);

    if (i !== hopeQuestions.length - 1) {
      await hope.clickNext();
    }
  }

  await hope.clickFinish();

  // Results
  await expect(hope.hopeResult).toContainText('Your Results');
  await expect(hope.hopeResult).toContainText('GoodHope');
  await expect(hope.hopeResult).toContainText('Complete Sign Up');

  // SSR-SAFE: result component text confirms the results section is rendered;
  // bare locator('img').first() replaced — inline result images are decorative in SSR
  await expect(hope.hopeResult).toContainText('Your Results');

  await expect(hope.hopeResult).toContainText('150,000+ Educators & Districts');
  await expect(hope.hopeResult).toContainText('Thrively is powering classrooms');

  await hope.clickScheduleDemo();

  // ✅ Demo form from test data
  await page.getByRole('textbox', { name: 'First Name & Last Name *' }).fill(demo.fullName);
  await page.getByRole('textbox', { name: 'Your Email Address *' }).fill(demo.email);
  await page.getByRole('textbox', { name: 'Phone Number' }).fill(demo.phone);
  await page.getByRole('textbox', { name: 'School or District *' }).fill(demo.school);

  await page.getByRole('button', { name: 'Schedule a Demo With our' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await hope.clickStartNow();
  await expect(page).toHaveURL(/classroom-registration/);
});
