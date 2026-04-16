import { test, expect } from '@playwright/test';
import { LoginPage } from '../../Pages/Educator/LoginPage';
import { Loginusers } from '../../test-data/testdata';

// ✅ Helper function (only login logic)
async function loginUser(page, user) {
  const login = new LoginPage(page);

  await login.goto();
  await login.openLogin();
  await login.login(user);
  if (user.role === 'educator') {
    await expect(page.getByText('Choose Account')).toBeVisible();
    await login.selectSchool(user.schoolName);
  }
  await page.context().storageState({ path: 'storageState.json' });
}

// ✅ Convert object → array
const users = Object.values(Loginusers);

// ✅ Define tests at top level
for (const user of users) {
  test(`Login test for ${user.role}`, async ({ page }) => {
    await loginUser(page, user);
  });
};