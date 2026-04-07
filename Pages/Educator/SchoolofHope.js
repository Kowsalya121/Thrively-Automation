export class SchoolofHope {
  constructor(page) {
    this.page = page;

    // Common Locators
    this.heading = page.getByRole('heading');
    this.textbox = page.getByRole('textbox');
    this.paragraph = page.getByRole('paragraph');
    this.slider = page.getByRole('slider');
    this.nextBtn = page.getByRole('button', { name: 'Next' });
    this.finishBtn = page.getByRole('button', { name: 'Finish' });

    // Specific Locators
    this.codeInput = page.getByRole('textbox');
    this.letsGoBtn = page.getByRole('button', { name: "Let's Go" });
    this.googleBtn = page.getByRole('button', { name: 'Google' });
    this.microsoftBtn = page.getByRole('button', { name: 'Microsoft' });
    this.continueEmailBtn = page.getByRole('button', { name: 'Continue with email' });
    this.signupBtn = page.getByRole('button', { name: 'Sign up & start survey' });

    this.firstName = page.getByRole('textbox', { name: 'First Name' });
    this.lastName = page.getByRole('textbox', { name: 'Last Name Email Address' });
    this.email = page.locator('#reg_email');

    this.hopeResult = page.locator('pd-hope-result');
  }

  async goto() {
    await this.page.goto('https://qa.thrively.com/ng/#/schoolofhope');
  }

  async enterCode(code) {
    await this.codeInput.fill(code);
  }

  async clickLetsGo() {
    await this.letsGoBtn.click();
  }

  async clickMicrosoft() {
    await this.microsoftBtn.click();
  }

  async clickContinueWithEmail() {
    await this.continueEmailBtn.click();
  }

  async fillSignup(first, last, email) {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.email.fill(email);
  }

  async submitSignup() {
    await this.signupBtn.click();
  }

  async answerQuestion(value) {
    await this.slider.fill(value);
    await this.nextBtn.click();
  }

  async clickNext() {
    await this.nextBtn.click();
  }

  async clickFinish() {
    await this.finishBtn.click();
  }

  async clickStartNow() {
    await this.page.getByRole('button', { name: 'Start Now' }).click();
  }

  async clickScheduleDemo() {
    await this.page.getByRole('button', { name: 'Schedule a Demo' }).click();
  }
}