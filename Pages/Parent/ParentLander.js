export class ParentLander {
  constructor(page) {
    this.page = page;

    // ===== Navigation =====
    this.menuIcon = page.locator('use').nth(1);
    this.parentsOption = page.getByText('Parents');

    // ===== Main container =====
    this.parentsLander = page.locator('parents-lander');

    // ===== Common Sections =====
    this.jumbotron = page.locator('jumbotron');
    this.buyNowBtn = page.locator('//a[text()="$24.99 – Buy now"]');

    // ===== Videos =====
    this.videoPlayIcons = page.locator('.play-icon');
    this.videoClose = page.locator('.vdo-close');

    // ===== CTA buttons =====
    this.signupNow = page.getByRole('link', { name: 'Sign up now' });
    this.exploreStrengths = page.getByText('Explore the Strengths');

    // ===== Reusable Locators =====
    this.getStartedButtons = page.getByText('Get started');
  }

  // ===== Navigation =====
  async goto() {
    await this.page.goto('https://qa.thrively.com/ng/#/classroom');
  }

  async openParentsSection() {
    await this.menuIcon.click();
    await this.parentsOption.click();
  }

  // ===== Video Actions =====
  async playAndCloseVideo(index) {
    await this.videoPlayIcons.nth(index).click();
    await this.videoClose.click();
  }

  // ===== Reusable Jumbotron Helpers =====

  getJumbotronByText(text) {
    return this.jumbotron.filter({ hasText: text });
  }

  getJumbotronCTA(text) {
    return this.getJumbotronByText(text).locator('a');
  }

  getJumbotronButton(text) {
    return this.getJumbotronByText(text).getByRole('button');
  }

  // ===== Navigation Validation =====
  async validateNavigationAndGoBack(expectedUrl) {
    await this.page.waitForLoadState('load');
    await this.page.waitForURL(expectedUrl);
    await this.page.goBack();
    await this.page.waitForLoadState('load');
  }
  async openAssessment() {
    await this.exploreStrengths.click();
    const section = this.page.locator('jumbotron')
      .filter({ hasText: 'Thrively Strengths Assessment' });
    await section.locator(this.buyNowBtn).click();
  }

}