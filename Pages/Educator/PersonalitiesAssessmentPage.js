/**
 * Page Object Model — Personalities (RIASEC / Thrively Interest Profiler) Assessment Flow
 *
 * Covers the full end-to-end journey:
 *   Profile page → Assessment intro → Questions (rotating 1-2-3 pattern) → Finish → Personalities Profile
 *
 * Key structural facts discovered via live inspection:
 *   - Profile trigger  : button "Reveal Your Personalities" inside <riasec-score> component
 *   - Assessment name  : "Thrively Interest Profiler" (Holland's RIASEC codes)
 *   - Intro URL        : /assessments/riasec/intro
 *   - Question URL     : /assessments/riasec/q/<n>  (n = 0 … 59, total 60 questions)
 *   - Finish URL       : /assessments/riasec/finish
 *   - Post-redirect    : /teacher/<userId>/profile#riasecScore
 *
 *   Intro page:
 *     - Component tag    : <assessments-intro class="…RIASEC…">
 *     - Container class  : "assessment flex-vh-center RIASEC riasec Teacher"
 *     - h2 heading       : "The Thrively Interest Profiler can help you zero in on
 *                           your interests and better understand how those might best
 *                           connect to the world of work."
 *     - Button           : "Start Assessment"
 *
 *   Question page:
 *     - Component tag    : <assessments-questions>
 *     - Question text    : h2.question.f26.fw5.fc-prime  (e.g. "Build kitchen cabinets")
 *     - Counter          : h3.m0.fw5.fc-gray.f18  (e.g. "1/60")
 *     - Answer options   : ul.m0imp > li.mtb10.w120  — always 5 per question:
 *                            "Strongly Dislike" / "Dislike" / "Unsure" / "Like" / "Strongly Like"
 *     - NO separate <progress-bar> component (unlike Thomas/MIDAS) — only the counter h3
 *     - Next button      : disabled until an option is selected
 *
 *   Finish page:
 *     - Component tag    : <assessments-success>
 *     - h2 heading       : "Congratulations! You've finished the Thrively Interest Profiler…"
 *     - p paragraph      : "Your interests can help you find careers you might like to explore…"
 *     - Button           : "View Results"
 *
 *   Post-redirect profile:
 *     - URL anchor       : #riasecScore  (div#riasecScore)
 *     - h2 heading       : "Thrively Interest Profile"
 *     - h5 heading       : "TOP 3 PERSONALITIES"
 *     - Top 3 shown as individual h5 items (e.g. "Artistic", "Conventional", "Enterprising")
 *     - "Reveal Your Personalities" button : GONE after completion
 */
export class PersonalitiesAssessmentPage {
  constructor(page) {
    this.page = page;

    // ── Profile page ──────────────────────────────────────────────────────
    this.profileHeading        = page.getByRole('heading', { name: /Welcome/i });
    this.revealPersonalitiesBtn = page.getByRole('button', { name: 'Reveal Your Personalities' });

    // ── Assessment intro page ─────────────────────────────────────────────
    // h2 confirmed live: "The Thrively Interest Profiler can help you zero in…"
    this.introHeading          = page.getByRole('heading', { name: /Thrively Interest Profiler can help you zero in/i });
    this.startAssessmentBtn    = page.getByRole('button', { name: 'Start Assessment' });

    // ── Assessment question page ──────────────────────────────────────────
    // Question text — h2.question (no separate section heading for RIASEC)
    this.questionHeading       = page.locator('h2.question');
    // Counter "N/60" — h3.m0.fw5.fc-gray.f18  (same class as Thomas assessment)
    this.questionCounter       = page.locator('h3.m0.fw5.fc-gray.f18');
    // Answer options — ul.m0imp > li.mtb10  (5 per question, text always same across all questions:
    //   "Strongly Dislike" / "Dislike" / "Unsure" / "Like" / "Strongly Like")
    this.answerOptions         = page.locator('ul.m0imp li.mtb10');
    this.nextBtn               = page.getByRole('button', { name: 'Next' });

    // ── Finish / success page ─────────────────────────────────────────────
    // h2 confirmed live: "Congratulations! You've finished the Thrively Interest Profiler…"
    this.finishHeading         = page.getByRole('heading', { name: /Congratulations.*Thrively Interest Profiler/i });
    this.finishParagraph       = page.getByText(/Your interests can help you find careers/i);
    this.viewResultsBtn        = page.getByRole('button', { name: 'View Results' });

    // ── Post-redirect profile (Personalities / RIASEC results) ───────────
    // Confirmed live headings after completion:
    //   h2 "Thrively Interest Profile"  — section heading
    //   h5 "TOP 3 PERSONALITIES"        — confirms results were persisted
    this.interestProfileHeading = page.getByRole('heading', { name: 'Thrively Interest Profile' });
    this.top3PersonalitiesHeading = page.getByRole('heading', { name: /TOP 3 PERSONALITIES/i });
  }

