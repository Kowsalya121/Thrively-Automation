import { stablePage } from '../../Utility/stablePage.js';

export class StudentSignup {
  constructor(page) {
    this.page = page;
  }

  // ── Locators ─────────────────────────────────────────────────────────────

  get menuIcon()       { return this.page.locator('guest-side-menu').getByRole('img'); }
  get studentsTab()    { return this.page.getByText('Students', { exact: true }); }
  get joinFree()       { return this.page.getByText('Join For Free Today'); }
  get heading()        { return this.page.getByRole('heading'); }
  get registration()   { return this.page.locator('registration'); }
  get googleBtn()      { return this.page.getByRole('button', { name: 'Sign up with Google' }); }
  get microsoftBtn()   { return this.page.getByRole('button', { name: 'Sign up with Microsoft' }); }
  get emailSignupBtn() { return this.page.getByRole('button', { name: 'Sign up with Email' }); }
  get day()            { return this.page.getByRole('combobox').first(); }
  get month()          { return this.page.getByRole('combobox').nth(1); }
  get year()           { return this.page.getByRole('combobox').nth(2); }
  get firstName()      { return this.page.getByRole('textbox', { name: 'First Name' }); }
  get lastName()       { return this.page.getByRole('textbox', { name: 'Last Name' }); }
  get email()          { return this.page.getByRole('textbox', { name: 'Email Address' }); }
  get password()       { return this.page.getByRole('textbox', { name: 'Password', exact: true }); }
  get retypePassword() { return this.page.getByRole('textbox', { name: 'Retype Password' }); }
  get signupBtn()      { return this.page.getByRole('button', { name: 'Sign Up for Free' }); }
  get inviteTextbox()  { return this.page.getByRole('textbox', { name: 'Enter Invite Code' }); }
  get submitBtn()      { return this.page.getByRole('button', { name: 'Submit' }); }
  get nextBtn()        { return this.page.getByRole('button', { name: 'Next' }); }

  // ── Actions ──────────────────────────────────────────────────────────────

  async goto() {
    await this.page.goto('https://qa.thrively.com/ng/#/classroom', {
      waitUntil: 'domcontentloaded',
    });
    await stablePage(this.page);
  }

  async openStudentSignup() {
    await stablePage(this.page);
    await this.menuIcon.click();
    await stablePage(this.page);
    await this.studentsTab.click();
    await stablePage(this.page);
    await this.joinFree.click();
    await stablePage(this.page);
  }

  async clickEmailSignup() {
    await this.emailSignupBtn.click();
    await stablePage(this.page);
  }

  async fillDOB(dob) {
    await this.day.selectOption(dob.day);
    await this.month.selectOption(dob.month);
    await this.year.selectOption(dob.year);
  }

  async fillSignupForm(user) {
    await this.firstName.fill(user.firstName);
    await this.lastName.fill(user.lastName);
    await this.email.fill(user.email());
    await this.password.fill(user.password);
    await this.retypePassword.fill(user.password);
  }

  async submitSignup() {
    await this.signupBtn.click();
    await stablePage(this.page);
  }

  async enterInviteCode(code) {
    await this.inviteTextbox.fill(code);
  }

  async submitInvite() {
    await this.submitBtn.click();
    await stablePage(this.page);
  }

  async clickNext() {
    await this.nextBtn.click();
    await stablePage(this.page);
  }
}
