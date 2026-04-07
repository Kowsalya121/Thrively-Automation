export class StudentSignup {
  constructor(page) {
    this.page = page;

    // Navigation
    this.menuIcon = page.locator('guest-side-menu').getByRole('img');
    this.studentsTab = page.getByText('Students', { exact: true });
    this.joinFree = page.getByText('Join For Free Today');

    // Signup
    this.heading = page.getByRole('heading');
    this.registration = page.locator('registration');

    this.googleBtn = page.getByRole('button', { name: 'Sign up with Google' });
    this.microsoftBtn = page.getByRole('button', { name: 'Sign up with Microsoft' });
    this.emailSignupBtn = page.getByRole('button', { name: 'Sign up with Email' });

    // DOB
    this.day = page.getByRole('combobox').first();
    this.month = page.getByRole('combobox').nth(1);
    this.year = page.getByRole('combobox').nth(2);

    // Form
    this.firstName = page.getByRole('textbox', { name: 'First Name' });
    this.lastName = page.getByRole('textbox', { name: 'Last Name' });
    this.email = page.getByRole('textbox', { name: 'Email Address' });
    this.password = page.getByRole('textbox', { name: 'Password', exact: true });
    this.retypePassword = page.getByRole('textbox', { name: 'Retype Password' });

    this.signupBtn = page.getByRole('button', { name: 'Sign Up for Free' });

    // Invite
    this.inviteTextbox = page.getByRole('textbox', { name: 'Enter Invite Code' });
    this.submitBtn = page.getByRole('button', { name: 'Submit' });

    // Common
    this.nextBtn = page.getByRole('button', { name: 'Next' });
  }

  async goto() {
    await this.page.goto('https://qa.thrively.com/ng/#/classroom');
  }

  async openStudentSignup() {
    await this.menuIcon.click();
    await this.studentsTab.click();
    await this.joinFree.click();
  }

  async clickEmailSignup() {
    await this.emailSignupBtn.click();
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
  }

  async enterInviteCode(code) {
    await this.inviteTextbox.fill(code);
  }

  async submitInvite() {
    await this.submitBtn.click();
  }

  async clickNext() {
    await this.nextBtn.click();
  }
}