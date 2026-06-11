import { stablePage } from '../../Utility/stablePage.js';

export class Signup {
  constructor(page) {
    this.page = page;
  }

  // ── Locators ─────────────────────────────────────────────────────────────

  get joinForFree()   { return this.page.getByText('Join for Free'); }
  get email()         { return this.page.getByRole('textbox', { name: 'Email Address' }); }
  get password()      { return this.page.getByRole('textbox', { name: 'Password' }); }
  get firstName()     { return this.page.getByRole('textbox', { name: 'First Name' }); }
  get lastName()      { return this.page.getByRole('textbox', { name: 'Last Name' }); }
  get roleDropdown()  { return this.page.getByRole('combobox'); }
  get signUpBtn()     { return this.page.getByRole('button', { name: 'Sign Up for Free' }); }
  get schoolSearch()  { return this.page.getByRole('textbox', { name: 'Enter School or District Name' }); }
  get doneBtn()       { return this.page.getByRole('button', { name: 'Done' }); }
  get nextBtn()       { return this.page.getByRole('button', { name: 'Next' }); }
  get finishBtn()     { return this.page.getByRole('button', { name: 'Finish Personalizing Thrively' }); }
  get skipBtn()       { return this.page.getByText('Skip'); }
  get goToDashboard() { return this.page.getByRole('button', { name: 'Go To Dashboard' }); }

  // ── Non-locator helpers (not DOM-queried at construction time) ────────────

  getOnboardingModal() { return this.page.locator('teacher-onboarding-guide-modal'); }
  getCommonCard()      { return this.page.locator('.w300'); }
  getImageContainer()  { return this.page.locator('.img-container'); }

  // ── Actions ──────────────────────────────────────────────────────────────

  async goto() {
    await this.page.goto('https://qa.thrively.com/ng/#/classroom', {
      waitUntil: 'domcontentloaded',
    });
    await stablePage(this.page);
  }

  async clickJoinForFree() {
    await stablePage(this.page);
    await this.joinForFree.click();
    await stablePage(this.page);
  }

  async fillSignupForm(emailVal, passwordVal, firstNameVal, lastNameVal) {
    await this.email.fill(emailVal);
    await this.password.fill(passwordVal);
    await this.firstName.fill(firstNameVal);
    await this.lastName.fill(lastNameVal);
  }

  async selectAge(value) {
    await this.roleDropdown.selectOption(value);
  }

  async submitSignup() {
    await this.signUpBtn.click();
    await stablePage(this.page);
  }

  async searchAndSelectSchool(schoolName, schoolOption) {
    await this.schoolSearch.fill(schoolName);
    await this.page.getByText(schoolOption).click();
    await stablePage(this.page);
  }

  async clickDone() {
    await this.doneBtn.click();
    await stablePage(this.page);
  }

  async clickNext() {
    await this.nextBtn.click();
    await stablePage(this.page);
  }

  async selectRole(role) {
    await this.roleDropdown.selectOption(role);
  }

  async selectInterest(interest) {
    await this.page.getByRole('checkbox', { name: interest }).check();
  }

  async finishPersonalization() {
    await this.finishBtn.click();
    await stablePage(this.page);
  }

  async skipVerification() {
    await this.skipBtn.click();
    await stablePage(this.page);
  }

  async goToDashboardClick() {
    await this.goToDashboard.click();
    await stablePage(this.page);
  }
}
