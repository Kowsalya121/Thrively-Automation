
import { test, expect } from '@playwright/test';
import { Signup } from '../Pages/Signup';
import { signupData } from '../../test-data/testdata';

test('Signup Flow Test', async ({ page }) => {
  const signup = new Signup(page);
  const data = signupData.validUser;

  await signup.goto();
  await signup.clickJoinForFree();

  // Modal assertions
  await expect(page.locator('classroom-registration-modal')).toContainText('Unlock your students’ potential');
  await expect(page.getByText('Join 150,000+ teachers who')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Google' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Microsoft' })).toBeVisible();

  // Form fill
  await signup.fillSignupForm(
    data.email,
    data.password,
    data.firstName,
    data.lastName
  );

  await signup.selectAge(data.age);
  await signup.submitSignup();

  // Welcome screen
  await expect(page.locator('xpath=//div[@class="border-bottom mb20"]//h2')).toContainText('Welcome to Thrively!');
  await expect(page.getByRole('paragraph')).toContainText('Thank you for signing up with Thrively. To get started, please select your school.');
  await expect(page.getByText('US Schools', { exact: true })).toBeVisible();
  await expect(page.getByText('Non-US Schools')).toBeVisible();

  // School selection
  await signup.searchAndSelectSchool(
    data.schoolSearch,
    data.schoolOption
  );

  await expect(page.getByText("Can't find your school or")).toBeVisible();

  await signup.clickDone();

  // Carousel - Welcome
  await expect(page.locator('#strengthXploCarousel2'))
    .toContainText('Welcome to Thrively');

  await signup.clickNext();

  // Carousel - Personalize
  await expect(page.locator('#strengthXploCarousel2')).toContainText('Personalize Thrively');
  await expect(page.locator('#strengthXploCarousel2')).toContainText('Select your role and interests to personalize your Thrively experience.');

  await signup.selectRole(data.role);

  await expect(page.getByText('Personalize Thrively Select')).toBeVisible();
  await expect(page.locator('#strengthXploCarousel2')).toContainText('What are your interests?');

  await signup.selectInterest(data.interest);
  await signup.finishPersonalization();

  // Email verification
  await expect(page.locator('email-verification')).toContainText('Almost done!');
  await expect(page.locator('div').filter({ hasText: /^enter code:$/ })).toBeVisible();

  await signup.skipVerification();

  // Onboarding screens
  // Onboarding data
const onboardingSteps = [
  'Humanize Learning with Thrively',
  'Unlock Individual Strengths',
  'Instill Hope',
  'Support Well-being',
  'Build Relationships',
  'Develop the Thriving Whole Child',
  'Capture Wholistic Journey of Learners'
];

// First screen (before clicking next)
await expect(signup.getOnboardingModal()).toContainText(onboardingSteps[0]);

await expect(signup.getCommonCard()).toBeVisible();

// Loop through remaining steps
for (let i = 1; i < onboardingSteps.length; i++) {
  await signup.clickNext();

  if (onboardingSteps[i] === 'Develop the Thriving Whole Child') {
    await expect(signup.getImageContainer()).toBeVisible();
  } else {
    await expect(signup.getCommonCard()).toBeVisible();
  }

  await expect(signup.getOnboardingModal())
    .toContainText(onboardingSteps[i]);
}

  await signup.goToDashboardClick();

  // Dashboard
  await expect(page.getByRole('heading', { name: 'My Dashboard' })).toBeVisible();
  await expect(page.locator('.flex-v-center.backgroundImg').first()).toBeVisible();

  // Final click
  await page.locator('.sameline.valignmiddle.wh30.fill-gray-light > .sameline').click();
});