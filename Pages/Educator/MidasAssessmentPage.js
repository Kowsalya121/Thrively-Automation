/**
 * Page Object Model — MIDAS Assessment Flow
 *
 * Covers the full end-to-end journey:
 *   Profile page → Assessment intro → Questions (rotating 1-2-3 pattern) → Finish → MIDAS Profile
 *
 * Key structural facts discovered via live inspection:
 *   - Intro URL  : /assessments/midas/intro
 *   - Question URL pattern: /assessments/midas/q/<n>  (n starts at 0)
 *   - Finish URL : /assessments/midas/finish
 *   - Post-redirect URL: /teacher/<userId>/profile#midasScore
 *
 *   - Progress bar  : <ul class="assessment-tab flex-v-center flex-between m0imp"> — 8 section tabs
 *   - Answer options: <ul class="m0imp"> > <li class="mtb10 w120"> — always 6 options per question
 *   - All option text differs per question but the li selector is consistent
 *   - Next button is disabled until an option is selected
 *
 *   - Post-completion profile shows:
 *       heading "MIDAS Aptitude Profile"
 *       heading "Top 3 Smarts"
 *       div#midasScore (anchor target)
 *       "Take the MIDAS Assessment" button is GONE
 */
export class MidasAssessmentPage {
  constructor(page) {
    this.page = page;

    // ── Profile page ──────────────────────────────────────────────────────
    this.profileHeading       = page.getByRole('heading', { name: /Welcome/ });
    this.takeMidasAssessBtn   = page.getByRole('button', { name: 'Take the MIDAS Assessment' });

    // ── Assessment intro page ─────────────────────────────────────────────
    // Heading text confirmed live: "The Multiple Intelligences Developmental Assessment Scales…"
    this.introHeading         = page.getByRole('heading', { name: /Multiple Intelligences Developmental Assessment Scales/ });
    this.startAssessmentBtn   = page.getByRole('button', { name: 'Start Assessment' });

    // ── Assessment question page ──────────────────────────────────────────
    // Progress bar: ul with 8 section tabs (class "assessment-tab")
    this.progressBar          = page.locator('ul.assessment-tab');
    // Question h2 (no fixed class suffix for MIDAS)
    this.questionHeading      = page.locator('h2');
    // Answer option list  (class "m0imp" on the ul, "mtb10 w120" on each li)
    this.answerOptions        = page.locator('ul.m0imp li.mtb10');
    this.nextBtn              = page.getByRole('button', { name: 'Next' });

    // ── Finish page ───────────────────────────────────────────────────────
    // Confirmed heading: "Congratulations! You've finished the MIDAS aptitude test…"
    this.finishHeading        = page.getByRole('heading', { name: /Congratulations.*MIDAS/i });
    this.finishParagraph      = page.getByText(/abilities will grow and change over time/i);
    this.viewResultsBtn       = page.getByRole('button', { name: 'View Results' });

    // ── Post-redirect profile page (MIDAS results) ────────────────────────
    this.midasProfileHeading  = page.getByRole('heading', { name: 'MIDAS Aptitude Profile' });
    this.top3SmartsHeading    = page.getByRole('heading', { name: 'Top 3 Smarts' });
  }

  // ── Navigation helpers ────────────────────────────────────────────────────

  /**
   * Navigate directly to the educator profile page by userId.
   * Reuses the userId stored in testdata.js Loginusers.educator.userId.
   */
  async navigateToProfile(userId) {
    await this.page.goto(`https://qa.thrively.com/ng/#/teacher/${userId}/profile`);
    await this.page.waitForURL(`**/teacher/${userId}/profile**`);
  }

  /**
   * Navigate to profile via the sidebar "My Profile" link.
   * Alternative to direct URL navigation — matches the sidebar item
   * confirmed as: li.flex-v-center.icon-pink.subitem with text "My Profile"
   */
  async navigateToProfileViaMenu() {
    await this.page.locator('li.flex-v-center.icon-pink.subitem', { hasText: 'My Profile' }).click();
    await this.page.waitForURL('**/profile**');
  }

  // ── Profile page actions ──────────────────────────────────────────────────

  async clickTakeMidasAssessment() {
    await this.takeMidasAssessBtn.click();
    await this.page.waitForURL('**/assessments/midas/intro');
  }

  // ── Intro page actions ────────────────────────────────────────────────────

  async clickStartAssessment() {
    await this.startAssessmentBtn.click();
    await this.page.waitForURL('**/assessments/midas/q/**');
  }

  // ── Answer-selection helpers ──────────────────────────────────────────────

  /**
   * Selects the answer option at the given 0-based index on the current question.
   *
   * All MIDAS questions consistently expose exactly 6 options rendered as
   *   <ul class="m0imp"><li class="mtb10 w120">…</li></ul>
   * The answer text changes per question but the selector is stable.
   *
   * @param {number} optionIndex  0-based index (0 = option 1, 1 = option 2, 2 = option 3, …)
   */
  async selectOptionAt(optionIndex) {
    await this.answerOptions.nth(optionIndex).click();
  }

  /**
   * Completes every question in the assessment using a rotating 1-2-3 pattern:
   *
   *   Q1  → option index 0  (Option 1)
   *   Q2  → option index 1  (Option 2)
   *   Q3  → option index 2  (Option 3)
   *   Q4  → option index 0  (Option 1)  ← wraps back
   *   …
   *
   * The rotation is implemented via:   optionIndex = questionCounter % 3
   *
   * Exits the loop as soon as the URL leaves the /assessments/midas/q/ path,
   * which happens when the framework auto-navigates to /assessments/midas/finish.
   *
   * @param {number} [startIndex=0]  Override the starting question counter (useful
   *                                  if you resume a partially completed assessment).
   */
  async completeAllQuestionsWithRotatingPattern(startIndex = 0) {
    let questionCounter = startIndex;
    let prevUrl = '';
    const maxIterations = 600; // safety guard against infinite loops

    for (let i = 0; i < maxIterations; i++) {
      const currentUrl = this.page.url();

      // Exit when we leave the question pages
      if (!currentUrl.includes('/assessments/midas/q/')) break;

      // Skip duplicate-URL iterations (e.g. Next not yet processed)
      if (currentUrl === prevUrl) continue;
      prevUrl = currentUrl;

      // Rotating pattern: 0 → 1 → 2 → 0 → 1 → 2 …
      const optionIndex = questionCounter % 3;

      await this.selectOptionAt(optionIndex);
      await this.page.waitForTimeout(200);

      const isNextEnabled = await this.nextBtn.isEnabled().catch(() => false);
      if (isNextEnabled) {
        await this.nextBtn.click();
        await this.page.waitForTimeout(400);
      }

      questionCounter++;
    }
  }

  // ── Finish page actions ───────────────────────────────────────────────────

  async clickViewResults() {
    await this.viewResultsBtn.click();
    // Redirects to profile#midasScore
    await this.page.waitForURL('**/profile**');
  }
}
