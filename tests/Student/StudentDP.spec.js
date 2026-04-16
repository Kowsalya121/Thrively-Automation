import { test, expect } from '@playwright/test';
test.use({ storageState: 'storageState.json' });

test('Dashboard test', async ({ page }) => {
  await page.goto('https://qa.thrively.com/ng/#/teacher/3254662/portfolio');
  page.getByText('Edit Summary').click();

  
});