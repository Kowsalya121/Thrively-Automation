export class HopeAudit{
    constructor(page) {
      this.page = page;
  
      // Lander
      this.heading = page.locator('h1');
      this.lander = page.locator('hope-audit-lander');
      this.talkToUs = page.getByRole('button', { name: 'Talk to Us' });
      this.takeSurvey = page.getByRole('button', { name: 'Take Hope Culture Survey' });
  
      // Signup
      this.signUpStart = page.getByRole('button', { name: 'Sign Up to Start Survey' });
      this.googleBtn = page.getByRole('button', { name: 'Google' });
      this.microsoftBtn = page.getByRole('button', { name: 'Microsoft' });
  
      this.firstName = page.getByRole('textbox', { name: 'First Name' });
      this.lastName = page.getByRole('textbox', { name: 'Last Name' });
      this.email = page.getByRole('textbox', { name: 'Email' });
      this.password = page.getByRole('textbox', { name: 'Password' });
      this.school = page.getByRole('textbox', { name: 'District/School' });
  
      this.signUpBtn = page.getByRole('button', { name: 'Sign Up' });
  
      // Invite
      this.inviteFirstName = page.getByRole('textbox', { name: 'First Name' }).first();
      this.inviteLastName = page.getByRole('textbox', { name: 'Last Name' }).first();
      this.inviteEmail = page.getByRole('textbox', { name: 'Email' }).first();
      this.inviteBtn = page.getByRole('button', { name: 'Invite Team' });
  
      // Common
      this.nextBtn = page.getByRole('button', { name: 'Next' });
    }
  
    async goto() {
      await this.page.goto('https://qa.thrively.com/ng/#/hope-audit');
    }
  
    async clickTalkToUs() {
      await this.talkToUs.click();
    }
  
    async startSurvey() {
      await this.takeSurvey.click();
      await this.signUpStart.click();
    }
  
    async signup(user) {
      await this.firstName.fill(user.firstName);
      await this.lastName.fill(user.lastName);
      await this.email.fill(user.email());
      await this.password.fill(user.password);
      await this.school.fill(user.school);
      await this.signUpBtn.click();
    }
  
    async invite(user) {
      await this.inviteFirstName.fill(user.firstName);
      await this.inviteLastName.fill(user.lastName);
      await this.inviteEmail.fill(user.email());
      await this.inviteBtn.click();
    }
  
    async selectRating(text) {
      await this.page.getByText(text).click();
    }
  
    async clickNext() {
      await this.nextBtn.click();
    }
  }