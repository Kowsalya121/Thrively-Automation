import { test, expect } from '../../Fixtures/baseTest.js';
import { Signup }       from '../../Pages/Educator/Signup.js';
import { signupData }   from '../../test-data/testdata.js';

test('Signup Flow Test', async ({ page }) => {
  const signup = new Signup(page);
  const data   = signupData.validUser;

  await signup.goto();
  await signup.clickJoinForFree();

  await expect(page.locator('classroom-registration-modal')).toContainText(
    'Unlock your students' potential',
    { timeout: 30000 }
  );
  await expect(page.getByText('Join 150,000+ teachers who')).toBeVisible({ timeout: 30000 });
  await expect(page.getByRole('button', { name: 'Google' })).toBeVisible({ timeout: 30000 });
  await expect(page.getByRole('button', { name: 'Microsoft' })).toBeVisible({ timeout: 30000 });

  await signup.fillSignupForm(data.email, data.password, data.firstName, data.lastName);
  await signup.selectAge(data.age);
  await signup.submitSignup();

  await expect(
    page.locator('xpath=//div[@class="border-bottom mb20"]//h2')
  ).toContainText('Welcome to Thrively!', { timeout: 30000 });
  await expect(page.getByRole('paragraph')).toContainText(
    'Thank you for signing up with Thrively. To get started, please select your school.',
    { timeout: 30000 }
  );
  await expect(page.getByText('US Schools', { exact: true })).toBeVisible({ timeout: 30000 });
  await expect(page.getByText('Non-US Schools')).toBeVisible({ timeout: 30000 });

  await signup.searchAndSelectSchool(data.schoolSearch, data.schoolOption);
  await expect(page.getByText("Can't find your school or")).toBeVisible({ timeout: 30000 });

  await signup.clickDone();

  await expect(page.locator('#strengthXploCarousel2')).toContainText(
    'Welcome to Thrively',
    { timeout: 30000 }
  );

  await signup.clickNext();

  await expect(page.locator('#strengthXploCarousel2')).toContainText(
    'Personalize Thrively',
    { timeout: 30000 }
  );
  await expect(page.locator('#strengthXploCarousel2')).toContainText(
    'Select your role and interests to personalize your Thrively experience.'
  );

  await signup.selectRole(data.role);
  await expect(page.getByText('Personalize Thrively Select')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('#strengthXploCarousel2')).toContainText('What are your interests?');

  await signup.selectInterest(data.interest);
  await signup.finishPersonalization();

  await expect(page.locator('email-verification')).toContainText('Almost done!',   { timeout: 30000 });
  await expect(page.locator('div').filter({ hasText: /^enter code:$/ })).toBeVisible({ timeout: 30000 });

  await signup.skipVerification();

  const onboardingSteps = [
    'Humanize Learning with Thrively',
    'Unlock Individual Strengths',
    'Instill Hope',
    'Support Well-being',
    'Build Relationships',
    'Develop the Thriving Whole Child',
    'Capture Wholistic Journey of Learners',
  ];

  await expect(signup.getOnboardingModal()).toContainText(onboardingSteps[0], { timeout: 30000 });
  await expect(signup.getCommonCard()).toBeVisible({ timeout: 30000 });

  for (let i = 1; i < onboardingSteps.length; i++) {
    await signup.clickNext();
    if (onboardingSteps[i] === 'Develop the Thriving Whole Child') {
      await expect(signup.getImageContainer()).toBeVisible({ timeout: 30000 });
    } else {
      await expect(signup.getCommonCard()).toBeVisible({ timeout: 30000 });
    }
    await expect(signup.getOnboardingModal()).toContainText(onboardingSteps[i], { timeout: 30000 });
  }

  await signup.goToDashboardClick();

  await expect(page.getByRole('heading', { name: 'My Dashboard' })).toBeVisible({ timeout: 30000 });
  await expect(page.locator('.flex-v-center.backgroundImg').first()).toBeVisible({ timeout: 30000 });

  await page.locator('.sameline.valignmiddle.wh30.fill-gray-light > .sameline').click();
});
