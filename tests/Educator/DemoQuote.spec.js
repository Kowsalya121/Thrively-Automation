import { test, expect }   from '../../Fixtures/baseTest.js';
import { DemoQuotePage }  from '../../Pages/Educator/DemoQuotePage.js';
import { DemoQuotedata }  from '../../test-data/testdata.js';

test('Schedule Demo Flow', async ({ page, context }) => {
  const form = new DemoQuotePage(page);
  const data = DemoQuotedata.getData(Date.now());

  await form.goto();
  await form.openScheduleDemo();

  await expect(form.form).toContainText('Tell us about you',    { timeout: 30000 });
  await expect(form.form).toContainText('Schedule a Demo',       { timeout: 30000 });

  await form.fillCommonForm(data);
  await form.submit();

  await expect(form.success).toBeVisible({ timeout: 30000 });
  await expect(form.form).toContainText('Thanks for requesting a demo!', { timeout: 30000 });

  const [calendlyPage] = await Promise.all([
    context.waitForEvent('page'),
    form.scheduleNowLink.click(),
  ]);
  await expect(calendlyPage).toHaveURL(/calendly/, { timeout: 30000 });
  await calendlyPage.close();

  const [pdfPage] = await Promise.all([
    context.waitForEvent('page'),
    form.learnMoreLinks.nth(3).click(),
  ]);
  await expect(pdfPage).toHaveURL(/Humanize/, { timeout: 30000 });
  await pdfPage.close();

  const [blogPage] = await Promise.all([
    context.waitForEvent('page'),
    form.learnMoreLinks.nth(4).click(),
  ]);
  await expect(blogPage).toHaveURL(/blog/, { timeout: 30000 });
  await blogPage.close();
});

test('Request Quote Flow', async ({ page, context }) => {
  const form = new DemoQuotePage(page);
  const data = DemoQuotedata.getData(Date.now());

  await form.goto();
  await form.openRequestQuote();

  await expect(form.form).toContainText('Tell us about you',                              { timeout: 30000 });
  await expect(form.form).toContainText('Request a Quote',                                { timeout: 30000 });
  await expect(form.form).toContainText('Joyful learning environments for academic success');
  await expect(form.form).toContainText('Streamline Districtwide Academic Success');
  await expect(form.form).toContainText('We provide a systematic way to know your learners');
  await expect(form.form).toContainText('Engage Students with Learner-Centered Approach');
  await expect(form.form).toContainText('Boost Engagement and Achievement');
  await expect(form.form).toContainText('Join the educators and students');

  await expect(page.locator('.abs.b0.r-30')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('.wh50').first()).toBeVisible({ timeout: 30000 });
  await expect(page.locator('li:nth-child(2) > .wh50')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('li:nth-child(3) > .wh50')).toBeVisible({ timeout: 30000 });

  await form.fillCommonForm(data);
  await form.fillQuoteExtra(data);

  await expect(form.submitBtn).toBeVisible({ timeout: 30000 });
  await form.submit();

  await expect(form.success).toBeVisible({ timeout: 30000 });
  await expect(form.form).toContainText('Thanks for requesting a quote!',     { timeout: 30000 });
  await expect(form.form).toContainText('Fast-track your demo & pick a time', { timeout: 30000 });

  await expect(page.locator('.sameline.valignmiddle.calenderIcon > use')).toBeVisible({ timeout: 30000 });

  await expect(page.locator('resource-pdf-list')).toContainText('Create strengths-based classrooms');
  await expect(page.locator('resource-pdf-list')).toContainText('Transform your environment');
  await expect(page.locator('resource-pdf-list')).toContainText('Educators & students talk about Thrively');

  // SSR-SAFE: PDF poster items verified via their container text rather than img alt names
  await expect(page.locator('resource-pdf-list').getByRole('listitem').first()).toBeVisible({ timeout: 30000 });
  await expect(page.locator('resource-pdf-list').getByRole('listitem').nth(1)).toBeVisible({ timeout: 30000 });

  await expect(form.scheduleNowLink).toBeVisible({ timeout: 30000 });

  const [calendlyPage] = await Promise.all([
    context.waitForEvent('page'),
    form.scheduleNowLink.click(),
  ]);
  await expect(calendlyPage).toHaveURL(/calendly/, { timeout: 30000 });
  await calendlyPage.close();

  const [pdfPage] = await Promise.all([
    context.waitForEvent('page'),
    form.learnMoreLinks.nth(3).click(),
  ]);
  await expect(pdfPage).toHaveURL(
    'https://static.thrively.com/docs/Humanize%20Learning.pdf',
    { timeout: 30000 }
  );
  await pdfPage.close();

  const [blogPage] = await Promise.all([
    context.waitForEvent('page'),
    form.learnMoreLinks.nth(4).click(),
  ]);
  await expect(blogPage).toHaveURL('https://blog.thrively.com/genius-at-work/', { timeout: 30000 });
  await blogPage.close();
});
