import { stablePage } from '../../Utility/stablePage.js';

export class CheckInPage {
  constructor(page) {
    this.page = page;
  }

  // ── Locators ─────────────────────────────────────────────────────────────

  get loginText()      { return this.page.getByText('Login'); }
  get usernameInput()  { return this.page.getByRole('textbox', { name: 'Email or Username' }); }
  get passwordInput()  { return this.page.getByRole('textbox', { name: 'Password' }); }
  get signInBtn()      { return this.page.getByRole('button', { name: 'Sign In' }); }

  // Hope section
  get hopeMenu()       { return this.page.locator("xpath=//span[text()= ' Hope ']/..");}
  get hopeSection()    { return this.page.locator('#hopeSection'); }
  get takeSurveyBtn()  { return this.page.getByRole('button', { name: 'Take Hope Survey' }); }

  // Video
  get youtubeFrame()   { return this.page.locator('iframe[title="YouTube video player"]'); }
  get hopeVideoFrame() { return this.page.locator('iframe[title="Hope for Staff"]'); }

  // Survey
  get startBtn()       { return this.page.getByRole('button', { name: 'Start' }); }
  get question()       { return this.page.locator('thrively-step'); }
  get slider()         { return this.page.getByRole('slider'); }
  get nextBtn()        { return this.page.getByRole('button', { name: 'Next' }); }
  get backBtn()        { return this.page.getByRole('button', { name: 'Back' }); }
  get finishBtn()      { return this.page.getByRole('button', { name: 'Finish' }); }

  // Text area
  get richTextFrame()  { return this.page.locator('iframe[title="Rich Text Area"]'); }

  // Result
  get hopeAssessment() { return this.page.locator('hope-assessment'); }
  get doneBtn()        { return this.page.getByRole('button', { name: 'Done' }); }

  // ── Actions ──────────────────────────────────────────────────────────────

  async goto() {
    await this.page.goto('https://qa.thrively.com/ng/#/classroom', {
      waitUntil: 'domcontentloaded',
    });
    await stablePage(this.page);
  }

  async login(user) {
    await stablePage(this.page);
    await this.loginText.click();
    await stablePage(this.page);
    await this.usernameInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.signInBtn.click();
    await stablePage(this.page);
  }

  async openHopeTab() {
    await stablePage(this.page);
    await this.hopeMenu.click();
    await stablePage(this.page);
  }

  async clickTakeSurvey() {
    await stablePage(this.page);
    await this.takeSurveyBtn.click();
    await stablePage(this.page);
  }

  async playVideo() {
    await this.youtubeFrame
      .contentFrame()
      .getByRole('button', { name: 'Play video' })
      .click();
  }

  async getVideoTitleText() {
    return this.hopeVideoFrame
      .contentFrame()
      .locator('embedded-player-video-details')
      .textContent();
  }

  async clickStart() {
    await stablePage(this.page);
    await this.startBtn.click();
    await stablePage(this.page);
  }

  async answer(value) {
    await this.slider.fill(value);
    await this.nextBtn.click();
    await stablePage(this.page);
  }

  async goBack() {
    await this.backBtn.click();
    await stablePage(this.page);
  }

  async clickFinish() {
    await this.finishBtn.click();
    await stablePage(this.page);
  }

  async enterReflection(text) {
    const frame = this.richTextFrame.contentFrame();
    await frame.getByLabel('Rich Text Area. Press ALT-0').fill(text);
  }

  async clickDone() {
    await this.doneBtn.click();
    await stablePage(this.page);
  }

  async clickHopeVideo() {
    await this.page
      .locator(
        '#hopeSection > empty-state-action-card > .empty-state > .flex-v-center > .min-w255 > div > .vdo-overlay'
      )
      .click();
  }
}