  // ── Navigation helpers ────────────────────────────────────────────────────

  /**
   * Navigate directly to the educator profile page by userId.
   * userId is stored in testdata.js as Loginusers.educator.userId.
   */
  async navigateToProfile(userId) {
    await this.page.goto(`https://qa.thrively.com/ng/#/teacher/${userId}/profile`);
    await this.page.waitForURL(`**/teacher/${userId}/profile**`);
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  /**
   * Navigate to profile via the sidebar "My Profile" link.
   * Sidebar item: li.flex-v-center.icon-pink.subitem containing "My Profile"
   */
  async navigateToProfileViaMenu() {
    await this.page.locator('li.flex-v-center.icon-pink.subitem', { hasText: 'My Profile' }).click();
    await this.page.waitForURL('**/profile**');
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  // ── Profile page actions ──────────────────────────────────────────────────

  /**
   * Click "Reveal Your Personalities" and wait for the RIASEC intro URL.
   */
  async clickRevealYourPersonalities() {
    await this.revealPersonalitiesBtn.click();
    await this.page.waitForURL('**/assessments/riasec/intro');
  }

  // ── Intro page actions ────────────────────────────────────────────────────

  /**
   * Click "Start Assessment" on the intro page and wait for the first question.
   */
  async clickStartAssessment() {
    await this.startAssessmentBtn.click();
    await this.page.waitForURL('**/assessments/riasec/q/**');
  }

  // ── Answer-selection helpers ──────────────────────────────────────────────

  /**
   * Clicks the answer option at the given 0-based index on the current question.
   *
   * All 60 RIASEC questions use the same fixed 5-option answer list:
   *   index 0 → "Strongly Dislike"
   *   index 1 → "Dislike"
   *   index 2 → "Unsure"
   *   index 3 → "Like"
   *   index 4 → "Strongly Like"
   *
   * @param {number} optionIndex  0-based (0 = Option 1, 1 = Option 2, 2 = Option 3, …)
   */
  async selectOptionAt(optionIndex) {
    await this.answerOptions.nth(optionIndex).click();
  }

  /**
   * Completes every question using a rotating 1-2-3 answer pattern:
   *
   *   Q1  (qNum=0) → optionIndex = 0 % 3 = 0  → Option 1 ("Strongly Dislike")
   *   Q2  (qNum=1) → optionIndex = 1 % 3 = 1  → Option 2 ("Dislike")
   *   Q3  (qNum=2) → optionIndex = 2 % 3 = 2  → Option 3 ("Unsure")
   *   Q4  (qNum=3) → optionIndex = 3 % 3 = 0  → Option 1  ← wraps back
   *   …
   *
   * The question number is read directly from the URL fragment (/q/<n>) so the
   * pattern is deterministic regardless of prior state.
   *
   * Navigation strategy: uses waitForURL per question (faster than polling)
   * to reliably detect when the next question has fully loaded before proceeding.
   *
   * Exits immediately when the URL leaves the /riasec/q/ path — which happens
   * when the framework navigates to /assessments/riasec/finish after q/59.
   */
  async completeAllQuestionsWithRotatingPattern() {
    while (true) {
      const currentUrl = this.page.url();
      if (!currentUrl.includes('/assessments/riasec/q/')) break;

      const qNum       = parseInt(currentUrl.split('/q/')[1], 10);
      const optionIndex = qNum % 3; // rotating: 0 → 1 → 2 → 0 → 1 → 2 …
      const isLastQ    = qNum === 59;

      // Select the option for this question
      await this.selectOptionAt(optionIndex);

      // Wait until Next becomes enabled (option click registered in Angular)
      await this.nextBtn.waitFor({ state: 'enabled', timeout: 5000 }).catch(() => {});
      const isEnabled = await this.nextBtn.isEnabled().catch(() => false);
      if (!isEnabled) continue; // option click didn't register — retry same question

      await this.nextBtn.click();

      // Wait for confirmed navigation before the next iteration
      if (isLastQ) {
        await this.page.waitForURL('**/assessments/riasec/finish**', { timeout: 15000 });
      } else {
        await this.page.waitForURL(`**/assessments/riasec/q/${qNum + 1}`, { timeout: 8000 });
      }
    }
  }

  // ── Finish page actions ───────────────────────────────────────────────────

  /**
   * Click "View Results" and wait for redirect to profile#riasecScore.
   */
  async clickViewResults() {
    await this.viewResultsBtn.click();
    await this.page.waitForURL('**/profile**', { timeout: 15000 });
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }
}
