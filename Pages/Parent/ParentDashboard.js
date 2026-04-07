export class ParentDashboard {
    constructor(page) {
      this.page = page;
  
      // Login
      this.loginBtn = page.getByText('Login');
      this.email = page.getByRole('textbox', { name: 'Email or Username' });
      this.password = page.getByRole('textbox', { name: 'Password' });
      this.signInBtn = page.getByRole('button', { name: 'Sign In' });
  
      // Dashboard
      this.parentDashboard = page.locator('parent-dashboard');
  
      // Purchase
      this.childNameInput = page.getByRole('textbox', { name: "Child's Name Age" });
      this.ageDropdown = page.getByRole('combobox');
  
      this.promoTextbox = page.getByRole('textbox', { name: 'Promo Code' });
      this.applyBtn = page.getByRole('button', { name: 'Apply' });
      this.payNowBtn = page.getByRole('button', { name: 'Pay Now' });
  
      // Add Child
      this.lastName = page.getByRole('textbox', { name: 'Last Name' });
      this.username = page.getByRole('textbox', { name: 'Create a username for your' });
      this.childPassword = page.getByRole('textbox', { name: 'Choose a password for your' });
  
      this.addChildBtn = page.getByRole('button', { name: 'Add Child' });
    }
  
    async goto() {
      await this.page.goto('https://qa.thrively.com/ng/#/classroom');
    }
  
    async login(user) {
      await this.loginBtn.click();
  
      await this.email.fill(user.email);
      await this.password.fill(user.password);
      await this.signInBtn.click();
  
    }
  
    async fillChildDetails(data) {
      await this.childNameInput.fill(data.childName());
      await this.ageDropdown.first().selectOption(data.age1);
    
    }
  
    async applyPromo(data) {
      await this.promoTextbox.fill(data.promoCode);
      await this.applyBtn.click();
    }
  
    async addChild(data) {
      await this.lastName.fill('gowda');
      await this.username.fill(data.username());
      await this.childPassword.fill(data.password);
      await this.addChildBtn.click();
    }
  
// 🔁 Carousel (top)
async carouselNavigateTop() {
  await this.page.locator('.slide-nav.nav-right > .slideBtn').first().click();
  await this.page.locator('.slide-nav.nav-right > .slideBtn').first().click();
  await this.page.locator('.slideBtn').first().click();
  await this.page.locator('.slideBtn').first().click();
}
async clickArtistCard() {
  await this.page.locator('cards-overlay')
    .filter({ hasText: 'Artist Create original' })
    .getByRole('img')
    .click();
}
async backFromCareer() {
  await this.page.locator('span').first().click();
}

// 🔁 Life skills carousel
async lifeSkillsCarousel() {
  const right = 'div:nth-child(4) > .carousel > .carousel-outer > .slide-nav.nav-right';
  const left = 'div:nth-child(4) > .carousel > .carousel-outer > .slide-nav.nav-left';

  await this.page.locator(right).click();
  await this.page.locator(right).click();
  await this.page.locator(right).click();

  await this.page.locator(left).click();
  await this.page.locator(left).click();
  await this.page.locator(left).click();
}
async clickLessonCard() {
  await this.page.locator('div:nth-child(4) > .carousel > .carousel-outer > .carousel-container > carousel-slides > cards-overlay > .slides-container > .card > .card-body.p0imp > .card-bg')
    .first()
    .click();
}

async clickOverview() {
  await this.page.getByText('Overview', { exact: true }).click();
}

async backToProfile() {
  await this.page.getByText('Back to Profile').click();
}


  }