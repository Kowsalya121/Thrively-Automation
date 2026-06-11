import { stablePage } from '../../Utility/stablePage.js';

export class Landerpages {
  constructor(page) { this.page = page; }

  get closeBtn()       { return this.page.getByRole('button', { name: 'Close' }); }
  get overview()       { return this.page.locator('overview'); }
  get whyThrively()    { return this.page.locator('why-thrively'); }
  get strengths()      { return this.page.locator('strengths'); }
  get wellbeing()      { return this.page.locator('well-being'); }
  get hope()           { return this.page.locator('hope'); }
  get agency()         { return this.page.locator('agency'); }
  get pricing()        { return this.page.locator('pricing'); }
  get jumbotron()      { return this.page.locator('jumbotron'); }

  // SSR-SAFE: replaced getByRole('img', { name: 'Every Child Deserves to Thrive' })
  // with the jumbotron section text locator — the image is decorative in SSR and the
  // alt text may be absent or differ; the section heading text is always present.
  get heroSection()    { return this.page.locator('jumbotron').filter({ hasText: 'Every Child Deserves to Thrive' }); }

  get learnMoreBtn()   { return this.page.locator('.mt40.w100p'); }
  get pillarsTab()     { return this.page.locator('tab'); }
  get scheduleCall()   { return this.page.getByRole('link', { name: 'Schedule a Call Today' }); }
  get scheduledemo()   { return this.page.locator('//button[@class="btn-prime-line mr10 btn-demo"]'); }

  // ── Actions ──────────────────────────────────────────────────────────────

  async navigate(url) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await stablePage(this.page);
  }

  async closeModal() {
    await stablePage(this.page);
    await this.closeBtn.click();
    await stablePage(this.page);
  }

  async clickText(text) {
    await this.page.getByText(text).click();
    await stablePage(this.page);
  }

  async clickRole(role, name) {
    await this.page.getByRole(role, { name }).click();
    await stablePage(this.page);
  }

  async fillField(name, value) {
    await this.page.getByRole('textbox', { name }).fill(value);
  }

  async fillNumber(name, value) {
    await this.page.getByRole('spinbutton', { name }).fill(value);
  }

  async clickLearnMore() {
    await this.learnMoreBtn.click();
    await stablePage(this.page);
  }

  // SSR-SAFE: clicks the "Join Thrively Now" CTA text link in the hero section
  // instead of first clicking the hero image — images are not interactive in SSR
  async clickHeroJoin() {
    await this.heroSection.getByText('Join Thrively Now').click();
    await stablePage(this.page);
  }

  async goBack() {
    await this.page.goBack();
    await stablePage(this.page);
  }

  async clickNextPillar() {
    await this.page.getByRole('button', { name: 'Next' }).click();
    await stablePage(this.page);
  }
}
