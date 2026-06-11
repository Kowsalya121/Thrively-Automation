import { stablePage } from '../../Utility/stablePage.js';

export class DemoQuotePage {
  constructor(page) {
    this.page = page;
  }

  // ── Locators ─────────────────────────────────────────────────────────────

  get scheduleDemoBtn()  { return this.page.getByRole('button', { name: 'Schedule a Demo' }); }
  get requestQuoteBtn()  { return this.page.getByRole('button', { name: 'Request a Quote' }); }
  get nameInput()        { return this.page.getByRole('textbox', { name: 'First Name & Last Name *' }); }
  get emailInput()       { return this.page.getByRole('textbox', { name: 'Your Email Address *' }); }
  get phoneInput()       { return this.page.getByRole('textbox', { name: 'Phone Number' }); }
  get schoolInput()      { return this.page.getByRole('textbox', { name: 'School or District *' }); }
  get studentsInput()    { return this.page.getByRole('spinbutton', { name: 'Number of Students *' }); }
  get descriptionInput() { return this.page.getByRole('textbox', { name: 'Description' }); }
  get submitBtn()        { return this.page.getByRole('dialog').getByRole('button', { name: /Schedule a Demo|Request a Quote/ }); }
  get form()             { return this.page.locator('inquiry-contact-form'); }
  get success()          { return this.page.locator('.wh100p'); }
  get scheduleNowLink()  { return this.page.getByRole('link', { name: 'Schedule now' }); }
  get learnMoreLinks()   { return this.page.getByRole('link', { name: 'Learn More' }); }

  // ── Actions ──────────────────────────────────────────────────────────────

  async goto() {
    await this.page.goto('https://thrively-ssr.thrively.com/classroom', {
      waitUntil: 'domcontentloaded',
    });
    await stablePage(this.page);
  }

  async openScheduleDemo() {
    await stablePage(this.page);
    await this.scheduleDemoBtn.click();
    await stablePage(this.page);
  }

  async openRequestQuote() {
    await stablePage(this.page);
    await this.requestQuoteBtn.click();
    await stablePage(this.page);
  }

  async fillCommonForm(data) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.phoneInput.fill(data.phone);
    await this.schoolInput.fill(data.school);
  }

  async fillQuoteExtra(data) {
    await this.studentsInput.fill(data.students);
    await this.descriptionInput.fill(data.description);
  }

  async submit() {
    await this.submitBtn.click();
    await stablePage(this.page);
  }
}
