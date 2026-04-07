export class CheckInPage {
  constructor(page) {
    this.page = page;

    // ===== LOGIN =====
    this.loginText = page.getByText('Login');
    this.usernameInput = page.getByRole('textbox', { name: 'Email or Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInBtn = page.getByRole('button', { name: 'Sign In' });

    // ===== HOPE SECTION =====
    this.hopeMenu = page.locator("xpath=//span[text()= ' Hope ']/..");
    this.hopeSection = page.locator('#hopeSection');
    this.takeSurveyBtn = page.getByRole('button', { name: 'Take Hope Survey' });
    //this.HopeVideo = page.locator('#hopeSection > empty-state-action-card > .empty-state > .flex-v-center > .min-w255 > div > .vdo-overlay').click();
    //this.closevideo =page.locator('xpath=//span[@class="vdo-close blk"]');

    // ===== VIDEO =====
    this.youtubeFrame = page.locator('iframe[title="YouTube video player"]');
    this.hopeVideoFrame = page.locator('iframe[title="Hope for Staff"]');

    // ===== SURVEY =====
    this.startBtn = page.getByRole('button', { name: 'Start' });
    this.question = page.locator('thrively-step');
    this.slider = page.getByRole('slider');
    this.nextBtn = page.getByRole('button', { name: 'Next' });
    this.backBtn = page.getByRole('button', { name: 'Back' });
    this.finishBtn = page.getByRole('button', { name: 'Finish' });

    // ===== TEXT AREA =====
    this.richTextFrame = page.locator('iframe[title="Rich Text Area"]');

    // ===== RESULT =====
    this.hopeAssessment = page.locator('hope-assessment');
    this.doneBtn = page.getByRole('button', { name: 'Done' });
  }

  async goto() {
    await this.page.goto('https://qa.thrively.com/ng/#/classroom');
  }

  async login(user) {
    await this.loginText.click();
    await this.usernameInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.signInBtn.click();
  }

  async openHopeTab() {
    await this.hopeMenu.click();
  }

  async clickTakeSurvey() {
    await this.takeSurveyBtn.click();
  }

  async playVideo() {
    await this.youtubeFrame
      .contentFrame()
      .getByRole('button', { name: 'Play video' })
      .click();
  }

  async getVideoTitleText() {
    return await this.hopeVideoFrame.contentFrame().locator('embedded-player-video-details').textContent();
  }

  async clickStart() {
    await this.startBtn.click();
  } 

  async answer(value) {
    await this.slider.fill(value);
    await this.nextBtn.click();
  }

  async goBack() {
    await this.backBtn.click();
  }

  async clickFinish() {
    await this.finishBtn.click();
  }

  async enterReflection(text) {
    const frame = this.richTextFrame.contentFrame();
    await frame.getByLabel('Rich Text Area. Press ALT-0').fill(text);
  }

  async clickDone() {
    await this.doneBtn.click();
  }
  async clickHopeVideo(){
    await this.page.locator('#hopeSection > empty-state-action-card > .empty-state > .flex-v-center > .min-w255 > div > .vdo-overlay').click(); 
  }
  async closeVideoModal() {
    await this.closevideo.click();
  }

}

