import 'dotenv/config';

export default {
  testDir: './tests',
  timeout: 50000,

  use: {
    baseURL: process.env.BASE_URL,
    headless: false,

    screenshot: 'only-on-failure',
    trace: 'on',

    video: {
      mode: 'retain-on-failure'
    },

    launchOptions: {
      devtools: true,
      slowMo: 500
    }
  },

  reporter: [['html', { open: 'never' }]],
};