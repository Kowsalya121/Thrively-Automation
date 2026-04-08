import { test, expect } from '@playwright/test';
import { LoginPage } from '../../Pages/Educator/LoginPage';
import { loginEducator } from '../../test-data/testdata';

test('Educator Login Flow', async ({ page }) => {
  const login = new LoginPage(page);

  await login.goto();

  await login.openLogin();

  // Login modal assertions
  await expect(login.loginModal).toContainText('Sign In');

  await expect(login.googleBtn).toBeVisible();
  await expect(login.microsoftBtn).toBeVisible();

  await expect(page.getByText('Remember me')).toBeVisible();
  await expect(login.signInBtn).toBeVisible();
  await expect(page.getByRole('link', { name: 'Reset Password' })).toBeVisible();

  // Login action
  await login.login(loginEducator);

  // Account selection assertions
  await expect(page.getByText(' Choose Account ')).toContainText('Choose Account');

  await expect(page.getByRole('paragraph')).toContainText(
    'You have been associated with multiple accounts. Please select an account.'
  );

  await expect(page.getByText('GECK')).toBeVisible();

  await login.selectSchool(loginEducator.schoolName);

  // Dashboard assertion
  await expect(page.getByRole('heading', { name: 'My Dashboard' })).toBeVisible();
});