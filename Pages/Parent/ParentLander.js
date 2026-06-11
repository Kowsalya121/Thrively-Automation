import { stablePage } from '../../Utility/stablePage.js';

export class ParentLander {
  constructor(page) {
    this.page = page;
  }

  // ── Locators ─────────────────────────────────────────────────────────────

  get menuIcon()          { return this.page.locator('use').nth(1); }
  get parentsOption()     { return this.page.getByText('Parents'); }
  get parentsLander()     { return this.page.locator('parents-lander'); }
  get jumbotron()         { return this.page.locator('jumbotron'); }
  get buyNowBtn()         { return this.page.locator('//a[text()="$24.99 – Buy now"]'); }
  get videoPlayIcons()    { return this.page.locator('.play-icon'); }
  get videoClose()        { return this.page.locator('.vdo-close'); }
  get signupNow()         { return this.page.getByRole('link', { name: 'Sign up now' }); }
  get exploreStrengths()  { return this.page.getByText('Explore the Strengths'); }
  get getStartedButtons() { return this.page.getByText('Get started'); }

  // ── Actions ──────────────────────────────────────────────────────────────

  async goto() {
    await this.page.goto('https://qa.thrively.com/ng/#/classroom', {
      waitUntil: 'domcontentloaded',
    });
    await stablePage(this.page);
  }

  async openParentsSection() {
    await stablePage(this.page);
    await this.menuIcon.click();
    await stablePage(this.page);
    await this.parentsOption.click();
    await stablePage(this.page);
  }

  async playAndCloseVideo(index) {
    await this.videoPlayIcons.nth(index).click();
    await stablePage(this.page);
    await this.videoClose.click();
    await stablePage(this.page);
  }

  getJumbotronByText(text)  { return this.jumbotron.filter({ hasText: text }); }
  getJumbotronCTA(text)     { return this.getJumbotronByText(text).locator('a'); }
  getJumbotronButton(text)  { return this.getJumbotronByText(text).getByRole('button'); }

  async validateNavigationAndGoBack(expectedUrl) {
    await this.page.waitForLoadState('load');
    await this.page.waitForURL(expectedUrl);
    await this.page.goBack();
    await this.page.waitForLoadState('load');
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
}
