import { test, expect } from '../../Fixtures/baseTest.js';
import { CheckInPage }  from '../../Pages/Educator/CheckInPage.js';
import { checkinData }  from '../../test-data/testdata.js';

test('Hope Check-In Test', async ({ page }) => {
  const checkin = new CheckInPage(page);
  const data    = checkinData;

  await checkin.goto();
  await checkin.login(data.login.hopeUser);

  await checkin.openHopeTab();
  await expect(page).toHaveURL(/dashboard\?tab=hope/);

  await expect(checkin.hopeSection).toContainText(
    'Hope is the greatest predictor of academic success',
    { timeout: 30000 }
  );

  await checkin.clickTakeSurvey();
  await expect(page.locator('hope-assessment')).toContainText(
    'Get your Hope Index',
    { timeout: 30000 }
  );

  const videoText = await checkin.getVideoTitleText();
  await expect(videoText).toContain('Hope for Staff');

  await checkin.clickStart();

  // Back-flow validation
  await expect(checkin.question).toContainText(data.hope.questions[0], { timeout: 30000 });
  await checkin.answer(data.hope.answers[0]);

  await expect(checkin.question).toContainText(data.hope.questions[1], { timeout: 30000 });

  await checkin.goBack();
  await expect(checkin.question).toContainText(data.hope.questions[0], { timeout: 30000 });

  await checkin.answer(data.hope.answers[0]);

  await expect(checkin.question).toContainText(data.hope.questions[1], { timeout: 30000 });
  await checkin.answer(data.hope.answers[1]);

  for (let i = 2; i < data.hope.questions.length; i++) {
    await expect(checkin.question).toContainText(data.hope.questions[i], { timeout: 30000 });

    if (i === data.hope.questions.length - 1) {
      await checkin.clickFinish();
    } else {
      await checkin.nextBtn.click();
    }
  }

  await expect(checkin.question).toContainText('Thanks for checking in!', { timeout: 30000 });

  await checkin.enterReflection(data.hope.reflection);
  await checkin.clickFinish();

  await expect(checkin.hopeAssessment).toContainText('Your Overall Hope Index', { timeout: 30000 });

  await checkin.clickDone();
});


test('Wellbeing Check-In Test', async ({ page }) => {
  const checkin = new CheckInPage(page);
  const data    = checkinData;

  await checkin.goto();
  await checkin.login(data.login.wellbeingUser);

  // Open Wellbeing tab
  await page
    .locator('.flex-v-center.border-bottom.teacher-dashboard-tab > div:nth-child(2)')
    .click();

  await expect(page.locator('#wellbeingSection')).toContainText(
    'What is the Well-being Index?',
    { timeout: 30000 }
  );

  await checkin.page.getByRole('button', { name: 'Begin Check-In' }).click();

  await expect(page.locator('wellbeing')).toContainText(
    'Get your Well-being Index',
    { timeout: 30000 }
  );

  await checkin.playVideo();
  await checkin.clickStart();

  for (let i = 0; i < data.wellbeingQuestions.length; i++) {
    await expect(checkin.question).toContainText(data.wellbeingQuestions[i], { timeout: 30000 });

    if (i === 2) {
      await checkin.goBack();
      await expect(checkin.question).toContainText(
        data.wellbeingQuestions[i - 1],
        { timeout: 30000 }
      );
      await checkin.answer(data.wellbeingAnswers[i - 1]);
      await expect(checkin.question).toContainText(data.wellbeingQuestions[i], { timeout: 30000 });
    }

    await checkin.answer(data.wellbeingAnswers[i]);
  }

  await expect(page.locator('thrively-step')).toContainText(
    'Thanks for checking in!',
    { timeout: 30000 }
  );

  await checkin.enterReflection('I am doing good today');
  await checkin.clickFinish();

  await expect(page.locator('wellbeing')).toContainText('Your Overall Well-being', { timeout: 30000 });

  await expect(page.locator('.emoji').first()).toBeVisible({ timeout: 30000 });
  await expect(page.locator('.emoji.wh100.sameline.emoji5')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('div:nth-child(3) > .wh120 > .emoji')).toBeVisible({ timeout: 30000 });

  await expect(page.locator('wellbeing')).toContainText('Your state of mind and overall mood.');
  await expect(page.locator('wellbeing')).toContainText(
    'How you are getting along with daily activities and experiences.'
  );
  await expect(page.locator('wellbeing')).toContainText(
    'Your overall well-being based on feeling and functioning.'
  );

  await checkin.clickDone();

  await expect(page.getByText('You have medium well-being')).toBeVisible({ timeout: 30000 });
});
