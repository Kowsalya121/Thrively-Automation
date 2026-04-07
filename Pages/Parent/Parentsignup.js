export class Parentsignup {
  constructor(page) {
    this.page = page;

    // Common
    this.menu = page.locator('guest-side-menu').getByRole('img');
    this.parents = page.getByText('Parents');

    // Signup
    this.signupNow = page.getByRole('link', { name: 'Sign up now' });
    this.emailInput = page.getByRole('textbox', { name: 'johndoe@gmail.com' });
    this.continueBtn = page.getByRole('button', { name: 'Continue', exact: true });

    this.firstName = page.getByRole('textbox', { name: 'First Name' });
    this.lastName = page.getByRole('textbox', { name: 'Last Name Password' });
    this.password = page.getByRole('textbox', { name: 'Password', exact: true });

    this.createAccountBtn = page.getByRole('button', { name: 'Create account' });

    // Purchase flow
    this.exploreStrengths = page.getByText('Explore the Strengths');
    this.buyNowBtn = page.locator('//a[text()="$24.99 – Buy now"]');
    this.promoInput = page.getByRole('textbox', { name: 'Promo Code' });
    this.applyBtn = page.getByRole('button', { name: 'Apply' });
    this.paymentEmail = page.getByRole('textbox', { name: 'Email *' });
    this.payNowBtn = page.getByRole('button', { name: 'Pay Now' });


    // Child
    this.childFirstName = page.getByRole('textbox', { name: "Child's Name" });
    this.childLastName = page.getByRole('textbox', { name: 'Last Name' });
    this.childUsername = page.getByRole('textbox', { name: 'Create a username for your' });
    this.childPassword = page.getByRole('textbox', { name: 'Choose a password for your' });
    //this.childage = page.locator('xpath=//select[@id="age"]');
    this.ageDropdown = page.getByRole('combobox');
  }

  async goto() {
    await this.page.goto('https://qa.thrively.com/ng/#/classroom');
  }

  async openParents() {
    await this.menu.click();
    await this.parents.click();
  }

  async openSignup() {
    await this.signupNow.click();
  }

  async enterEmail(email) {
    await this.emailInput.fill(email);
  }

  async continue() {
    await this.continueBtn.click();
  }

  async fillParentDetails(first, last, password) {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.password.fill(password);
  }

  async createAccount() {
    await this.createAccountBtn.click();
  }

  // Purchase flow
  async openAssessment() {
    await this.exploreStrengths.click();
    const section = this.page.locator('jumbotron')
      .filter({ hasText: 'Thrively Strengths Assessment' });
    await section.locator(this.buyNowBtn).click();
  }

  async applyPromo(code) {
    await this.promoInput.fill(code);
    await this.applyBtn.click();
  }

  async pay(email) {
    await this.paymentEmail.fill(email);
    await this.payNowBtn.click();
  }

  async addChild(first, last, username, password, age1) {
    await this.childFirstName.fill(first);
    await this.childLastName.fill(last);
    await this.childUsername.fill(username);
    await this.childPassword.fill(password);
    await this.ageDropdown.first().selectOption(age1);
    //await this.childage.fill(age);
    await this.page.getByRole('button', { name: 'Add Child' }).click();
  }
}