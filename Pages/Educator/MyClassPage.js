import { stablePage } from '../../Utility/stablePage.js';

export class MyClassPage {
  constructor(page) {
    this.page = page;
  }

  // ── Locators ─────────────────────────────────────────────────────────────

  get myClassHeading()          { return this.page.getByText('My Classes'); }
  get studentList()             { return this.page.locator('.add-manual-container, [class*="student"]'); }
  get addStudentsBtn()          { return this.page.locator('button, [class*="btn"]').filter({ hasText: 'Add Students' }).first(); }
  get addStudentsModal()        { return this.page.locator('dialog, [role="dialog"]').last(); }
  get modalHeading()            { return this.page.getByRole('heading', { name: 'Add Students' }); }
  get addManuallyTab()          { return this.page.getByRole('tab', { name: 'Add Manually' }); }
  get firstNameInput()          { return this.page.locator('input[formcontrolname="firstName"]').first(); }
  get lastNameInput()           { return this.page.locator('input[formcontrolname="lastName"]').first(); }
  get usernameInput()           { return this.page.locator('input[formcontrolname="username"]').first(); }
  get gradeSelect()             { return this.page.locator('select[formcontrolname="grade"]').first(); }
  get saveBtn()                 { return this.page.getByRole('button', { name: 'Save' }); }
  get cancelBtn()               { return this.page.getByRole('button', { name: 'Cancel' }); }
  get newStudentsAddedHeading() { return this.page.getByText('New Students Added'); }
  get schoolLoginUrl()          { return this.page.getByText('https://qa.thrively.com/ng/login/school/'); }

  // ── Actions ──────────────────────────────────────────────────────────────

  async navigateViaMenu() {
    await stablePage(this.page);
    await this.myClassHeading.click();
    await this.page.waitForURL(/\/my-class/);
    await stablePage(this.page);
  }

  async openAddStudentsModal() {
    await stablePage(this.page);
    await this.addStudentsBtn.click();
    await this.modalHeading.waitFor({ state: 'visible', timeout: 15000 });
    await stablePage(this.page);
  }

  async selectAddManuallyTab() {
    await this.addManuallyTab.click();
    await stablePage(this.page);
  }

  async addStudentManually({ firstName, lastName, username, gradeIndex = 3 }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.usernameInput.fill(username);
    const gradeVisible = await this.gradeSelect.isVisible();
    if (gradeVisible) {
      await this.gradeSelect.selectOption({ index: gradeIndex });
    }
    await this.saveBtn.click();
    await stablePage(this.page);
  }

  async waitForSuccessConfirmation() {
    await this.newStudentsAddedHeading.waitFor({ state: 'visible', timeout: 15000 });
  }

  async isStudentInList(lastName, firstName) {
    const namePattern = `${lastName}, ${firstName}`;
    return this.page.getByText(namePattern, { exact: false }).isVisible();
  }
}
