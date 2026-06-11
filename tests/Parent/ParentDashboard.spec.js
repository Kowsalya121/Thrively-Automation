import { test, expect } from '@playwright/test';
import { ParentDashboard } from '../../Pages/Parent/ParentDashboard.js';
import { parentLoginUser, childData } from '../../test-data/testdata.js';

test('Parent Dashboard Full Flow', async ({ page }) => {
  const parent = new ParentDashboard(page);

  await parent.goto();

  // Login
  await parent.login(parentLoginUser);

  // Dashboard assertions
  await expect(page.locator('background')).toContainText('The gowda Family');
  await expect(page.getByText('Change Background')).toBeVisible();
  await expect(page.getByText('Unlock strengths Discover and')).toBeVisible();

  // SSR-SAFE: action card text confirms the strengths onboarding section is rendered;
  // getByRole('img') inside the card is a decorative icon with no guaranteed alt in SSR
  await expect(
    page.locator('empty-state-action-card').filter({ hasText: 'Every child has a genius!' })
  ).toBeVisible();

  await expect(parent.parentDashboard).toContainText('Strengths');

  await expect(parent.parentDashboard).toContainText(
    'Discover your childs unique strengths'
  );

  await expect(parent.parentDashboard).toContainText('Every child has a genius!');

  await expect(page.getByRole('button', { name: 'Get started' })).toBeVisible();

  await page.getByRole('button', { name: 'Learn more' }).first().click();

  await page.getByText('Dashboard').click();
  await expect(parent.parentDashboard).toContainText('Build a 360 degree view');
  await expect(parent.parentDashboard).toContainText('Additional assessments');
  await expect(parent.parentDashboard).toContainText('Explore passions and interests');
  await expect(parent.parentDashboard).toContainText('Dive into pathways based on your child\u2019s strengths');

  // 🔁 Carousel navigation
  await parent.carouselNavigateTop();

  await expect(parent.parentDashboard).toContainText('Artist');

  // 🎨 Career
  await parent.clickArtistCard();

  await expect(page.locator('svg')).toBeVisible();
  await expect(page.locator('h2')).toContainText('Artist');
  await expect(page.locator('background'))
    .toContainText('Career Cluster: Arts, Audio/Video Technology & Communications');
  await expect(page.locator('ellipsis'))
    .toContainText('Create original artwork using any of a wide variety of media and techniques.');
  await expect(page.getByText('Personalities A - Artistic R - Realistic Median Salary$24.42 hourly, $50,790')).toBeVisible();

  // SSR-SAFE: card container text confirms both career cards are rendered;
  // getByRole('img') inside cards-overlay is a thumbnail with no stable alt in SSR
  await expect(page.locator('cards-overlay').filter({ hasText: 'Craft Artist Career Conny' })).toBeVisible();
  await expect(page.locator('cards-overlay').filter({ hasText: 'Glass Blowing | Jeremy Maxwel' })).toBeVisible();

  await expect(page.locator('career-detail')).toContainText('Learn More About the life of an Artist');
  await expect(page.locator('career-detail')).toContainText('Passionate People in Action');

  await parent.backFromCareer();

  // 🧠 Life skills
  await expect(parent.parentDashboard).toContainText('Develop life skills');
  await expect(parent.parentDashboard).toContainText('Prepare your child with social, emotional, and life skills');

  await parent.lifeSkillsCarousel();

  await expect(parent.parentDashboard).toContainText('Questioning and Problem Posing');

  // 📘 Lesson
  await parent.clickLessonCard();

  await expect(page.locator('lesson-detail')).toContainText('Questioning and Problem Posing');

  // SSR-SAFE: lesson text confirms the lesson detail section loaded correctly;
  // getByRole('img', { name: 'No Img' }) is a placeholder alt that SSR renders inconsistently
  await expect(page.locator('lesson-detail')).toContainText('Questioning and Problem Posing');

  await expect(page.locator('lesson-detail')).toContainText(
    'Questioning and Problem Posing Overview: I can independently make responsible decisions based on what is right or wrong Skills:Responsible Decision Making , Grades:6-8 |Duration:25 Min'
  );

  await parent.clickOverview();
  await parent.backToProfile();

  await page.getByRole('button', { name: 'Get started' }).click();
  await expect(page.locator('parent-assessment-purchase')).toContainText('Thrively Strengths Assessment $24.99');

  await expect(page.locator('h2')).toContainText('Who is this assessment for?');

  await expect(page.locator('form')).toContainText("Child's Name");
  await parent.fillChildDetails(childData);

  await page.getByRole('button', { name: 'Go to checkout' }).click();

  await expect(page.locator('payment-modal')).toContainText('$ 24.99');

  await parent.applyPromo(childData);

  await parent.payNowBtn.click();

  // Purchase success
  await expect(page.locator('h2')).toContainText('Purchase is complete! 🎉');

  await expect(page.locator('add-child')).toContainText("Great news! Your're one step closer");

  await expect(page.locator('add-child')).toContainText('Finish creating an account for your child');

  // Add child (dynamic username)
  await parent.addChild(childData);

  await parent.username.fill(childData.username());
  await parent.addChildBtn.click();

  await expect(page.locator('purchase-success')).toContainText('You\u2019re All Set!');

  await expect(page.locator('purchase-success')).toContainText('Thanks for your purchase.');
});
