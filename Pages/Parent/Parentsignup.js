import { stablePage } from '../../Utility/stablePage.js';

export class Parentsignup {
  constructor(page) {
    this.page = page;
  }

  // ── Locators ─────────────────────────────────────────────────────────────

  get menu()            { return this.page.locator('guest-side-menu').getByRole('img'); }
  get parents()         { return this.page.getByText('Parents'); }
  get signupNow()       { return this.page.getByRole('link', { name: 'Sign up now' }); }
  get emailInput()      { return this.page.getByRole('textbox', { name: 'johndoe@gmail.com' }); }
  get continueBtn()     { return this.page.getByRole('button', { name: 'Continue', exact: true }); }
  get firstName()       { return this.page.getByRole('textbox', { name: 'First Name' }); }
  get lastName()        { return this.page.getByRole('textbox', { name: 'Last Name Password' }); }
  get password()        { return this.page.getByRole('textbox', { name: 'Password', exact: true }); }
  get createAccountBtn(){ return this.page.getByRole('button', { name: 'Create account' }); }
  get exploreStrengths(){ return this.page.getByText('Explore the Strengths'); }
  get buyNowBtn()       { return this.page.locator('//a[text()="$24.99 – Buy now"]'); }
  get promoInput()      { return this.page.getByRole('textbox', { name: 'Promo Code' }); }
  get applyBtn()        { return this.page.getByRole('button', { name: 'Apply' }); }
  get paymentEmail()    { return this.page.getByRole('textbox', { name: 'Email *' }); }
  get payNowBtn()       { return this.page.getByRole('button', { name: 'Pay Now' }); }
  get childFirstName()  { return this.page.getByRole('textbox', { name: "Child's Name" }); }
  get childLastName()   { return this.page.getByRole('textbox', { name: 'Last Name' }); }
  get childUsername()   { return this.page.getByRole('textbox', { name: 'Create a username for your' }); }
  get childPassword()   { return this.page.getByRole('textbox', { name: 'Choose a password for your' }); }
  get ageDropdown()     { return this.page.getByRole('combobox'); }

  // ── Actions ──────────────────────────────────────────────────────────────

  async goto() {
    await this.page.goto('https://qa.thrively.com/ng/#/classroom', {
      waitUntil: 'domcontentloaded',
    });
    await stablePage(this.page);
  }

  async openParents() {
    await stablePage(this.page);
    await this.menu.click();
    await stablePage(this.page);
    await this.parents.click();
    await stablePage(this.page);
  }

  async openSignup() {
    await stablePage(this.page);
    await this.signupNow.click();
    await stablePage(this.page);
  }

  async enterEmail(emailVal) {
    await this.emailInput.fill(emailVal);
  }

  async continue() {
    await this.continueBtn.click();
    await stablePage(this.page);
  }

  async fillParentDetails(first, last, passwordVal) {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.password.fill(passwordVal);
  }

  async createAccount() {
    await this.createAccountBtn.click();
    await stablePage(this.page);
  }

  async openAssessment() {
    await stablePage(this.page);
    await this.exploreStrengths.click();
    await stablePage(this.page);
    const section = this.page.locator('jumbotron').filter({ hasText: 'Thrively Strengths Assessment' });
    await section.locator(this.buyNowBtn).click();
    await stablePage(this.page);
  }

  async applyPromo(code) {
    await this.promoInput.fill(code);
    await this.applyBtn.click();
    await stablePage(this.page);
  }

  async pay(emailVal) {
    await this.paymentEmail.fill(emailVal);
    await this.payNowBtn.click();
    await stablePage(this.page);
  }

  async addChild(first, last, usernameVal, passwordVal, age1) {
    await this.childFirstName.fill(first);
    await this.childLastName.fill(last);
    await this.childUsername.fill(usernameVal);
    await this.childPassword.fill(passwordVal);
    await this.ageDropdown.first().selectOption(age1);
    await this.page.getByRole('button', { name: 'Add Child' }).click();
    await stablePage(this.page);
  }
}
