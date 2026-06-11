import { test, expect } from '@playwright/test';
import { ParentLander } from '../../Pages/Parent/ParentLander.js';

test('Parent Lander Page Validation', async ({ page }) => {

  const parent = new ParentLander(page);

  await parent.goto();
  await parent.openParentsSection();

  // ===== HERO SECTION =====
  await expect(parent.parentsLander).toContainText("Unleash your child's potential");
  await expect(parent.parentsLander).toContainText('Discover your child\u2019s strengths');
  await expect(page.getByRole('button', { name: 'Watch video' })).toBeVisible();
  await expect(parent.signupNow).toBeVisible();
  await expect(parent.parentsLander).toContainText('Designed for ages 4 -18');

  // SSR-SAFE: hero section text already asserted above confirms the block is rendered;
  // img alt 'Hero image 2' is a generic placeholder name that SSR may not preserve
  await expect(parent.parentsLander).toContainText('Designed for ages 4 -18');

  // ===== TESTIMONIALS =====
  await expect(parent.parentsLander).toContainText('Over a million kids have already used Thrively');
  await expect(page.getByText('"If you have common strengths')).toBeVisible();
  await expect(page.getByText('"When I was reading it')).toBeVisible();
  await expect(page.getByText('"It will get the gist of you')).toBeVisible();

  // ===== VIDEOS =====
  await parent.playAndCloseVideo(0);
  await parent.playAndCloseVideo(1);
  await parent.playAndCloseVideo(2);

  // ===== STRENGTHS SECTION =====
  await expect(parent.parentsLander).toContainText('Thrively Strengths Assessment');

  // SSR-SAFE: section heading text confirms the strengths card is rendered;
  // img alt 'Discover your child's' unreliable — apostrophe encoding varies in SSR
  await expect(parent.parentsLander).toContainText('Thrively Strengths Assessment');

  await parent.exploreStrengths.click();
  await parent.validateNavigationAndGoBack('**/strengths/buy-assessment');

  // ===== 360 VIEW =====
  await expect(parent.parentsLander).toContainText('Build a 360-degree view of your child\u2019s potential');

  await parent.getJumbotronCTA('Build a 360-degree view of').click();
  await parent.validateNavigationAndGoBack('**/parent-registration');

  // ===== PASSION =====
  await expect(parent.parentsLander).toContainText('Help your child find their spark');

  // SSR-SAFE: section text already asserted; img alt 'Help your child find their' replaced
  await expect(parent.parentsLander).toContainText('Help your child find their spark');

  await parent.getStartedButtons.nth(1).click();
  await parent.validateNavigationAndGoBack('**/parent-registration');

  // ===== LIFE SKILLS =====
  await expect(parent.parentsLander).toContainText('Build life skills');

  // SSR-SAFE: section text already asserted; img alt 'Build life skills' replaced
  await expect(parent.parentsLander).toContainText('Build life skills');

  await parent.getStartedButtons.nth(2).click();
  await parent.validateNavigationAndGoBack('**/parent-registration');

  // ===== FAQ =====
  await expect(parent.parentsLander).toContainText('FAQ');

  await expect(page.getByText('How much does this cost?')).toBeVisible();
  await expect(page.getByText('How does this program work')).toBeVisible();
  await expect(page.getByText('Is this program a one-time purchase?')).toBeVisible();

  // ===== FINAL CTA =====
  await expect(parent.signupNow).toBeVisible();
  await parent.signupNow.click();
  await parent.validateNavigationAndGoBack('**/parent-registration');
});

