export class MyClassPage {
  constructor(page) {
    this.page = page;

    // Page header
    this.myClassHeading = page.getByText('My Classes');

    // Student list
    this.studentList = page.locator('.add-manual-container, [class*="student"]');

    // Add Students button (outside dialog)
    this.addStudentsBtn = page.locator('button, [class*="btn"]').filter({ hasText: 'Add Students' }).first();

    // Add Students modal
    this.addStudentsModal    = page.locator('dialog, [role="dialog"]').last();
    this.modalHeading        = page.getByRole('heading', { name: 'Add Students' });
    this.addManuallyTab      = page.getByRole('tab', { name: 'Add Manually' });

    // Form fields (first row)
    this.firstNameInput  = page.locator('input[formcontrolname="firstName"]').first();
    this.lastNameInput   = page.locator('input[formcontrolname="lastName"]').first();
    this.usernameInput   = page.locator('input[formcontrolname="username"]').first();
    this.gradeSelect     = page.locator('select[formcontrolname="grade"]').first();

    // Modal action buttons
    this.saveBtn   = page.getByRole('button', { name: 'Save' });
    this.cancelBtn = page.getByRole('button', { name: 'Cancel' });

    // Post-save confirmation
    this.newStudentsAddedHeading = page.getByText('New Students Added');
    this.schoolLoginUrl          = page.getByText('https://qa.thrively.com/ng/login/school/');
  }

  /** Navigate directly to My Class (teacher-ID-agnostic via sidebar click). */
  async navigateViaMenu() {
    await this.myClassHeading.click();
    await this.page.waitForURL(/\/my-class/);
  }

  /** Open the Add Students modal. */
  async openAddStudentsModal() {
    await this.addStudentsBtn.click();
    await this.modalHeading.waitFor({ state: 'visible' });
  }

  /** Select the "Add Manually" tab inside the modal. */
  async selectAddManuallyTab() {
    await this.addManuallyTab.click();
  }

  /**
   * Fill one student row and save.
   * @param {{ firstName: string, lastName: string, username: string, gradeIndex?: number }} student
   */
  async addStudentManually({ firstName, lastName, username, gradeIndex = 3 }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.usernameInput.fill(username);

    const gradeVisible = await this.gradeSelect.isVisible();
    if (gradeVisible) {
      await this.gradeSelect.selectOption({ index: gradeIndex });
    }

    await this.saveBtn.click();
  }

  /** Wait for the "New Students Added" confirmation panel. */
  async waitForSuccessConfirmation() {
    await this.newStudentsAddedHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Return true when the given student name appears in the class listing.
   * @param {string} lastName
   * @param {string} firstName
   */
  async isStudentInList(lastName, firstName) {
    const namePattern = `${lastName}, ${firstName}`;
    const studentEntry = this.page.getByText(namePattern, { exact: false });
    return studentEntry.isVisible();
  }
}
