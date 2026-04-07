export class DistrictSelfAssessmentPage {
    constructor(page) {
      this.page = page;
    }
  
    async navigate(url) {
      await this.page.goto(url);
    }
  
    async clickTalkToUs() {
      await this.page.getByText('Talk to Us').click();
    }
  
    async clickFindOutNow() {
      await this.page.getByRole('button', { name: 'Find out now' }).first().click();
    }
  
    async closeModal() {
      await this.page.getByRole('button', { name: 'Close' }).click();
    }
  
    async carouselActions() {
      await this.page.locator('.slide-nav.nav-right').click();
      await this.page.locator('.slide-nav.nav-right').click();
      await this.page.locator('.slideBtn').first().click();
      await this.page.locator('.slideBtn').first().click();
    }
  
    async clickScheduleMeeting() {
      await this.page.getByRole('button', { name: 'Schedule a meeting' }).click();
    }
  
    async closeScheduleModal() {
      await this.page.getByRole('button', { name: 'Close' }).click();
    }
  
    async startAssessment() {
      await this.page.getByRole('button', { name: 'Start self-assessment' }).click();
    }
  
    async answerQuestion(q) {
      if (q.hasBackCheck) {
        await this.page.getByRole('button', { name: 'Back' }).click();
        await this.page.getByRole('button', { name: 'Next' }).click();
      }
  
      if (q.action.type === 'nth') {
        await this.page.getByRole('listitem').nth(q.action.value).click();
      } else {
        await this.page.getByText(q.action.value, { exact: true }).click();
      }
  
      await this.page.getByRole('button', { name: 'Next' }).click();
    }
  
    async clickViewResult() {
      await this.page.getByRole('button', { name: 'View Result' }).click();
    }
  
    async enterEmail(email) {
      await this.page.getByRole('textbox', { name: 'Enter your email address' }).fill(email);
    }
  
    async clickSend() {
      await this.page.getByRole('button', { name: 'Send' }).click();
    }
  
    async clickLearnMore() {
      await this.page.getByRole('button', { name: 'Learn more' }).click();
    }
  }
  
 