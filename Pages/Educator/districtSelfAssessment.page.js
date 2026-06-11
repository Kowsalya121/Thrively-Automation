import { stablePage } from '../../Utility/stablePage.js';

export class DistrictSelfAssessmentPage {
  constructor(page) {
    this.page = page;
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  async navigate(url) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await stablePage(this.page);
  }

  async clickTalkToUs() {
    await stablePage(this.page);
    await this.page.getByText('Talk to Us').click();
    await stablePage(this.page);
  }

  async clickFindOutNow() {
    await stablePage(this.page);
    await this.page.getByRole('button', { name: 'Find out now' }).first().click();
    await stablePage(this.page);
  }

  async closeModal() {
    await this.page.getByRole('button', { name: 'Close' }).click();
    await stablePage(this.page);
  }

  async carouselActions() {
    await this.page.locator('.slide-nav.nav-right').click();
    await this.page.locator('.slide-nav.nav-right').click();
    await this.page.locator('.slideBtn').first().click();
    await this.page.locator('.slideBtn').first().click();
    await stablePage(this.page);
  }

  async clickScheduleMeeting() {
    await stablePage(this.page);
    await this.page.getByRole('button', { name: 'Schedule a meeting' }).click();
    await stablePage(this.page);
  }

  async closeScheduleModal() {
    await this.page.getByRole('button', { name: 'Close' }).click();
    await stablePage(this.page);
  }

  async startAssessment() {
    await stablePage(this.page);
    await this.page.getByRole('button', { name: 'Start self-assessment' }).click();
    await stablePage(this.page);
  }

  async answerQuestion(q) {
    if (q.hasBackCheck) {
      await this.page.getByRole('button', { name: 'Back' }).click();
      await stablePage(this.page);
      await this.page.getByRole('button', { name: 'Next' }).click();
      await stablePage(this.page);
    }
    if (q.action.type === 'nth') {
      await this.page.getByRole('listitem').nth(q.action.value).click();
    } else {
      await this.page.getByText(q.action.value, { exact: true }).click();
    }
    await this.page.getByRole('button', { name: 'Next' }).click();
    await stablePage(this.page);
  }

  async clickViewResult() {
    await stablePage(this.page);
    await this.page.getByRole('button', { name: 'View Result' }).click();
    await stablePage(this.page);
  }

  async enterEmail(email) {
    await this.page.getByRole('textbox', { name: 'Enter your email address' }).fill(email);
  }

  async clickSend() {
    await this.page.getByRole('button', { name: 'Send' }).click();
    await stablePage(this.page);
  }

  async clickLearnMore() {
    await this.page.getByRole('button', { name: 'Learn more' }).click();
    await stablePage(this.page);
  }
}
