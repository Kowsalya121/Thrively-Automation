export class WebinarPage {
  constructor(page) {
    this.page = page;

    // Lander
    this.heading = page.getByRole('heading', { name: 'Stronger Together: Using' });
    this.signupModal = page.locator('signup-to-watch');

    this.signUpHereBtn = page.getByRole('button', { name: 'Sign Up Here' });

    // Register
    this.register = page.locator('register');
    this.googleBtn = page.getByRole('button', { name: 'Google' });
    this.microsoftBtn = page.getByRole('button', { name: 'Microsoft' });

    // Form
    this.email = page.getByRole('textbox', { name: 'Email Address', exact: true });
    this.confirmEmail = page.getByRole('textbox', { name: 'Confirm Email Address' });
    this.firstName = page.getByRole('textbox', { name: 'First Name' });
    this.lastName = page.getByRole('textbox', { name: 'Last Name' });
    this.password = page.getByRole('textbox', { name: 'Password' });

    this.schoolTextbox = page.getByRole('textbox', { name: 'Enter School or District Name' });

    this.gradeDropdown = page.getByRole('combobox').first();

    this.completeRegistration = page.getByRole('button', { name: 'Complete Registration' });

    // Onboarding
    this.nextBtn = page.getByRole('button', { name: 'Next' });
  }

  async goto() {
    await this.page.goto('https://qa.thrively.com/ng/#/webinars');
  }

  async openWebinar() {
    await this.heading.click();
  }

  async clickSignup() {
    await this.signUpHereBtn.click();
  }

  async fillSignup(user) {
    const email = user.email();

    await this.email.fill(email);
    await this.confirmEmail.fill(email);

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
  }

  async completeRegistrationFlow(user) {
    await this.gradeDropdown.selectOption(user.grade);
    await this.completeRegistration.click();
  }

  async clickNext() {
    await this.nextBtn.click();
  }
}