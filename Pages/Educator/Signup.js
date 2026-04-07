
export class Signup {
  constructor(page) {
    this.page = page;

    // Locators
    this.joinForFree = page.getByText('Join for Free');
    this.email = page.getByRole('textbox', { name: 'Email Address' });
    this.password = page.getByRole('textbox', { name: 'Password' });
    this.firstName = page.getByRole('textbox', { name: 'First Name' });
    this.lastName = page.getByRole('textbox', { name: 'Last Name' });
    this.roleDropdown = page.getByRole('combobox');
    this.signUpBtn = page.getByRole('button', { name: 'Sign Up for Free' });

    this.schoolSearch = page.getByRole('textbox', { name: 'Enter School or District Name' });
    this.doneBtn = page.getByRole('button', { name: 'Done' });

    this.nextBtn = page.getByRole('button', { name: 'Next' });
    this.finishBtn = page.getByRole('button', { name: 'Finish Personalizing Thrively' });
    this.skipBtn = page.getByText('Skip');
    this.goToDashboard = page.getByRole('button', { name: 'Go To Dashboard' });
  }

  async goto() {
    await this.page.goto('https://qa.thrively.com/ng/#/classroom');
  }

  async clickJoinForFree() {
    await this.joinForFree.click();
  }

  async fillSignupForm(email, password, firstName, lastName) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
  }

  async selectAge(value) {
    await this.roleDropdown.selectOption(value);
  }

  async submitSignup() {
    await this.signUpBtn.click();
  }

  async searchAndSelectSchool(schoolName, schoolOption) {
    await this.schoolSearch.fill(schoolName);
    await this.page.getByText(schoolOption).click();
  }

  async clickDone() {
    await this.doneBtn.click();
  }

  async clickNext() {
    await this.nextBtn.click();
  }

  async selectRole(role) {
    await this.roleDropdown.selectOption(role);
  }

  async selectInterest(interest) {
    await this.page.getByRole('checkbox', { name: interest }).check();
  }

  async finishPersonalization() {
    await this.finishBtn.click();
  }

  async skipVerification() {
    await this.skipBtn.click();
  }


  
  getOnboardingModal() {
    return this.page.locator('teacher-onboarding-guide-modal');
  }

  getCommonCard() {
    return this.page.locator('.w300');
  }

  getImageContainer() {
    return this.page.locator('.img-container');
  }


  async goToDashboardClick() {
    await this.goToDashboard.click();
  }


}


