


export class Landerpages {
  constructor(page) {
    this.page = page;

    // Common
    this.closeBtn = page.getByRole('button', { name: 'Close' });

    // Sections
    this.overview = page.locator('overview');
    this.whyThrively = page.locator('why-thrively');
    this.strengths = page.locator('strengths');
    this.wellbeing = page.locator('well-being');
    this.hope = page.locator('hope');
    this.agency = page.locator('agency');
    this.pricing = page.locator('pricing');

    // Overview specific
    this.jumbotron = page.locator('jumbotron');
    this.heroImage = page.getByRole('img', { name: 'Every Child Deserves to Thrive' });
    this.learnMoreBtn = page.locator('.mt40.w100p');

    // Why Thrively
    this.pillarsTab = page.locator('tab');

    // Common CTA
    this.scheduleCall = page.getByRole('link', { name: 'Schedule a Call Today' });
    this.scheduledemo = page.locator('//button[@class="btn-prime-line mr10 btn-demo"]');
  }

  async navigate(url) {
    await this.page.goto(url);
  }

  async closeModal() {
    await this.closeBtn.click();
  }

  async clickText(text) {
    await this.page.getByText(text).click();
  }

  async clickRole(role, name) {
    await this.page.getByRole(role, { name }).click();
  }

  async fillField(name, value) {
    await this.page.getByRole('textbox', { name }).fill(value);
  }

  async fillNumber(name, value) {
    await this.page.getByRole('spinbutton', { name }).fill(value);
  }

  async clickLearnMore() {
    await this.learnMoreBtn.click();
  }

  async clickHeroJoin() {
    await this.heroImage.click();
    await this.page.getByText('Join Thrively Now').click();
  }

  async goBack() {
    await this.page.goBack();
  }

  async clickNextPillar() {
    await this.page.getByRole('button', { name: 'Next' }).click();
  }
}