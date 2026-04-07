import 'dotenv/config';

/** @type {import('@playwright/test').PlaywrightTestConfig} */
export default {
  testDir: './tests',
  timeout: 50000,

  use: {
    baseURL: process.env.BASE_URL, // ✅ added from .env
    headless: false,
  
  },
  use: {
    headless: false,
    launchOptions: {
      devtools: false
    },
    use: {
      video: {
        mode: 'retain-on-failure'
      },
      screenshot: 'only-on-failure',
      trace: 'retain-on-failure'
    }
  },

  reporter: [['html', { open: 'never' }]],
};