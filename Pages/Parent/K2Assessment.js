import { stablePage } from '../../Utility/stablePage.js';

export class K2Assessment {
  constructor(page) {
    this.page = page;
  }

  // ── Locators ─────────────────────────────────────────────────────────────

  get loginBtn()           { return this.page.getByText('Login'); }
  get email()              { return this.page.getByRole('textbox', { name: 'Email or Username' }); }
  get password()           { return this.page.getByRole('textbox', { name: 'Password' }); }
  get signInBtn()          { return this.page.getByRole('button', { name: 'Sign In' }); }
  get addChildBtn()        { return this.page.getByRole('button', { name: 'Add a child' }); }
  get firstName()          { return this.page.getByRole('textbox', { name: 'Name', exact: true }); }
  get lastName()           { return this.page.getByRole('textbox', { name: 'Last Name' }); }
  get ageDropdown()        { return this.page.getByLabel('Age'); }
  get username()           { return this.page.getByRole('textbox', { name: 'Username' }); }
  get childPassword()      { return this.page.getByRole('textbox', { name: 'Password' }); }
  get addChildSubmit()     { return this.page.getByRole('button', { name: 'Add Child' }); }
  get learnMore()          { return this.page.locator('thrively-common-score').getByRole('button', { name: 'Learn more' }); }
  get buyNow()             { return this.page.getByRole('button', { name: '$24.99 - Buy now' }); }
  get checkout()           { return this.page.getByRole('button', { name: 'Go to checkout' }); }
  get promoCodeInput()     { return this.page.getByRole('textbox', { name: 'Promo Code' }); }
  get applyBtn()           { return this.page.getByRole('button', { name: 'Apply' }); }
  get payNow()             { return this.page.getByRole('button', { name: 'Pay Now' }); }
  get purchaseSuccessModal(){ return this.page.locator('purchase-success'); }
  get closeBtn()           { return this.purchaseSuccessModal.getByRole('button', { name: 'Close' }); }
  get startAssessmentBtn() { return this.page.locator('thrively-common-score').getByRole('button', { name: 'Start Assessment' }); }
  get startNow()           { return this.page.getByRole('button', { name: 'Start Now' }); }
  get beginAssessment()    { return this.page.getByRole('button', { name: 'Begin Assessment' }); }
  get saveLanguage()       { return this.page.getByRole('button', { name: 'Save' }); }

  // ── Actions ──────────────────────────────────────────────────────────────

  async goto() {
    await this.page.goto('https://qa.thrively.com/ng/#/classroom', {
      waitUntil: 'domcontentloaded',
    });
    await stablePage(this.page);
  }

  async clickLogin() {
    await stablePage(this.page);
    await this.loginBtn.click();
    await stablePage(this.page);
  }

  async login(user) {
    await this.email.fill(user.email);
    await this.password.fill(user.password);
    await this.signInBtn.click();
    await stablePage(this.page);
  }

  async clickAddChild() {
    await stablePage(this.page);
    await this.addChildBtn.click();
    await stablePage(this.page);
  }

  async addChild(child) {
    await this.firstName.fill(child.firstName);
    await this.lastName.fill(child.lastName);
    await this.ageDropdown.selectOption(child.age1);
    await this.username.fill(child.username());
    await this.childPassword.fill(child.password);
    await this.addChildSubmit.click();
    await stablePage(this.page);
  }

  async startPurchaseFlow() {
    await stablePage(this.page);
    await this.learnMore.click();
    await stablePage(this.page);
    await this.buyNow.click();
    await stablePage(this.page);
    await this.checkout.click();
    await stablePage(this.page);
  }

  async applyPromoAndPay(promoCode) {
    await this.promoCodeInput.fill(promoCode);
    await this.applyBtn.click();
    await stablePage(this.page);
    await this.payNow.click();
    await stablePage(this.page);
  }

  async closemodal() {
    await this.closeBtn.click();
    await stablePage(this.page);
  }

  async startAssessment() {
    await stablePage(this.page);
    await this.startAssessmentBtn.click();
    await stablePage(this.page);
    await this.startNow.click();
    await stablePage(this.page);
  }

  async BeginAssessment() {
    await this.beginAssessment.click();
    await stablePage(this.page);
    await this.saveLanguage.click();
    await stablePage(this.page);
  }
}
