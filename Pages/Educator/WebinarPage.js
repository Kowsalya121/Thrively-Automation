import { stablePage } from '../../Utility/stablePage.js';

export class WebinarPage {
  constructor(page) {
    this.page = page;
  }

  // ── Locators ─────────────────────────────────────────────────────────────

  get heading()              { return this.page.getByRole('heading', { name: 'Stronger Together: Using' }); }
  get signupModal()          { return this.page.locator('signup-to-watch'); }
  get signUpHereBtn()        { return this.page.getByRole('button', { name: 'Sign Up Here' }); }
  get register()             { return this.page.locator('register'); }
  get googleBtn()            { return this.page.getByRole('button', { name: 'Google' }); }
  get microsoftBtn()         { return this.page.getByRole('button', { name: 'Microsoft' }); }
  get email()                { return this.page.getByRole('textbox', { name: 'Email Address', exact: true }); }
  get confirmEmail()         { return this.page.getByRole('textbox', { name: 'Confirm Email Address' }); }
  get firstName()            { return this.page.getByRole('textbox', { name: 'First Name' }); }
  get lastName()             { return this.page.getByRole('textbox', { name: 'Last Name' }); }
  get password()             { return this.page.getByRole('textbox', { name: 'Password' }); }
  get schoolTextbox()        { return this.page.getByRole('textbox', { name: 'Enter School or District Name' }); }
  get gradeDropdown()        { return this.page.getByRole('combobox').first(); }
  get completeRegistration() { return this.page.getByRole('button', { name: 'Complete Registration' }); }
  get nextBtn()              { return this.page.getByRole('button', { name: 'Next' }); }

  // ── Actions ──────────────────────────────────────────────────────────────

  async goto() {
    await this.page.goto('https://qa.thrively.com/ng/#/webinars', {
      waitUntil: 'domcontentloaded',
    });
    await stablePage(this.page);
  }

  async openWebinar() {
    await stablePage(this.page);
    await this.heading.click();
    await stablePage(this.page);
  }

  async clickSignup() {
    await stablePage(this.page);
    await this.signUpHereBtn.click();
    await stablePage(this.page);
  }

  async fillSignup(user) {
    const emailVal = user.email();
    await this.email.fill(emailVal);
    await this.confirmEmail.fill(emailVal);
    await this.firstName.fill(user.firstName);
    await this.lastName.fill(user.lastName);
    await this.password.fill(user.password);
  }

  async selectSchool(searchText) {
    await this.page.getByText('Select School').click();
    await this.page.getByText('Non-US Schools').click();
    await this.page.getByText('US Schools', { exact: true }).click();
    await this.schoolTextbox.fill(searchText);
    await this.page.getByText('Pomaikai Elementary School').click();
    await this.page.getByRole('button', { name: 'Done' }).click();
    await stablePage(this.page);
  }

  async completeRegistrationFlow(user) {
    await this.gradeDropdown.selectOption(user.grade);
    await this.completeRegistration.click();
    await stablePage(this.page);
  }

  async clickNext() {
    await this.nextBtn.click();
    await stablePage(this.page);
  }
}
