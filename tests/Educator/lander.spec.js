
import { test, expect } from '@playwright/test';
import { Landerpages } from '../../Pages/Educator/Landerpages';
import { landerData } from '../../test-data/testdata';

test.describe('Full Lander Pages Validation', () => {

  // =======================
  // ✅ STRENGTHS PAGE
  // =======================
  test('Strengths Page Full Validation', async ({ page }) => {
    const lander = new Landerpages(page);

    await lander.navigate(landerData.strengths);

    await expect(lander.strengths).toContainText('Develop the Thriving Whole Child');
    await expect(page.getByRole('img', { name: 'Develop the Thriving Whole' })).toBeVisible();

    await expect(lander.strengths).toContainText('Support the growth of every student');

    await lander.clickText('Join Thrively Now');
    await lander.closeModal();

    await expect(lander.strengths).toContainText('Discover strengths');
    await expect(page.getByRole('img', { name: 'Discover strengths' })).toBeVisible();

    await lander.clickText('Learn Strengths');
    //await lander.clickText('Learn Strengths');
    await page.goBack();

    await expect(page.getByRole('img', { name: 'Gain insights into learning' })).toBeVisible();

    await expect(lander.strengths).toContainText('Identify and understand');

    await lander.clickText('Learn MIDAS');
    await page.goBack();

    await expect(lander.strengths).toContainText('Understand habits');
    await expect(page.getByRole('img', { name: 'Understand habits' })).toBeVisible();

    await lander.clickText('Learn Habits of Mind');
    await page.goBack();

    await expect(lander.strengths).toContainText('Identify career pathways');
    await expect(page.getByRole('img', { name: 'Identify career pathways' })).toBeVisible();

    await lander.clickText('Learn Interest Profiler');
    await page.goBack();

    await expect(page.locator('schools-and-districts')).toContainText('150,000+ Educators & Districts');

    await expect(page.getByRole('list').filter({ hasText: /^$/ })).toBeVisible();

    await lander.navigate(landerData.strengths);
    await page.reload();
    await page.reload({ waitUntil: 'load' });
    await expect(page.locator('learning-community-banner')).toContainText('Build a Thriving Learning Community');

    await lander.clickRole('link', 'Schedule a Call Today');
    await expect(page).toHaveURL('https://qa.thrively.com/ng/#/contact?t=demo');
  });

  // =======================
  // ✅ WELLBEING PAGE
  // =======================
  test('Wellbeing Page Full Validation', async ({ page }) => {
    const lander = new Landerpages(page);

    await lander.navigate(landerData.wellbeing);

    await expect(lander.wellbeing).toContainText('How are your learners feeling today?');
    await expect(lander.wellbeing).toContainText('Find out in 60 seconds');

    await expect(page.getByRole('img', { name: 'How are your learners feeling' })).toBeVisible();

    await lander.clickText('Take a Pulse Check');
    await lander.closeModal();

    await expect(lander.wellbeing).toContainText('Use science to your advantage');

    await expect(page.getByRole('img').nth(3)).toBeVisible();

    await expect(lander.wellbeing).toContainText('Be the teacher you loved growing up');

    await page.locator('.avt-60').click();
    await page.locator('//span[@class="vdo-close blk ng-star-inserted"]').click();

    await lander.clickText('Be That Teacher');
    await lander.closeModal();

    await expect(lander.wellbeing).toContainText('Change learners’ lives');

    await expect(lander.wellbeing).toContainText('Testimonials from Educators');

    await expect(page.getByRole('img', { name: 'Data that tells a meaningful' })).toBeVisible();

    await lander.clickText('Start Your Well-Being Story');
    await lander.closeModal();

    await expect(page.locator('schools-and-districts')).toContainText('150,000+ Educators & Districts');

    await expect(page.getByRole('list').filter({ hasText: /^$/ })).toBeVisible();
    await expect(page.locator('learning-community-banner')).toContainText('Build a Thriving Learning Community');

    await lander.clickRole('link', 'Schedule a Call Today');
    await expect(page).toHaveURL('https://qa.thrively.com/ng/#/contact?t=demo');
    await page.goBack();
    await lander.navigate(landerData.wellbeing);
    await page.reload();
    await page.reload({ waitUntil: 'load' });
    await expect(page.locator('school-map')).toContainText('Join More Than 150,000 Teachers');

    await lander.clickText('Join Thrively for Free!');
    await lander.closeModal();
  });

  // =======================
  // ✅ HOPE PAGE
  // =======================
  test('Hope Page Full Validation', async ({ page }) => {
    const lander = new Landerpages(page);

    await lander.navigate(landerData.hope);

    await expect(lander.hope).toContainText('How hopeful are you and your students?');

    await expect(page.getByRole('img', { name: 'How hopeful are you and your' })).toBeVisible();

    await lander.clickText('Access the Hope Index');
    await lander.closeModal();

    await expect(lander.hope).toContainText('Hope leads to powerful learning outcomes');

    await page.locator('.avt-60').click();
    await page.getByRole('dialog').locator('span').click();

    await expect(lander.hope).toContainText('Instill hope through evidence-based lessons');

    await expect(page.locator('.carousel-container')).toBeVisible();

    await page.locator('.slide-nav.nav-right').click();
    await page.locator('.slideBtn').first().click();

    await expect(page.locator('schools-and-districts')).toContainText('150,000+ Educators & Districts');

    await expect(page.locator('school-map')).toContainText('Join More Than 150,000 Teachers');

    await lander.clickText('Join Thrively for Free!');
    await lander.closeModal();
  });

  // =======================
  // ✅ AGENCY PAGE
  // =======================
  test('Agency Page Full Validation', async ({ page }) => {
    const lander = new Landerpages(page);

    await lander.navigate(landerData.agency);

    await expect(lander.agency).toContainText('Building Student Agency');

    await expect(page.getByRole('img', { name: 'Building Student Agency' })).toBeVisible();

    await lander.clickText('Join Thrively Now');
    await lander.closeModal();

    await expect(lander.agency).toContainText('Develop students skills for success');

    await expect(lander.agency).toContainText('Assets');
    await expect(lander.agency).toContainText('Goals');
    await expect(lander.agency).toContainText('Experiences');
    await expect(lander.agency).toContainText('Badges');

    await expect(page.getByRole('img', { name: 'Goals' })).toBeVisible();

    await expect(page.locator('schools-and-districts')).toContainText('150,000+ Educators & Districts');

    await expect(page.locator('learning-community-banner')).toContainText('Build a Thriving Learning Community');

    await lander.clickRole('link', 'Schedule a Call Today');
  });

  // =======================
  // ✅ PRICING PAGE
  // =======================
  test('Pricing Page Full Validation', async ({ page }) => {
    const lander = new Landerpages(page);

    await lander.navigate(landerData.pricing);
    await page.getByRole('img', { name: 'Flexible plan to meet your' }).click();
    await expect(lander.pricing).toContainText('Flexible plan to meet your district');

    await expect(page.locator('pricing')).toContainText('Flexible plan to meet your district\'s needs');
    await expect(page.locator('pricing')).toContainText('We strengthen your existing systems and help create an equitable and joyful learning environment');
    await expect(page.locator('pricing')).toContainText('Thrively Pro');
    await expect(page.locator('pricing')).toContainText('Transform how your teachers engage with every student');
  
   //await expect(page.getByRole('button', { name: 'Schedule a Demo' }).nth(1)).toBeVisible();
    //await expect(page.locator('pricing').getByRole('button', { name: 'Request a Quote' })).toBeVisible();
  
    await expect(page.locator('pricing')).toContainText('Thrively Pro Includes:');
    await expect(page.locator('pricing')).toContainText('Whole Child Assessments');
  
    await expect(page.getByRole('listitem').filter({ hasText: /^Strengths$/ })).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: /^RIASEC$/ })).toBeVisible();
    await expect(page.getByText('Wellbeing')).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: /^Wellbeing$/ })).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: /^MIDAS$/ })).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: /^Habits of Mind$/ })).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: /^Hope Index$/ })).toBeVisible();
  
    await expect(page.locator('pricing')).toContainText('Real-time monitoring of student-well-being');
    await expect(page.locator('pricing')).toContainText('Lessons to support hope and skills development');
    await expect(page.locator('pricing')).toContainText('Goal-setting and tracking');
    await expect(page.locator('pricing')).toContainText('Portfolios to capture evidence of learning');
  
    await expect(page.locator('pricing')).toContainText('Professional Support');
    await expect(page.locator('pricing')).toContainText('Thrively provides ongoing support to ensure successful implementation');
    await expect(page.locator('pricing')).toContainText('Onboarding and implementation support');
    await expect(page.locator('pricing')).toContainText('Ongoing customer service and tech support throughout the year');
  
    await expect(page.locator('pricing')).toContainText('Additional Modules');
    await expect(page.locator('pricing')).toContainText('Thrively has deeper support for specific programs');
    await expect(page.locator('pricing')).toContainText('+Student wellness');
    await expect(page.locator('pricing')).toContainText('+Work-based learning/ CTE');
    await expect(page.locator('pricing')).toContainText('+Gifted & Talented');
    await expect(page.locator('pricing')).toContainText('+STEM Enrichment & PBL');
  
    await expect(page.getByRole('img', { name: 'We are ESSA approved' })).toBeVisible();
  
    await expect(page.locator('pricing')).toContainText('DISTRICT BUYING OPTIONS');
    await expect(page.locator('pricing')).toContainText('We are ESSA approved');
    await expect(page.locator('pricing')).toContainText('School districts can fund Thrively using ESSER II/III, Strong Workforce Grants, Perkins, Title I, ELOP, CCSPP, and other federal and state grant funds.');
  
    await expect(page.getByText('Download Research')).toBeVisible();
  
    // ✅ Download Research (Popup URL Validation)
    const page1Promise = page.waitForEvent('popup');
    await page.getByText('Download Research').click();
    const page1 = await page1Promise;
  
    await expect(page1).toHaveURL(
      'https://static.thrively.com/docs/Thrively%20Research%20-%20Whole%20Child%20Development.pdf'
    );
    await page.goBack();
    await lander.navigate(landerData.pricing);
    await page.reload();
    await page.reload({ waitUntil: 'load' });
    await expect(page.locator('pricing')).toContainText('INDIVIDUAL TEACHERS');
    await expect(page.locator('pricing')).toContainText('Ready to get started?');
    await expect(page.locator('pricing')).toContainText('Let’s accelerate and amplify your journey towards creating an equitable and joyful learning environment.');
  
    await expect(page.getByText('Get started for FREE')).toBeVisible();
  
    await page.getByText('Get started for FREE').click();
    await page.getByRole('button', { name: 'Close' }).click();
  
    await expect(page.locator('pricing')).toContainText('Curious to discover the range of benefits Thrively can offer to your school or district?');
    await expect(page.locator('pricing')).toContainText('Enhance your student-teacher relationships and unleash the full potential of Thrively');
  
    // ✅ Learn More → Overview Page Validation
    await page.getByText('Learn More').click();
  
    await expect(page).toHaveURL(/overview/);
  
    await expect(page.locator('call-to-action-banner')).toContainText('Thrively is powering classrooms all across America.');
  
  });

    // =======================
    // ✅ OVERVIEW PAGE
    // =======================
    test('Overview Page Full Validation', async ({ page }) => {
      const lander = new Landerpages(page);
  
      await lander.navigate(landerData.overview);
  
      // Hero
      await expect(lander.jumbotron).toContainText('Every Child Deserves to Thrive');
      await expect(lander.jumbotron).toContainText('every child deserves to thrive');
  
      await lander.clickHeroJoin();
      await lander.closeModal();
  
      // Overview content
      await expect(lander.overview).toContainText('strengths-based learning');
  
      await lander.clickLearnMore();
  
      await expect(lander.overview).toContainText(
        'We create the conditions for positive and growth-oriented student engagement'
      );
  
      // Navigation cards
      /*await page.getByText('STRENGTHS').click();
      await expect(page).toHaveURL(landerData.strengths);
      await page.goBack();
  
      await page.getByText('WELL-BEING').click();
      await expect(page).toHaveURL(landerData.wellbeing);
      await page.goBack();
  
      await page.getByText('HOPE').click();
      await expect(page).toHaveURL(landerData.hope);
      await page.goBack();*/
  
      // Educators
      await expect(page.locator('schools-and-districts'))
        .toContainText('150,000+ Educators & Districts');
  
      // Banner
      await page.reload();
  
      await expect(page.locator('learning-community-banner')).toContainText('Build a Thriving Learning Community');
  
      await lander.clickRole('link', 'Schedule a Call Today');
    });
  
    
    // =======================
    // ✅ WHY THRIVELY PAGE
    // =======================
    test('Why Thrively Page Full Validation', async ({ page }) => {
      const lander = new Landerpages(page);
  
      await lander.navigate(landerData.whyThrively);
  
      await expect(lander.whyThrively)
        .toContainText('Thrively is committed to creating an equitable');
  
      await expect(page.locator('#StrengthsMovementSection'))
        .toContainText('Join the strengths-based movement');
  
      await expect(page.locator('#topSection'))
        .toContainText('If you ask your students');
  
      await expect(page.locator('#topSection'))
        .toContainText('What positive information');
  
      // Survey
      await page.getByRole('radio', { name: 'Most likely to hear' }).check();
      await page.getByText('Our teachers are equipped').click();
      await page.getByRole('button', { name: 'Continue' }).click();
  
      await expect(page.getByText('Strive to thrive')).toBeVisible();
  
      // Pillars
      await page.getByRole('button', { name: 'View Pillars' }).click();
  
      const pillars = [
        'Developing Self-Identity',
        'Developing Agency',
        'Hope',
        'Student Well-being',
        'Learning Journey'
      ];
  
      for (const pillar of pillars) {
        await expect(lander.pillarsTab).toContainText(pillar);
        await lander.clickNextPillar();
      }
  
      // CTA
      await lander.clickText('Join Today');
      await lander.closeModal();
  
      await lander.clickText('Join the Movement');
      await lander.closeModal();
  
      await expect(page.getByRole('img', { name: 'Our students are waiting on us' }))
        .toBeVisible();
  
      await lander.clickRole('link', 'Schedule a Call Today');
    });
  
    // =======================
    // ✅ (Other pages remain same)
    // =======================
  
  });
