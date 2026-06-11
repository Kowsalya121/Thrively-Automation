import { defineConfig } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  testDir: './tests',

  /* Global per-test timeout — long enough for 80-question assessments */
  timeout: 300_000,

  /* Default expect timeout — raised to handle SSR hydration delays */
  expect: {
    timeout: 30_000,
  },

  use: {
    baseURL: process.env.BASE_URL || 'https://qa.thrively.com',
    headless: false,

    screenshot: 'only-on-failure',
    trace:      'on-first-retry',
    video:      'retain-on-failure',

    /* Per-action / navigation timeouts */
    actionTimeout:     60_000,
    navigationTimeout: 90_000,

    launchOptions: {
      devtools: false,
      /* slowMo only when debugging — set SLOW_MO env var */
      slowMo: process.env.SLOW_MO ? Number(process.env.SLOW_MO) : 0,
    },
  },

  reporter: [['html', { open: 'never' }]],
});
