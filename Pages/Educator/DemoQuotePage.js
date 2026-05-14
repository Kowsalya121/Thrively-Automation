export class DemoQuotePage {
  constructor(page) {
    this.page = page;

    // Buttons
    this.scheduleDemoBtn = page.getByRole('button', { name: 'Schedule a Demo' });
    this.requestQuoteBtn = page.getByRole('button', { name: 'Request a Quote' });

    // Form fields
    this.nameInput = page.getByRole('textbox', { name: 'First Name & Last Name *' });
    this.emailInput = page.getByRole('textbox', { name: 'Your Email Address *' });
    this.phoneInput = page.getByRole('textbox', { name: 'Phone Number' });
    this.schoolInput = page.getByRole('textbox', { name: 'School or District *' });
    this.studentsInput = page.getByRole('spinbutton', { name: 'Number of Students *' });
    this.descriptionInput = page.getByRole('textbox', { name: 'Description' });

    // Actions
    this.submitBtn = page.getByRole('dialog').getByRole('button', { name: /Schedule a Demo|Request a Quote/ });

    // Common elements
    this.form = page.locator('inquiry-contact-form');
    this.success = page.locator('.wh100p');
    this.scheduleNowLink = page.getByRole('link', { name: 'Schedule now' });
    this.learnMoreLinks = page.getByRole('link', { name: 'Learn More' });
  }

  async goto() {
    await this.page.goto('https://thrively-ssr.thrively.com/classroom');
  }

  async openScheduleDemo() {
    await this.scheduleDemoBtn.click();
  }

  async openRequestQuote() {
    await this.requestQuoteBtn.click();
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
  }
}