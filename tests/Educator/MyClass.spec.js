import { test, expect } from '../../Fixtures/baseTest.js';
import { LoginPage }  from '../../Pages/Educator/LoginPage.js';
import { MyClassPage } from '../../Pages/Educator/MyClassPage.js';
import { educatorUser } from '../../test-data/testdata.js';

/**
 * End-to-end test: Login → Select School → Dashboard → My Class → Add Student
 *
 * Credentials : qy+kowsalya+test2@liftoffllc.com / pass@121
 * School      : GECK
 */
test('Educator – Login, navigate to My Class, and add a student', async ({ page }) => {
  const login   = new LoginPage(page);
  const myClass = new MyClassPage(page);

  // ─── 1. Navigate to the application ────────────────────────────────────────
  await login.goto();
  await expect(page).toHaveURL(/classroom/);

  // ─── 2. Open the login modal ────────────────────────────────────────────────
  await login.openLogin();
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

  // ─── 3. Enter credentials and submit ────────────────────────────────────────
  await login.login(educatorUser);

  // ─── 4. Assert school-selection page ────────────────────────────────────────
  await expect(page).toHaveURL(/select-account/, { timeout: 15000 });
  await expect(page.getByRole('heading', { name: 'Choose Account' })).toBeVisible();

  // ─── 5. Select GECK school ──────────────────────────────────────────────────
  await login.selectSchool(educatorUser.schoolName);

  // ─── 6. Assert Dashboard ────────────────────────────────────────────────────
  await expect(page).toHaveURL(/dashboard/, { timeout: 15000 });
  await expect(page.getByRole('heading', { name: 'My Dashboard' })).toBeVisible();

  // ─── 7. Navigate to My Class via the sidebar ────────────────────────────────
  await myClass.navigateViaMenu();
  await expect(page).toHaveURL(/my-class/);

  // ─── 8. Assert My Class page is visible ─────────────────────────────────────
  await expect(page.getByText('Add Students')).toBeVisible();

  // ─── 9. Open Add Students modal ─────────────────────────────────────────────
  await myClass.openAddStudentsModal();
  await expect(myClass.modalHeading).toBeVisible();

  // ─── 10. Select "Add Manually" tab ──────────────────────────────────────────
  await myClass.selectAddManuallyTab();
  await expect(myClass.firstNameInput).toBeVisible();

  // ─── 11. Fill student details and save ──────────────────────────────────────
  const ts       = Date.now();
  const student  = {
    firstName : 'AutoTest',
    lastName  : 'Student',
    username  : `autotest_${ts}`,
    gradeIndex: 3
  };

  await myClass.addStudentManually(student);

  // ─── 12. Assert success confirmation ────────────────────────────────────────
  await myClass.waitForSuccessConfirmation();
  await expect(myClass.newStudentsAddedHeading).toBeVisible();
  await expect(myClass.schoolLoginUrl).toBeVisible();

  // ─── 13. Assert student appears in the class listing ────────────────────────
  const inList = await myClass.isStudentInList(student.lastName, student.firstName);
  expect(inList).toBe(true);
});
