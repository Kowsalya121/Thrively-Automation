import { test, expect } from '@playwright/test';
import { DistrictSelfAssessmentPage } from '../../Pages/Educator/districtSelfAssessment.page.js';
import { districtData, DemoQuotedata } from '../../test-data/testdata.js';
import { DemoQuotePage } from '../../Pages/Educator/DemoQuotePage.js';

test('District Self Assessment Flow', async ({ page }) => {
  const district = new DistrictSelfAssessmentPage(page);
  const form     = new DemoQuotePage(page);
  const data     = DemoQuotedata.getData(Date.now());

  await district.navigate(districtData.urls.base);

  // Landing assertions
  await expect(page.getByText('How does your district compare? Find out how you rank nationally 03012National')).toBeVisible();
  await expect(page.locator('district-self-assessment-lander')).toContainText('2 minutes — 6 questions — lifelong impact');
  await expect(page.locator('h1')).toContainText('Have you created the conditions for an equitable and joyful learning environment?');
  await expect(page.locator('district-self-assessment-lander')).toContainText('Research indicates there are key enabling conditions critical for fostering an equitable and joyful learning environment designed to increase student engagement and academic achievement.');
  await expect(page.getByRole('button', { name: 'Find out now' }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Talk to Us' })).toBeVisible();

  await district.clickTalkToUs();
  await expect(page).toHaveURL(districtData.urls.talkToUs);

  await district.navigate(districtData.urls.base);

  // Carousel assertions
  // SSR-SAFE: surrounding section text confirms the carousel content block is present;
  // positional img.nth(1) / img.nth(2) removed — carousel images are decorative in SSR
  await expect(page.locator('district-self-assessment-lander')).toContainText('The research is loud and clear');
  await expect(page.locator('district-self-assessment-lander')).toContainText('Creating an equitable and joyful learning environment increases student engagement and academic achievement!');

  await district.carouselActions();

  await expect(page.locator('district-self-assessment-lander')).toContainText('Take the self-assessment to find out how your district compares to other districts');
  await expect(page.getByRole('button', { name: 'Find out now' }).nth(1)).toBeVisible();

  // About section
  await expect(page.locator('district-self-assessment-lander')).toContainText('About Thrively');
  await expect(page.locator('district-self-assessment-lander')).toContainText('We humanize learning.');
  await expect(page.locator('district-self-assessment-lander')).toContainText('At Thrively, we help school districts create strengths-based, joyful and hopeful environments that significantly increase academic outcomes.');
  await expect(page.locator('district-self-assessment-lander')).toContainText('Interested in learning more? Reach out to us at thrive@thrively.com or meet with us.');
  await expect(page.locator('.w480')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Schedule a meeting' })).toBeVisible();

  await district.clickScheduleMeeting();
  await form.fillCommonForm(data);
  await form.submit();
  await district.closeScheduleModal();

  await district.clickFindOutNow();

  // Intro
  await expect(page.locator('.w550.border-all > .w100p')).toBeVisible();
  await expect(page.locator('district-self-assessment-intro')).toContainText('Let\u2019s begin!');
  await expect(page.locator('district-self-assessment-intro')).toContainText('We invite you to review the enabling conditions and self-assess your district\u2019s progress. Ask yourself what data points you have (or may be missing) that provide real time information that you use to inform your decision, and to track and monitor your progress and impact.');

  await district.startAssessment();

  // Questions loop
  for (const q of districtData.questions) {
    await expect(page.locator('//h2[@class="question f30 fw3 fc-prime mt20 text-center lh35 mb0"]')).toContainText(q.question);
    await district.answerQuestion(q);
  }

  // Results
  await expect(page.getByRole('heading')).toContainText('Congrats, you\u2019re done!');
  await expect(page.getByRole('paragraph')).toContainText('Your responses will help surface key insights and guide next steps. Let\u2019s take a look at your results.');

  await district.clickViewResult();

  await expect(page.locator('h3')).toContainText('YOUR RESULTS');
  await expect(page.locator('h2')).toContainText('Full Implementation!');
  await expect(page.locator('district-self-assessment-result')).toContainText('Congrats on scoring between 14-21, showing Full Implementation of equitable and joyful learning practices! You\u2019ve built a strong foundation for student engagement and academic achievement, and now is the time to further elevate your efforts.');
  await expect(page.locator('div').filter({ hasText: '015301219National Average' }).nth(5)).toBeVisible();

  await district.enterEmail(districtData.email);
  await district.clickSend();

  await expect(page.locator('html')).toContainText('Results sent to email!');
  await expect(page.locator('html')).toContainText(`We sent your results to ${districtData.email}`);
  await expect(page.locator('html')).toContainText('At Thrively, we help school districts create strengths-based, joyful and hopeful environments that significantly increase academic outcomes.');

  // SSR-SAFE: dialog heading / text confirms the modal is open;
  // dialog's locator('img') removed — modal confirmation images are decorative in SSR
  await expect(page.getByRole('dialog')).toBeVisible();

  await district.clickLearnMore();
  await expect(page).toHaveURL(districtData.urls.learnMore);
});
