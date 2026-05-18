/**
 * Page Object Model for the Strength Assessment flow
 * Covers: Profile page → Assessment intro → Questions → Finish → Strength Profile
 */
export class StrengthAssessmentPage {
  constructor(page) {
    this.page = page;

    // ===== PROFILE PAGE =====
    this.profileHeading        = page.getByRole('heading', { name: /Welcome/ });
    this.takeStrengthAssessBtn = page.getByRole('button', { name: 'Take the Strengths Assessment' });
    this.strengthsProfileHeading = page.getByRole('heading', { name: 'Strengths Profile' });

    // ===== ASSESSMENT INTRO PAGE =====
    this.unlockStrengthsHeading = page.getByRole('heading', { name: 'Unlock Your Strengths' });
    this.startAssessmentBtn     = page.getByRole('button', { name: 'Start Assessment' });

    // ===== ASSESSMENT QUESTIONS =====
    this.nextBtn     = page.getByRole('button', { name: 'Next' });
    this.questionH2  = page.locator('h2.question, h2[class*="question"]');
    this.progressHeading = page.getByRole('heading', { name: 'Your Progress' });

    // ===== FINISH PAGE =====
    this.finishHeading       = page.getByRole('heading', { name: "Hooray, you're finished!" });
    this.viewStrengthProfileBtn = page.getByRole('button', { name: 'View Strength Profile' });
  }

  // ─── Navigation ──────────────────────────────────────────────────────────

  async navigateToProfile(userId) {
    await this.page.goto(`https://qa.thrively.com/ng/#/teacher/${userId}/profile`);
    await this.page.waitForURL(`**/teacher/${userId}/profile`);
  }

  async navigateToProfileViaMenu() {
    // Click "My Profile" from the sidebar Account Settings section
    await this.page.locator('li.flex-v-center.icon-pink.subitem', { hasText: 'My Profile' }).click();
    await this.page.waitForURL('**/profile**');
  }

  // ─── Profile page actions ─────────────────────────────────────────────────

  async clickTakeStrengthAssessment() {
    await this.takeStrengthAssessBtn.click();
    await this.page.waitForURL('**/assessments/thrively/intro');
  }

  // ─── Intro page actions ───────────────────────────────────────────────────

  async clickStartAssessment() {
    await this.startAssessmentBtn.click();
    await this.page.waitForURL('**/assessments/thrively/q/**');
  }

  // ─── Question answering ───────────────────────────────────────────────────

  /**
   * Answers the current question by selecting the first available option.
   * Handles both:
   *   - Text list questions  (ul > li items)
   *   - Image radio questions (label[for*="radio"] — hidden inputs, JS click required)
   *
   * Returns the type of question that was answered.
   */
  async answerFirstOption() {
    const liCount = await this.page.locator('ul li').count();

    if (liCount > 0) {
      await this.page.locator('ul li').first().click();
      return 'list';
    }

    // Image/audio radio — inputs are hidden; use JS click on label
    const labelCount = await this.page.evaluate(
      () => document.querySelectorAll('label[for*="radio"]').length
    );
    if (labelCount > 0) {
      await this.page.evaluate(() => {
        const label = document.querySelector('label[for*="radio"]');
        if (label) label.click();
      });
      return 'image-radio';
    }

    return 'unknown';
  }

  /**
   * Loops through every question page, selects the first option, and
   * advances with the Next button until the assessment finish page is reached.
   */
  async completeAllQuestionsWithFirstOption() {
    let iterations   = 0;
    const maxIterations = 500;

    while (iterations < maxIterations) {
      const url = this.page.url();

      if (!url.includes('/assessments/thrively/q/')) break;

      await this.answerFirstOption();

      const isEnabled = await this.nextBtn.isEnabled().catch(() => false);
      if (isEnabled) {
        await this.nextBtn.click();
        await this.page.waitForTimeout(400);
      }

      iterations++;
    }
  }

  // ─── Finish page actions ──────────────────────────────────────────────────

  async clickViewStrengthProfile() {
    await this.viewStrengthProfileBtn.click();
    await this.page.waitForURL('**/profile**');
  }
}
