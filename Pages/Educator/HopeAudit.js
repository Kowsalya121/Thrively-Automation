import { stablePage } from '../../Utility/stablePage.js';

export class HopeAudit {
  constructor(page) {
    this.page = page;
  }

  // ── Locators ─────────────────────────────────────────────────────────────

  get heading()        { return this.page.locator('h1'); }
  get lander()         { return this.page.locator('hope-audit-lander'); }
  get talkToUs()       { return this.page.getByRole('button', { name: 'Talk to Us' }); }
  get takeSurvey()     { return this.page.getByRole('button', { name: 'Take Hope Culture Survey' }); }
  get signUpStart()    { return this.page.getByRole('button', { name: 'Sign Up to Start Survey' }); }
  get googleBtn()      { return this.page.getByRole('button', { name: 'Google' }); }
  get microsoftBtn()   { return this.page.getByRole('button', { name: 'Microsoft' }); }
  get firstName()      { return this.page.getByRole('textbox', { name: 'First Name' }); }
  get lastName()       { return this.page.getByRole('textbox', { name: 'Last Name' }); }
  get email()          { return this.page.getByRole('textbox', { name: 'Email' }); }
  get password()       { return this.page.getByRole('textbox', { name: 'Password' }); }
  get school()         { return this.page.getByRole('textbox', { name: 'District/School' }); }
  get signUpBtn()      { return this.page.getByRole('button', { name: 'Sign Up' }); }
  get inviteFirstName(){ return this.page.getByRole('textbox', { name: 'First Name' }).first(); }
  get inviteLastName() { return this.page.getByRole('textbox', { name: 'Last Name' }).first(); }
  get inviteEmail()    { return this.page.getByRole('textbox', { name: 'Email' }).first(); }
  get inviteBtn()      { return this.page.getByRole('button', { name: 'Invite Team' }); }
  get nextBtn()        { return this.page.getByRole('button', { name: 'Next' }); }

  // ── Actions ──────────────────────────────────────────────────────────────

  async goto() {
    await this.page.goto('https://qa.thrively.com/ng/#/hope-audit', {
      waitUntil: 'domcontentloaded',
    });
    await stablePage(this.page);
  }

  async clickTalkToUs() {
    await stablePage(this.page);
    await this.talkToUs.click();
    await stablePage(this.page);
  }

  async startSurvey() {
    await stablePage(this.page);
    await this.takeSurvey.click();
    await stablePage(this.page);
    await this.signUpStart.click();
    await stablePage(this.page);
  }

  async signup(user) {
    await this.firstName.fill(user.firstName);
    await this.lastName.fill(user.lastName);
    await this.email.fill(user.email());
    await this.password.fill(user.password);
    await this.school.fill(user.school);
    await this.signUpBtn.click();
    await stablePage(this.page);
  }

  async invite(user) {
    await this.inviteFirstName.fill(user.firstName);
    await this.inviteLastName.fill(user.lastName);
    await this.inviteEmail.fill(user.email());
    await this.inviteBtn.click();
    await stablePage(this.page);
  }

  async selectRating(text) {
    await this.page.getByText(text).click();
  }

  async clickNext() {
    await this.nextBtn.click();
    await stablePage(this.page);
  }
}
