import { test, expect } from '../../Fixtures/baseTest.js';
import { LoginPage }   from '../../Pages/Educator/LoginPage.js';
import { Loginusers }  from '../../test-data/testdata.js';

async function loginUser(page, user) {
  const login = new LoginPage(page);

  await login.goto();
  await login.openLogin();
  await login.login(user);

  if (user.role === 'educator') {
    await expect(login.accountHeading).toBeVisible({ timeout: 30000 });
    await login.selectSchool(user.schoolName);
  }

  await expect(login.dashboardHeading).toBeVisible({ timeout: 30000 });
  await page.context().storageState({ path: 'storageState.json' });
}

const users = Object.values(Loginusers);

for (const user of users) {
  test(`Login test for ${user.role}`, async ({ page }) => {
    await loginUser(page, user);
  });
}
