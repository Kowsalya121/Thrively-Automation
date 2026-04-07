import { test, expect } from '@playwright/test';
import { DemoQuotePage } from '../../Pages/Educator/DemoQuotePage';
import { DemoQuotedata } from '../../test-data/testdata';


test('Schedule Demo Flow', async ({ page, context }) => {

  const form = new DemoQuotePage(page);
  const data = DemoQuotedata.getData(Date.now());

  await form.goto();
  await form.openScheduleDemo();

  // ✅ Assertions (UNCHANGED)
  await expect(form.form).toContainText('Tell us about you');
  await expect(form.form).toContainText('Schedule a Demo');

  await form.fillCommonForm(data);
  await form.submit();

  await expect(form.success).toBeVisible();
  await expect(form.form).toContainText('Thanks for requesting a demo!');

  // ✅ Schedule now
  const [calendlyPage] = await Promise.all([
    context.waitForEvent('page'),
    form.scheduleNowLink.click()
  ]);
  await expect(calendlyPage).toHaveURL(/calendly/);
  await calendlyPage.close();

  // ✅ Learn More links
  const [pdfPage] = await Promise.all([
    context.waitForEvent('page'),
    form.learnMoreLinks.nth(3).click()
  ]);
  await expect(pdfPage).toHaveURL(/Humanize/);
  await pdfPage.close();

  const [blogPage] = await Promise.all([
    context.waitForEvent('page'),
    form.learnMoreLinks.nth(4).click()
  ]);
  await expect(blogPage).toHaveURL(/blog/);
  await blogPage.close();
});

test('Request Quote Flow', async ({ page, context }) => {

  const form = new DemoQuotePage(page);
  const data = DemoQuotedata.getData(Date.now());

  await form.goto();
  await form.openRequestQuote();

  // ✅ ALL YOUR ASSERTIONS KEPT
  await expect(form.form).toContainText('Tell us about you');
  await expect(form.form).toContainText('Request a Quote');
  await expect(form.form).toContainText('Joyful learning environments for academic success');
  await expect(form.form).toContainText('Streamline Districtwide Academic Success');
  await expect(form.form).toContainText('We provide a systematic way to know your learners');
  await expect(form.form).toContainText('Engage Students with Learner-Centered Approach');
  await expect(form.form).toContainText('Boost Engagement and Achievement');
  await expect(form.form).toContainText('Join the educators and students');

  await expect(page.locator('.abs.b0.r-30')).toBeVisible();
  await expect(page.locator('.wh50').first()).toBeVisible();
  await expect(page.locator('li:nth-child(2) > .wh50')).toBeVisible();
  await expect(page.locator('li:nth-child(3) > .wh50')).toBeVisible();

  // Fill
  await form.fillCommonForm(data);
  await form.fillQuoteExtra(data);

  await expect(form.submitBtn).toBeVisible();
  await form.submit();

  // ✅ Success assertions
  await expect(form.success).toBeVisible();
  await expect(form.form).toContainText('Thanks for requesting a quote!');
  await expect(form.form).toContainText('Fast-track your demo & pick a time');

  await expect(page.locator('.sameline.valignmiddle.calenderIcon > use')).toBeVisible();

  await expect(page.locator('resource-pdf-list')).toContainText('Create strengths-based classrooms');
  await expect(page.locator('resource-pdf-list')).toContainText('Transform your environment');
  await expect(page.locator('resource-pdf-list')).toContainText('Educators & students talk about Thrively');

  await expect(page.getByRole('img', { name: 'strength-poster' }).first()).toBeVisible();
  await expect(page.getByRole('img', { name: 'strength-poster' }).nth(1)).toBeVisible();

  await expect(form.scheduleNowLink).toBeVisible();

  // ✅ Schedule now
  const [calendlyPage] = await Promise.all([
    context.waitForEvent('page'),
    form.scheduleNowLink.click()
  ]);
  await expect(calendlyPage).toHaveURL(/calendly/);
  await calendlyPage.close();

  // ✅ Learn More links
  const [pdfPage] = await Promise.all([
    context.waitForEvent('page'),
    form.learnMoreLinks.nth(3).click()
  ]);
  await expect(pdfPage).toHaveURL('https://static.thrively.com/docs/Humanize%20Learning.pdf');
  await pdfPage.close();

  const [blogPage] = await Promise.all([
    context.waitForEvent('page'),
    form.learnMoreLinks.nth(4).click()
  ]);
  await expect(blogPage).toHaveURL('https://blog.thrively.com/genius-at-work/');
  await blogPage.close();
});