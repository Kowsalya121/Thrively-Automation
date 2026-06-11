import { stablePage } from '../../Utility/stablePage.js';

export class LoginPage {
  constructor(page) {
    this.page = page;
  }

  // ── Locators (getters — evaluated lazily, SSR-safe) ──────────────────────

  get loginBtn()         { return this.page.getByText('Login'); }
  get loginModal()       { return this.page.locator('login-modal'); }
  get googleBtn()        { return this.page.getByRole('button', { name: 'Google' }); }
  get microsoftBtn()     { return this.page.getByRole('button', { name: 'Microsoft' }); }
  get email()            { return this.page.getByRole('textbox', { name: 'Email or Username' }); }
  get password()         { return this.page.getByRole('textbox', { name: 'Password' }); }
  get signInBtn()        { return this.page.getByRole('button', { name: 'Sign In' }); }
  get accountHeading()   { return this.page.getByRole('heading', { name: 'Choose Account' }); }
  get dashboardHeading() { return this.page.getByRole('heading', { name: 'My Dashboard' }); }

  // ── Actions ──────────────────────────────────────────────────────────────

  async goto() {
    await this.page.goto('https://thrively-ssr.thrively.com/classroom', {
      waitUntil: 'domcontentloaded',
    });
    await stablePage(this.page);
  }

  async openLogin() {
    await stablePage(this.page);
    await this.loginBtn.click();
    await stablePage(this.page);
  }

  async login(user) {
    await stablePage(this.page);
    await this.email.fill(user.email);
    await this.password.fill(user.password);
    await this.signInBtn.click();
    await stablePage(this.page);
  }

  async selectSchool(schoolName) {
    await stablePage(this.page);
    await this.page.getByText(schoolName).click();
    await stablePage(this.page);
  }
}
