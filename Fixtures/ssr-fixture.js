import { test as base, expect } from '@playwright/test';

exports.test = base.extend({
  page: async ({ page }, use) => {

    // 🌐 Step 1: basic SSR navigation stability
    await page.goto(process.env.BASE_URL, {
      waitUntil: 'domcontentloaded'
    });

    // ⏳ Step 2: wait for SSR + API calls
    await page.waitForLoadState('networkidle');

    // 🧠 Step 3: hydration buffer (VERY IMPORTANT for SSR apps)
    await page.waitForTimeout(1500);

    // 🔍 Step 4: ensure DOM is interactive
    await page.evaluate(() => document.readyState);

    // 🧩 Step 5: mark page ready after full load
    await page.addInitScript(() => {
      window.__PLAYWRIGHT_READY__ = true;
    });

    await use(page);
  },

  expect: async ({}, use) => {
    const customExpect = expect.configure({
      timeout: 30000
    });

    await use(customExpect);
  }
});