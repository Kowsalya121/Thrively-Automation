import { test, expect } from '@playwright/test';
import { HopeAudit } from '../Pages/HopeAudit';
import { hopeaudituser, hopeAuditQuestions } from '../../test-data/testdata';

test('Hope Audit Full Flow', async ({ page }) => {
  const hope = new HopeAudit(page);

  await hope.goto();

  await expect(hope.heading).toContainText('How Hopeful is Your Culture?');
  await expect(hope.lander).toContainText('Thrively has partnered with School of Hope');

  await expect(page.getByText('Login')).toBeVisible();

  await hope.clickTalkToUs();
  await expect(page).toHaveURL(/\/contact\?t=quote/);
  await page.goBack();

  await hope.takeSurvey.click();

  await expect(page.getByRole('heading')).toContainText('Welcome to the Hope Culture Survey!');
  await expect(page.locator('img')).toBeVisible();

  await hope.signUpStart.click();

  await expect(page.getByRole('paragraph'))
    .toContainText('Create an account to access the Hope Culture Survey');

  // Signup
  await hope.signup(hopeaudituser.signupUser);

  await expect(page.getByRole('paragraph'))
    .toContainText('Invite team members');

  await hope.invite(hopeaudituser.inviteUser);

  // ✅ Dynamic Questions Loop
  for (let i = 0; i < hopeAuditQuestions.length; i++) {
    const step = hopeAuditQuestions[i];

    // Assertion from test file
    await expect(page.getByRole('paragraph')).toContainText(step.question);

    // Multiple answers if needed
    for (const ans of step.answers) {
      await hope.selectRating(ans);
    }

    // Special case handling
    if (i === 19) {
      await page.locator('div').filter({ hasText: 'BackSave & Exit Next' }).nth(4).click();
      await expect(page.getByRole('list')).toContainText('Emergent This rating corresponds');
    }

    // Last step → complete survey
    if (i === hopeAuditQuestions.length - 1) {
      await page.getByRole('button', { name: 'Complete Survey' }).click();
    } else {
      await hope.clickNext();
    }
  }

  // Results
  await expect(page.locator('img')).toBeVisible();
  await expect(page.getByRole('paragraph')).toContainText('Congrats! You’ve finished the survey!');

  await page.getByRole('button', { name: 'View Results' }).click();

  await expect(page.locator('h1')).toContainText('Hope Culture Survey');
  await expect(page.locator('hope-audit-report')).toContainText('moderate Hope Culture');

  await expect(page.locator('h2')).toContainText('Based on your responses');

  await expect(page.getByText('Team Members+ g kowsalya')).toBeVisible();

  await expect(page.locator('span').filter({ hasText: 'Download Full Report' }).first()).toBeVisible();

  const popup = page.waitForEvent('popup');
  await page.getByText('Download Full Report').click();
  const newPage = await popup;

  await newPage.goto('https://thrively-qa.s3.amazonaws.com/purchases/report/hope_culture/1372_1774944469300.pdf');
  await page.goBack();
  await expect(page.getByText('Logout')).toBeVisible();
  await page.getByText('Logout').click();
});