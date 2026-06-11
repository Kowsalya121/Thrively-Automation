import { stablePage } from '../../Utility/stablePage.js';

export class SchoolofHope {
  constructor(page) {
    this.page = page;
  }

  // ── Locators ─────────────────────────────────────────────────────────────

  get heading()          { return this.page.getByRole('heading'); }
  get textbox()          { return this.page.getByRole('textbox'); }
  get paragraph()        { return this.page.getByRole('paragraph'); }
  get slider()           { return this.page.getByRole('slider'); }
  get nextBtn()          { return this.page.getByRole('button', { name: 'Next' }); }
  get finishBtn()        { return this.page.getByRole('button', { name: 'Finish' }); }
  get codeInput()        { return this.page.getByRole('textbox'); }
  get letsGoBtn()        { return this.page.getByRole('button', { name: "Let's Go" }); }
  get googleBtn()        { return this.page.getByRole('button', { name: 'Google' }); }
  get microsoftBtn()     { return this.page.getByRole('button', { name: 'Microsoft' }); }
  get continueEmailBtn() { return this.page.getByRole('button', { name: 'Continue with email' }); }
  get signupBtn()        { return this.page.getByRole('button', { name: 'Sign up & start survey' }); }
  get firstName()        { return this.page.getByRole('textbox', { name: 'First Name' }); }
  get lastName()         { return this.page.getByRole('textbox', { name: 'Last Name Email Address' }); }
  get email()            { return this.page.locator('#reg_email'); }
  get hopeResult()       { return this.page.locator('pd-hope-result'); }

  // ── Actions ──────────────────────────────────────────────────────────────

  async goto() {
    await this.page.goto('https://thrively-ssr.thrively.com/hope', {
      waitUntil: 'domcontentloaded',
    });
    await stablePage(this.page);
  }

  async enterCode(code) {
    await this.codeInput.fill(code);
  }

  async clickLetsGo() {
    await this.letsGoBtn.click();
    await stablePage(this.page);
  }

  async clickMicrosoft() {
    await this.microsoftBtn.click();
    await stablePage(this.page);
  }

  async clickContinueWithEmail() {
    await this.continueEmailBtn.click();
    await stablePage(this.page);
  }

  async fillSignup(first, last, emailVal) {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.email.fill(emailVal);
  }

  async submitSignup() {
    await this.signupBtn.click();
    await stablePage(this.page);
  }

  async answerQuestion(value) {
    await this.slider.fill(value);
    await this.nextBtn.click();
    await stablePage(this.page);
  }

  async clickNext() {
    await this.nextBtn.click();
    await stablePage(this.page);
  }

  async clickFinish() {
    await this.finishBtn.click();
    await stablePage(this.page);
  }

  async clickStartNow() {
    await this.page.getByRole('button', { name: 'Start Now' }).click();
    await stablePage(this.page);
  }

  async clickScheduleDemo() {
    await this.page.getByRole('button', { name: 'Schedule a Demo' }).click();
    await stablePage(this.page);
  }
}
