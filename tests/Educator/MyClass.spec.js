import { test, expect }  from '../../Fixtures/baseTest.js';
import { LoginPage }     from '../../Pages/Educator/LoginPage.js';
import { MyClassPage }   from '../../Pages/Educator/MyClassPage.js';
import { educatorUser }  from '../../test-data/testdata.js';

test('Educator – Login, navigate to My Class, and add a student', async ({ page }) => {
  const login   = new LoginPage(page);
  const myClass = new MyClassPage(page);

  await login.goto();
  await expect(page).toHaveURL(/classroom/, { timeout: 30000 });

  await login.openLogin();
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible({ timeout: 30000 });

  await login.login(educatorUser);

  await expect(page).toHaveURL(/select-account/, { timeout: 30000 });
  await expect(page.getByRole('heading', { name: 'Choose Account' })).toBeVisible({ timeout: 30000 });

  await login.selectSchool(educatorUser.schoolName);

  await expect(page).toHaveURL(/dashboard/, { timeout: 30000 });
  await expect(page.getByRole('heading', { name: 'My Dashboard' })).toBeVisible({ timeout: 30000 });

  await myClass.navigateViaMenu();
  await expect(page).toHaveURL(/my-class/, { timeout: 30000 });

  await expect(page.getByText('Add Students')).toBeVisible({ timeout: 30000 });

  await myClass.openAddStudentsModal();
  await expect(myClass.modalHeading).toBeVisible({ timeout: 30000 });

  await myClass.selectAddManuallyTab();
  await expect(myClass.firstNameInput).toBeVisible({ timeout: 30000 });

  const ts      = Date.now();
  const student = {
    firstName : 'AutoTest',
    lastName  : 'Student',
    username  : `autotest_${ts}`,
    gradeIndex: 3,
  };

  await myClass.addStudentManually(student);

  await myClass.waitForSuccessConfirmation();
  await expect(myClass.newStudentsAddedHeading).toBeVisible({ timeout: 30000 });
  await expect(myClass.schoolLoginUrl).toBeVisible({ timeout: 30000 });

  const inList = await myClass.isStudentInList(student.lastName, student.firstName);
  expect(inList).toBe(true);
});
