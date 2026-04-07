
import { test, expect } from '@playwright/test';
import { Parentsignup } from '../../Pages/Parent/Parentsignup';
import { parentData } from '../../test-data/testdata';
import { saveUser} from '../../Utility/Commonfun';

test('Parent Normal Signup Flow', async ({ page }) => {
  const parent = new Parentsignup(page);
  const data = parentData.signupUser;
  const ts = Date.now();

  await parent.goto();
  await parent.openParents();
  await parent.openSignup();

  // ✅ Texts directly in test
  await expect(page.getByRole('heading', { name: 'Discover the genius in your' })).toBeVisible();
  await expect(page.getByText('Discover the genius in your child Create an account to explore the power of')).toBeVisible();
  await expect(page.locator('h2')).toContainText('Sign Up');

  await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue with Facebook' })).toBeVisible();

  await expect(page.locator('label')).toContainText('Parent Email Address');

  await parent.enterEmail(data.email(ts));

  await expect(page.locator('use')).toBeVisible();

  await parent.continue();

  await expect(page.getByText(' Continue Sign Up ')).toContainText('Continue Sign Up');
  await expect(page.getByText('Continue Sign Up First')).toBeVisible();

  await parent.fillParentDetails(
    data.firstName,
    data.lastName,
    data.password
  );

  await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();

  await parent.createAccount();

  await expect(page.locator('background')).toContainText('The gowda Family');

  await expect(page.locator('parent-dashboard')).toContainText(
    'Every child has a genius! Discover your childs unique strengths—so you can support them in becoming confident, motivated, and ready to thrive in life Get started Learn more'
  );

  await expect(
    page.locator('empty-state-action-card')
      .filter({ hasText: 'Every child has a genius!' })
      .getByRole('img')
  ).toBeVisible();
});

test('Parent Purchase + Signup Flow', async ({ page }) => {
  const parent = new Parentsignup(page);
  const purchase = parentData.purchaseUser;
  const child = parentData.childData;
  const ts = Date.now();
  saveUser(purchase.paymentEmail(ts));

  await parent.goto();
  await parent.openParents();
  await parent.openAssessment();

  // ✅ Payment assertions (kept)
  await expect(page.locator('payment-modal')).toContainText('We’ll send your purchase confirmation and results to this email.');

  await expect(page.locator('payment-modal')).toContainText('Thrively Strengths Assessment $ 24.99');

  await expect(page.getByText('orPayment method')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Email *' })).toBeVisible();
  await parent.applyPromo(purchase.promoCode);
  await expect(page.getByRole('button', { name: 'Apply' })).toBeVisible();

  await parent.pay(purchase.paymentEmail(ts));

  //await expect(page.getByText("🎉 Purchase complete! Let's finish setting up your account.").toContainText("🎉 Purchase complete! Let's finish setting up your account."));

  await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible();

  await parent.continue();



  await parent.fillParentDetails(
    purchase.firstName,
    purchase.lastName,
    purchase.password
  );

  await parent.createAccount();

  await expect(page.getByText(' Account created! Lastly, add your child so they can take the assessment. ', { name: 'Account created!' })).toBeVisible();

  await expect(page.locator('add-child')).toContainText('Finish creating an account for your child');

  // ✅ Child assertions
  await expect(page.getByText('Create a username for your child')).toContainText('Create a username for your child');

  await expect(page.locator('form')) .toContainText('Choose a password for your child');

  await expect(page.getByRole('textbox', { name: 'Create a username for your' })).toBeVisible();
 await expect(page.getByRole('textbox', { name: 'Choose a password for your' })).toBeVisible();


  await parent.addChild(
    child.firstName(ts),
    child.lastName(ts),
    child.username(ts),
    child.password,
    child.age1
  );


  await expect(page.getByText('You’re All Set!')).toBeVisible();
  await expect(page.locator('.w200')).toBeVisible();

  await page.getByRole('button', { name: 'Close' }).click();
});