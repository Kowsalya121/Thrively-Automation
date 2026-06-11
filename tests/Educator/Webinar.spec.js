import { test, expect } from '@playwright/test';
import { WebinarPage } from '../../Pages/Educator/WebinarPage.js';
import { webinarUser } from '../../test-data/testdata.js';

test('Webinar Signup Flow', async ({ page }) => {
  const webinar = new WebinarPage(page);

  await webinar.goto();
  await webinar.openWebinar();

  // Modal assertions
  await expect(webinar.signupModal).toContainText('Sign Up to Watch');
  await expect(webinar.signupModal).toContainText(
    'Sign Up to Watch Simply provide a password'
  );

  await webinar.clickSignup();

  await expect(webinar.register).toContainText('Register For Free');
  await expect(page.getByText('Google Microsoft ORSelect')).toBeVisible();

  await expect(webinar.googleBtn).toBeVisible();

  await expect(webinar.microsoftBtn).toBeVisible();

  // Fill form
  await webinar.fillSignup(webinarUser);

  // School selection
  await webinar.selectSchool(webinarUser.schoolSearch);

  await webinar.completeRegistrationFlow(webinarUser);

  // Video section
  await page.goto('https://qa.thrively.com/ng/#/webinars/204');

  await page
    .locator('iframe[title="YouTube video player"]')
    .contentFrame()
    .getByRole('button', { name: 'Play video' })
    .click();

  await expect(page.getByText('Wed, Dec 03, 10:00 AM PT')).toBeVisible();
  await expect(page.locator('webinar-detail')).toContainText('Jasmine cox');

  // SSR-SAFE: "My Dashboard" nav item clicked via its text label instead of a
  // child img element — sidebar icons are decorative and have no reliable alt in SSR
  await page.getByRole('listitem').filter({ hasText: 'My Dashboard' }).click();

  // Onboarding
  await webinar.clickNext();

  await expect(page.locator('#strengthXploCarousel2'))
    .toContainText('Personalize Thrively');

  await page.getByRole('combobox').selectOption(webinarUser.role);

  await page.getByRole('checkbox', { name: webinarUser.interest }).check();

  await page.getByRole('button', { name: 'Finish Personalizing Thrively' }).click();

  // Email verification
  await expect(page.locator('email-verification')).toContainText('Almost done!');
  await expect(page.locator('div').filter({ hasText: /^enter code:$/ })).toBeVisible();

  await page.getByText('Skip Finish').click();
  await page.getByText('Skip').click();

  // Onboarding walkthrough
  for (let i = 0; i < 7; i++) {
    await page.getByRole('button', { name: 'next' }).click();
  }
});