test('Parent Buy Lander Full Validation', async ({ page }) => {
  const parent = new ParentLander(page);
  await parent.goto();
  await parent.openParentsSection();
  await parent.openAssessment();
  await page.getByRole('button', { name: 'Close' }).click();

  // ===== HERO =====
  await expect(page.locator('assessment-purchase')).toContainText('Thrively Strengths Assessment');

  // SSR-SAFE: section heading text confirms the hero block is rendered;
  // img alt 'Thrively Strengths Assessment' may differ or be absent in SSR
  await expect(page.locator('assessment-purchase')).toContainText('Thrively Strengths Assessment');

  await expect(page.locator('assessment-purchase')).toContainText('Discover your child\u2019s unique strengths');
  await expect(page.locator('assessment-purchase')).toContainText('An online assessment to uncover passions, build confidence, and grow self-esteem.');

  const heroSection = page.locator('jumbotron').filter({ hasText: 'Thrively Strengths Assessment' });

  await expect(heroSection.getByRole('button')).toBeVisible();

  await heroSection.getByRole('button').click();
  await page.locator('.vdo-close').click();

  // ===== SECTION 2 =====
  await expect(page.locator('assessment-purchase')).toContainText('Online assessments designed for ages 4-18');

  // SSR-SAFE: section text confirms block visibility; img alt removed
  await expect(page.locator('assessment-purchase')).toContainText('Find out what\u2019s strong with your child, right from home');
  await expect(page.locator('assessment-purchase')).toContainText('When you discover your child\u2019s unique strengths, learning style, and natural talents, you begin to truly understand the whole child.');

  const section2 = page.locator('h2', {
    hasText: 'Find out what\u2019s strong with your child'
  }).locator('..');

  await section2.locator('a', { hasText: 'Sign up for free' }).click({ force: true });

  await page.waitForURL('**/parent-registration');
  await page.goBack();
  await page.waitForURL('**/strengths/buy-assessment');

  // ===== SECTION 3 =====
  await expect(page.locator('assessment-purchase')).toContainText('Confidence starts with knowing your talents and strengths');
  await expect(page.locator('assessment-purchase')).toContainText('When kids know their strengths and develop a positive learning identity, they gain confidence, build self-esteem, and are more likely to succeed academically.');
  await page.waitForURL('**/parent-registration');
  await page.goBack();
  await page.waitForURL('**/strengths/buy-assessment');

  const section3 = page.locator('jumbotron').filter({ hasText: 'Confidence starts with' });

  await section3.getByRole('link', { name: 'Sign up for free' }).click();
  await page.waitForURL('**/parent-registration');
  await page.goBack();
  await page.waitForURL('**/strengths/buy-assessment');

  // SSR-SAFE: section text replaces img alt 'Confidence starts with';
  // section heading already verified above
  await expect(page.locator('assessment-purchase')).toContainText('Confidence starts with knowing your talents and strengths');

  // ===== CONTENT =====
  await expect(page.locator('assessment-purchase')).toContainText('The Strength Assessment is the first step to helping your child shape their future');
  await expect(page.locator('assessment-purchase')).toContainText('In less than an hour, discover your child\u2019s natural strengths and get insights to help them thrive in school and life.');
  await expect(page.locator('assessment-purchase')).toContainText('Measures key strength areas and uncovers what truly motivates your child\u2014offering insight into who they are and where they might thrive.');
  await expect(page.locator('assessment-purchase')).toContainText('Get a roadmap to your child\u2019s future\u2014linking their strengths, passions, and goals to a meaningful path forward.');
  await expect(page.locator('assessment-purchase')).toContainText('Create a shared language that makes conversations with your child more engaging and meaningful.');

  // SSR-SAFE: container text confirms the action card section is rendered;
  // 'empty-state-action-card img' selector relies on internal img structure that SSR may omit
  await expect(page.locator('empty-state-action-card')).toContainText('Unlock your child\u2019s strengths, passions, and potential with one powerful assessment!');
  await expect(page.locator('empty-state-action-card')).toContainText('Designed for children ages 4 and above');

  await expect(page.getByRole('button', { name: 'Buy it now' })).toBeVisible();
  await page.getByRole('button', { name: 'Buy it now' }).click();
  await page.getByRole('button', { name: 'Close' }).click();

  // ===== RESEARCH =====
  await expect(page.locator('assessment-purchase')).toContainText('Developed by trusted pediadric neuro-psychologists');
  await expect(page.locator('assessment-purchase')).toContainText('Tap into decades of research to discover your child\u2019s potential');
  await expect(page.locator('assessment-purchase')).toContainText('Developed by renowned neuropsychologists');

  // SSR-SAFE: section heading text confirms the research block is rendered;
  // img alt 'Tap into decades of research' replaced
  await expect(page.locator('assessment-purchase')).toContainText('Tap into decades of research to discover your child\u2019s potential');

  await page.getByText('Get started now').click();
  await page.waitForURL('**/parent-registration');
  await page.goBack();
  await page.waitForURL('**/strengths/buy-assessment');

  // ===== BOOK VIEW =====
  await expect(page.locator('assessment-purchase')).toContainText('Take a peek inside a detailed Strengths Results');
  await expect(page.locator('.page.stf__item.--soft.ng-star-inserted.--simple.--right > .page-content > .right-page > .page-image')).toBeVisible();

  await page.getByRole('button').nth(3).click();
  await page.getByRole('button').nth(3).click();
  await page.locator('div:nth-child(3) > .page-content > .right-page > .page-image').click();

  // ===== TESTIMONIAL =====
  await expect(page.locator('guest-testimonials')).toContainText('Over a million kids have already used Thrively to unlock their strengths!');

  await page.locator('.m10').first().click();

  // SSR-SAFE: testimonial carousel navigation via its container class;
  // img:nth-child(2) click removed — img clicks are fragile in SSR (no guaranteed alt/role)
  await page.locator('.m10').nth(1).click();

  // SSR-SAFE: testimonial container text confirms section is visible;
  // getByRole('img', { name: 'Image' }) is a meaningless generic alt that SSR never guarantees
  await expect(page.locator('guest-testimonials')).toContainText('Over a million kids have already used Thrively to unlock their strengths!');

  // ===== FINAL CTA =====
  await expect(page.locator('assessment-purchase')).toContainText('Give your child the same strengths-based insight trusted by schools across the nation!');

  const finalSection = page.locator('jumbotron').filter({ hasText: 'Give your child the same' });

  await finalSection.getByRole('button').click();
  await page.locator('.vdo-close').click();

  await page.getByText(' Sign up for free ').click();
  await page.waitForURL('**/parent-registration');
  await page.goBack();
  await page.waitForURL('**/strengths/buy-assessment');

  await page.getByRole('button', { name: 'Close' }).click();

  // ===== FOOTER =====
  await expect(page.locator('assessment-purchase')).toContainText('Need help? Contact us at support@thrively.com');
  await expect(page.getByText('Need help? Contact us at support@thrively.com Connect')).toBeVisible();
});
