import { test, expect } from '@playwright/test';
import { CheckInPage } from '../../Pages/Educator/CheckInPage';
import { checkinData } from '../../test-data/testdata';

test('Hope Check-In Test', async ({ page }) => {

  const checkin = new CheckInPage(page);
  const data = checkinData;

  await checkin.goto();
  await checkin.login(data.login.hopeUser);

  await checkin.openHopeTab();
  await expect(page).toHaveURL(/dashboard\?tab=hope/);

  await expect(checkin.hopeSection).toContainText('Hope is the greatest predictor of academic success');
  //await checkin.clickHopeVideo();
  //wait checkin.closevideo();
  await checkin.clickTakeSurvey();
  await expect(page.locator('hope-assessment')).toContainText('Get your Hope Index');

  //await checkin.playVideo();
  const videoText = await checkin.getVideoTitleText();
  await expect(videoText).toContain('Hope for Staff');

  await checkin.clickStart();

  // Back flow handled separately
  await expect(checkin.question).toContainText(data.hope.questions[0]);
  await checkin.answer(data.hope.answers[0]);

  await expect(checkin.question).toContainText(data.hope.questions[1]);

  await checkin.goBack();
  await expect(checkin.question).toContainText(data.hope.questions[0]);

  await checkin.answer(data.hope.answers[0]);

  await expect(checkin.question).toContainText(data.hope.questions[1]);
  await checkin.answer(data.hope.answers[1]);

  for (let i = 2; i < data.hope.questions.length; i++) {

    await expect(checkin.question).toContainText(data.hope.questions[i]);

    //await checkin.selectAnswer(data.hope.answers[i]);

    if (i === data.hope.questions.length - 1) {
      await checkin.clickFinish();
    } else {
      await checkin.clickNext();
    }
  }

  await expect(checkin.question).toContainText('Thanks for checking in!');

  await checkin.enterReflection(data.hope.reflection);
  await checkin.clickFinish();

  await expect(checkin.hopeAssessment).toContainText('Your Overall Hope Index');

  await checkin.clickDone();
});


test('Wellbeing Check-In Test', async ({ page }) => {

  const checkin = new CheckInPage(page);
  const data = checkinData;
  await checkin.goto();

  // ✅ LOGIN
  await checkin.login(data.login.wellbeingUser);

  // ✅ OPEN WELLBEING TAB
  await page.locator('.flex-v-center.border-bottom.teacher-dashboard-tab > div:nth-child(2)').click();

  await expect(page.locator('#wellbeingSection')).toContainText('What is the Well-being Index?');

  await checkin.page.getByRole('button', { name: 'Begin Check-In' }).click();

  await expect(page.locator('wellbeing')).toContainText('Get your Well-being Index');

  await checkin.playVideo();
  await checkin.clickStart();

  // ✅ LOOP THROUGH QUESTIONS
  for (let i = 0; i < data.wellbeingQuestions.length; i++) {

    await expect(checkin.question).toContainText(data.wellbeingQuestions[i]);
  
    // 🔁 BACK validation
    if (i === 2) {
      await checkin.goBack();
      await expect(checkin.question).toContainText(data.wellbeingQuestions[i - 1]);
  
      await checkin.answer(data.wellbeingAnswers[i - 1]);
  
      await expect(checkin.question).toContainText(data.wellbeingQuestions[i]);
    }
  
    // ✅ ALWAYS answer + next (no finish here)
    await checkin.answer(data.wellbeingAnswers[i]);
  }

  // ✅ FINAL ASSERTIONS
  await expect(page.locator('thrively-step')).toContainText('Thanks for checking in!');

  await checkin.enterReflection('I am doing good today');
  await checkin.clickFinish();

  await expect(page.locator('wellbeing')).toContainText('Your Overall Well-being');

  await expect(page.locator('.emoji').first()).toBeVisible();
  await expect(page.locator('.emoji.wh100.sameline.emoji5')).toBeVisible();
  await expect(page.locator('div:nth-child(3) > .wh120 > .emoji')).toBeVisible();

  await expect(page.locator('wellbeing')).toContainText('Your state of mind and overall mood.');
  await expect(page.locator('wellbeing')).toContainText('How you are getting along with daily activities and experiences.');
  await expect(page.locator('wellbeing')).toContainText('Your overall well-being based on feeling and functioning.');

  await checkin.clickDone();

  await expect(page.getByText('You have medium well-being')).toBeVisible();
});