export class K2Assessment {
    constructor(page) {
      this.page = page;
  
      // ✅ Login locators
      this.loginBtn = page.getByText('Login');
      this.email = page.getByRole('textbox', { name: 'Email or Username' });
      this.password = page.getByRole('textbox', { name: 'Password' });
      this.signInBtn = page.getByRole('button', { name: 'Sign In' });
  
      // ✅ Child locators
      this.addChildBtn = page.getByRole('button', { name: 'Add a child' });
      this.firstName = page.getByRole('textbox', { name: 'Name', exact: true });
      this.lastName = page.getByRole('textbox', { name: 'Last Name' });
      this.ageDropdown = page.getByLabel('Age');
      this.username = page.getByRole('textbox', { name: 'Username' });
      this.childPassword = page.getByRole('textbox', { name: 'Password' });
      this.addChildSubmit = page.getByRole('button', { name: 'Add Child' });
  
      // ✅ Purchase locators
      this.learnMore = page.locator('thrively-common-score').getByRole('button', { name: 'Learn more' });
      this.buyNow = page.getByRole('button', { name: '$24.99 - Buy now' });
      this.checkout = page.getByRole('button', { name: 'Go to checkout' });
  
      this.promoCodeInput = page.getByRole('textbox', { name: 'Promo Code' });
      this.applyBtn = page.getByRole('button', { name: 'Apply' });
      this.payNow = page.getByRole('button', { name: 'Pay Now' });
      this.purchaseSuccessModal = page.locator('purchase-success');
      this.closeBtn = this.purchaseSuccessModal.getByRole('button', { name: 'Close' });
      //this.closeBtn = page.locator('//button[@type="button"]//span[@aria-hidden="true"]');
      //this.startAssessmentBtn = page.getByText(' Start Assessment ');
      this.startAssessmentBtn = page.locator('thrively-common-score').getByRole('button', { name: 'Start Assessment' });
  
      // ✅ Assessment locators
      this.startNow = page.getByRole('button', { name: 'Start Now' });
      this.beginAssessment = page.getByRole('button', { name: 'Begin Assessment' });
      this.saveLanguage = page.getByRole('button', { name: 'Save' });
    }
  
    async goto() {
      await this.page.goto('https://qa.thrively.com/ng/#/classroom');
    }
  
    async clickLogin() {
      await this.loginBtn.click();
    }
  
    async login(user) {
      await this.email.fill(user.email);
      await this.password.fill(user.password);
      await this.signInBtn.click();
    }
  
    async clickAddChild() {
      await this.addChildBtn.click();
    }
  
    async addChild(child) {
      await this.firstName.fill(child.firstName);
      await this.lastName.fill(child.lastName);
      await this.ageDropdown.selectOption(child.age1);
      await this.username.fill(child.username());
      await this.childPassword.fill(child.password);
      await this.addChildSubmit.click();
    }
  
    async startPurchaseFlow() {
      await this.learnMore.click();
      await this.buyNow.click();
      await this.checkout.click();
    }
  
    async applyPromoAndPay(promoCode) {
      await this.promoCodeInput.fill(promoCode);
      await this.applyBtn.click();
      await this.payNow.click();
    }
  
    async closemodal() {
      await this.closeBtn.click();
    }
  
    async startAssessment() {
      await this.startAssessmentBtn.click();
      await this.startNow.click();
    }
     async BeginAssessment(){
  await this.beginAssessment.click();
  await this.saveLanguage.click();


}

  }