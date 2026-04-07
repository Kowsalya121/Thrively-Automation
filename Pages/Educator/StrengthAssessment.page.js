export class StrengthAssessmentPage {
    constructor(page) {
      this.page = page;
    }
  
    async beginAssessment() {
      await this.page.getByRole('button', { name: 'Start Assessment' }).click();
      await this.page.getByRole('dialog')
        .getByRole('button', { name: 'Start Assessment' })
        .click();
      await this.page.getByRole('button', { name: 'Start Now' }).click();
    }
  
    async answerPreferenceQuestions() {
      await this.page.locator('.check-box-img').first().click();
      await this.page.getByRole('button', { name: 'Next' }).click();
  
      await this.page.locator('.check-box-img').first().click();
      await this.page.getByRole('button', { name: 'Next' }).click();
  
      await this.page.getByRole('heading', { name: 'Artist' }).click();
      await this.page.getByRole('button', { name: "I'm finished" }).click();
    }
  
    async completeParentQuestionnaire() {
      const answers = [
        'Building Legos/Putting things',
        'Sports',
        'My child is comfortable and',
        'Prone to much silliness and',
        'Very advanced',
        'Super coordinated',
        'Sometimes'
      ];
  
      for (const answer of answers) {
        await this.page.getByText(answer).click();
        await this.page.getByRole('button', { name: 'Next' }).click();
      }
    }
  
    async completeCognitiveSection() {
      await this.page.getByText('4').click();
      await this.page.getByRole('button', { name: 'Next' }).click();
  
      await this.page.getByText('5').click();
      await this.page.getByRole('button', { name: 'Next' }).click();
  
      await this.page.getByText('judge').click();
      await this.page.getByRole('button', { name: 'Next' }).click();
    }
  
    async finishAssessment() {
      await this.page.getByRole('button', { name: 'View Strength Profile' }).click();
      await this.page.getByText('Dashboard').click();
    }
  }
  