import { stablePage } from '../../Utility/stablePage.js';

export class ParentDashboard {
  constructor(page) {
    this.page = page;
  }

  // ── Locators ─────────────────────────────────────────────────────────────

  get loginBtn()       { return this.page.getByText('Login'); }
  get email()          { return this.page.getByRole('textbox', { name: 'Email or Username' }); }
  get password()       { return this.page.getByRole('textbox', { name: 'Password' }); }
  get signInBtn()      { return this.page.getByRole('button', { name: 'Sign In' }); }
  get parentDashboard(){ return this.page.locator('parent-dashboard'); }
  get childNameInput() { return this.page.getByRole('textbox', { name: "Child's Name Age" }); }
  get ageDropdown()    { return this.page.getByRole('combobox'); }
  get promoTextbox()   { return this.page.getByRole('textbox', { name: 'Promo Code' }); }
  get applyBtn()       { return this.page.getByRole('button', { name: 'Apply' }); }
  get payNowBtn()      { return this.page.getByRole('button', { name: 'Pay Now' }); }
  get lastName()       { return this.page.getByRole('textbox', { name: 'Last Name' }); }
  get username()       { return this.page.getByRole('textbox', { name: 'Create a username for your' }); }
  get childPassword()  { return this.page.getByRole('textbox', { name: 'Choose a password for your' }); }
  get addChildBtn()    { return this.page.getByRole('button', { name: 'Add Child' }); }

  // ── Actions ──────────────────────────────────────────────────────────────

  async goto() {
    await this.page.goto('https://qa.thrively.com/ng/#/classroom', {
      waitUntil: 'domcontentloaded',
    });
    await stablePage(this.page);
  }

  async login(user) {
    await stablePage(this.page);
    await this.loginBtn.click();
    await stablePage(this.page);
    await this.email.fill(user.email);
    await this.password.fill(user.password);
    await this.signInBtn.click();
    await stablePage(this.page);
  }

  async fillChildDetails(data) {
    await this.childNameInput.fill(data.childName());
    await this.ageDropdown.first().selectOption(data.age1);
  }

  async applyPromo(data) {
    await this.promoTextbox.fill(data.promoCode);
    await this.applyBtn.click();
    await stablePage(this.page);
  }

  async addChild(data) {
    await this.lastName.fill('gowda');
    await this.username.fill(data.username());
    await this.childPassword.fill(data.password);
    await this.addChildBtn.click();
    await stablePage(this.page);
  }

  async carouselNavigateTop() {
    await this.page.locator('.slide-nav.nav-right > .slideBtn').first().click();
    await this.page.locator('.slide-nav.nav-right > .slideBtn').first().click();
    await this.page.locator('.slideBtn').first().click();
    await this.page.locator('.slideBtn').first().click();
    await stablePage(this.page);
  }

  async clickArtistCard() {
    await this.page
      .locator('cards-overlay')
      .filter({ hasText: 'Artist Create original' })
      .getByRole('img')
      .click();
    await stablePage(this.page);
  }

  async backFromCareer() {
    await this.page.locator('span').first().click();
    await stablePage(this.page);
  }

  async lifeSkillsCarousel() {
    const right = 'div:nth-child(4) > .carousel > .carousel-outer > .slide-nav.nav-right';
    const left  = 'div:nth-child(4) > .carousel > .carousel-outer > .slide-nav.nav-left';
    for (let i = 0; i < 3; i++) {
      await this.page.locator(right).click();
      await stablePage(this.page);
    }
    for (let i = 0; i < 3; i++) {
      await this.page.locator(left).click();
      await stablePage(this.page);
    }
  }

  async clickLessonCard() {
    await this.page
      .locator(
        'div:nth-child(4) > .carousel > .carousel-outer > .carousel-container > carousel-slides > cards-overlay > .slides-container > .card > .card-body.p0imp > .card-bg'
      )
      .first()
      .click();
    await stablePage(this.page);
  }

  async clickOverview() {
    await this.page.getByText('Overview', { exact: true }).click();
    await stablePage(this.page);
  }

  async backToProfile() {
    await this.page.getByText('Back to Profile').click();
    await stablePage(this.page);
  }
}
