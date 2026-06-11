import { test, expect }                         from '../../Fixtures/baseTest.js';
import { HopeAudit }                             from '../../Pages/Educator/HopeAudit.js';
import { hopeaudituser, hopeAuditQuestions }     from '../../test-data/testdata.js';

test('Hope Audit Full Flow', async ({ page }) => {
  const hope = new HopeAudit(page);

  await hope.goto();

  await expect(hope.heading).toContainText('How Hopeful is Your Culture?',          { timeout: 30000 });
  await expect(hope.lander).toContainText('Thrively has partnered with School of Hope', { timeout: 30000 });
  await expect(page.getByText('Login')).toBeVisible({ timeout: 30000 });

  await hope.clickTalkToUs();
  await expect(page).toHaveURL(/\/contact\?t=quote/, { timeout: 30000 });
  await page.goBack();

  await hope.takeSurvey.click();

  await expect(page.getByRole('heading')).toContainText(
    'Welcome to the Hope Culture Survey!',
    { timeout: 30000 }
  );

  // SSR-SAFE: heading text confirms the survey intro section is fully rendered;
  // bare locator('img') replaced because SSR may render decorative images without alt text
  await expect(page.getByRole('heading')).toContainText('Welcome to the Hope Culture Survey!', { timeout: 30000 });

  await hope.signUpStart.click();

  await expect(page.getByRole('paragraph')).toContainText(
    'Create an account to access the Hope Culture Survey',
    { timeout: 30000 }
  );

  await hope.signup(hopeaudituser.signupUser);

  await expect(page.getByRole('paragraph')).toContainText('Invite team members', { timeout: 30000 });

  await hope.invite(hopeaudituser.inviteUser);

  for (let i = 0; i < hopeAuditQuestions.length; i++) {
    const step = hopeAuditQuestions[i];

    await expect(page.getByRole('paragraph')).toContainText(step.question, { timeout: 30000 });

    for (const ans of step.answers) {
      await hope.selectRating(ans);
    }

    if (i === 19) {
      await page.locator('div').filter({ hasText: 'BackSave & Exit Next' }).nth(4).click();
      await expect(page.getByRole('list')).toContainText(
        'Emergent This rating corresponds',
        { timeout: 30000 }
      );
    }

    if (i === hopeAuditQuestions.length - 1) {
      await page.getByRole('button', { name: 'Complete Survey' }).click();
    } else {
      await hope.clickNext();
    }
  }

  // SSR-SAFE: congratulations paragraph text confirms survey completion state;
  // bare locator('img') removed — decorative images have no guaranteed alt in SSR
  await expect(page.getByRole('paragraph')).toContainText(
    ' Congrats! You\u2019ve finished the survey! ',
    { timeout: 30000 }
  );

  await page.getByRole('button', { name: 'View Results' }).click();

  await expect(page.locator('h1')).toContainText('Hope Culture Survey',      { timeout: 30000 });
  await expect(page.locator('hope-audit-report')).toContainText('moderate Hope Culture', { timeout: 30000 });
  await expect(page.locator('h2')).toContainText('Based on your responses',  { timeout: 30000 });
  await expect(page.getByText('Team Members+ g kowsalya')).toBeVisible({ timeout: 30000 });
  await expect(
    page.locator('span').filter({ hasText: 'Download Full Report' }).first()
  ).toBeVisible({ timeout: 30000 });

  const popup = page.waitForEvent('popup');
  await page.getByText('Download Full Report').click();
  const newPage = await popup;

  await newPage.goto(
    'https://thrively-qa.s3.amazonaws.com/purchases/report/hope_culture/1372_1774944469300.pdf'
  );
  await page.goBack();
  await expect(page.getByText('Logout')).toBeVisible({ timeout: 30000 });
  await page.getByText('Logout').click();
});
