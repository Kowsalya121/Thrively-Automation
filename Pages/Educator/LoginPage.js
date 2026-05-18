//import { loginPageUrl } from '../../test-data/testdata';

export class LoginPage {
  constructor(page) {
    this.page = page;

    // Navigation
    this.loginBtn = page.getByText('Login');

    // Modal
    this.loginModal = page.locator('login-modal');
    this.googleBtn = page.getByRole('button', { name: 'Google' });
    this.microsoftBtn = page.getByRole('button', { name: 'Microsoft' });

    this.email = page.getByRole('textbox', { name: 'Email or Username' });
    this.password = page.getByRole('textbox', { name: 'Password' });

    this.signInBtn = page.getByRole('button', { name: 'Sign In' });

    // Account selection
    this.accountHeading = page.getByRole('heading', { name: 'Choose Account' });
    this.dashboardHeading = page.getByRole('heading', { name: 'My Dashboard' });
  }

  async goto() {
    await this.page.goto("https://qa.thrively.com/ng/#/classroom");
  }

  async openLogin() {
    await this.loginBtn.click();
  }

  async login(user) {
    await this.email.fill(user.email);
    await this.password.fill(user.password);
    await this.signInBtn.click();
  }

  async selectSchool(schoolName) {
    await this.page.getByText(schoolName).click();
  }
}