import { test, expect } from '../../Fixtures/baseTest.js';
import { K2Assessment } from '../../Pages/Parent/K2Assessment.js';
import {
  parentLoginUser,
  childData,
  parentQuestions,
  childQuestions
} from '../../test-data/testdata.js';


test('Parent Assessment Full Flow', async ({ page }) => {

  const parent = new K2Assessment(page);
  const data = childData;
  const user = parentLoginUser;

  await parent.goto();
  await parent.clickLogin();
  await parent.login(user);
  await parent.clickAddChild();
  await parent.addChild(data);

  await parent.startPurchaseFlow();

  await parent.applyPromoAndPay(data.promoCode);
 
  await expect(page.locator('purchase-success')).toContainText('You’re All Set!');
  await parent.closemodal();
  await page.waitForURL('**/child/*/profile');
  await parent.startAssessment();
  
  // ✅ Initial assertions
  //await expect(page.locator('img')).toBeVisible();
  //await expect(page.getByRole('heading')).toContainText('Help kowsalya discover their strengths!');
  //await expect(page.getByRole('button', { name: 'Start Now' })).toBeVisible();

  // ✅ Interests flow
  await page.locator('div:nth-child(4) > .check-box-img > .gradientBotToTop').click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('div:nth-child(3) > .check-box-img > .gradientBotToTop').click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('div:nth-child(4) > .check-box-img > .gradientBotToTop').click();
  await page.getByRole('button', { name: "I'm finished" }).click();

  await expect(page.getByText('Start the Strengths Assessment!')).toContainText('Start the Strengths Assessment!');
  await parent.BeginAssessment();

  // ✅ Parent Questions LOOP
  for (const q of parentQuestions) {

    await expect(page.locator('h2')).toContainText(q.question);

    for (const ans of q.answers) {
      if (ans === 'img') {
        await page.locator('h2').locator('img').first().click();
      } else {
        await page.getByText(ans).click();
      }
    }

    await page.getByRole('button', { name: 'Next' }).click();
  }

  await expect(page.locator('h2')).toContainText('Parent Section Completed!');
  await page.getByRole('button', { name: 'Continue' }).click();

  // ✅ Child Questions LOOP
  /*for (const q of childQuestions) {

    
    await expect(page.locator('h2')).toContainText(q.question);

    if (q.type === 'image') {
      await page.getByRole('img').nth(q.index).click();
    } else {
      await page.getByText(q.answer).click();
    }

    await page.getByRole('button', { name: 'Next' }).click();
  }*/
    for (const q of childQuestions) {

      const questionSection = page.locator('h2', { hasText: q.question }).locator('..');
    
      await expect(questionSection.locator('h2')).toContainText(q.question);
    
      if (q.type === 'image') {
        await questionSection.locator('img').nth(q.index).click();
      } else {
        await questionSection.getByRole('button', { name: q.answer }).click();
      }
    
      await page.getByRole('button', { name: 'Next' }).click();
    }

  // ✅ Final assertions
  await expect(page.getByRole('heading')).toContainText("Hooray, you're finished!");
  await page.getByRole('button', { name: 'View Strength Profile' }).click();
  await expect(page.locator('#strengthScore')).toContainText('You Are Highly Flexible With Real Strength');

});
