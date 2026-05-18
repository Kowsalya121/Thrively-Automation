/**
 * Page Object Model — Habits of Mind (Thomas) Assessment Flow
 *
 * Covers the full end-to-end journey:
 *   Profile page → Assessment intro → Questions (rotating 1-2-3 pattern)
 *   → Generating results screen → Finish page → Habits of Mind Profile
 *
 * Key structural facts discovered via live inspection:
 *   - Profile trigger : button "Reveal Your Habits of Mind" inside <thomas-score> component
 *   - Intro URL       : /assessments/thomas/intro
 *   - Question URL    : /assessments/thomas/q/<n>  (n = 0 … 79, total 80 questions)
 *   - Generating URL  : /assessments/thomas/q/79  (transient — auto-advances)
 *   - Finish URL      : /assessments/thomas/finish
 *   - Post-redirect   : /teacher/<userId>/profile#thomasScore
 *
 *   Intro page:
 *     - Component tag   : <assessments-intro class="…Thomas…">
 *     - Container class : "assessment flex-vh-center Thomas thomas Teacher"
 *     - h2 heading      : "The Habits of Mind Assessment takes about 25 minutes…"
 *     - Button          : "Start Assessment"
 *
 *   Question page:
 *     - Component tag   : <assessments-questions>
 *     - Progress bar    : <progress-bar> — section name + fill bar
 *     - Progress header : div.progress-header > div.progess-sub-head
 *     - Section label   : h2.f26.fw9 (habit name e.g. "Listening with Understanding…")
 *     - Question text   : h2.question
 *     - Counter         : h3.m0.fw5.fc-gray.f18  e.g. "1/80"
 *     - Answer options  : ul.m0imp > li.mtb10  (always 6 per question, text varies)
 *     - Next button     : disabled until an option is selected
 *
 *   Finish page:
 *     - Component tag   : <assessments-success>
 *     - h2 heading      : "Congratulations! You've finished the Habits of Mind Assessment…"
 *     - Button          : "View Results"
 *
 *   Post-redirect profile:
 *     - h3 heading      : "Habits of Mind Profile"  (always h3 on profile page)
 *     - h5 heading      : "TOP 3 HABITS"
 *     - div#thomasScore : anchor target
 *     - "Reveal Your Habits of Mind" button : GONE after completion
 */
export class HabitsOfMindPage {
  constructor(page) {
    this.page = page;

    // ── Profile page ──────────────────────────────────────────────────────
    this.profileHeading        = page.getByRole('heading', { name: /Welcome/i });
    this.revealHabitsBtn       = page.getByRole('button', { name: 'Reveal Your Habits of Mind' });

    // ── Assessment intro page ─────────────────────────────────────────────
    // h2 confirmed live: "The Habits of Mind Assessment takes about 25 minutes…"
    this.introHeading          = page.getByRole('heading', { name: /Habits of Mind Assessment takes about 25 minutes/i });
    this.startAssessmentBtn    = page.getByRole('button', { name: 'Start Assessment' });

    // ── Assessment question page ──────────────────────────────────────────
    // <progress-bar> component + wrapping .progress-header
    this.progressBar           = page.locator('progress-bar');
    this.progressHeader        = page.locator('.progress-header');
    // Section h2 (habit name) — class "f26 fw9 m0 fc-prime lh40"
    this.sectionHeading        = page.locator('h2.f26.fw9');
    // Question h2 — class "question f26 fw5 …"
    this.questionHeading       = page.locator('h2.question');
    // Counter "N/80" — h3.m0.fw5.fc-gray.f18
    this.questionCounter       = page.locator('h3.m0.fw5.fc-gray.f18');
    // Answer options — same structure used by MIDAS: ul.m0imp > li.mtb10
    this.answerOptions         = page.locator('ul.m0imp li.mtb10');
    this.nextBtn               = page.getByRole('button', { name: 'Next' });

    // ── Finish / success page ─────────────────────────────────────────────
    // h2 confirmed live: "Congratulations! You've finished the Habits of Mind Assessment…"
    this.finishHeading         = page.getByRole('heading', { name: /Congratulations.*Habits of Mind/i });
    this.finishParagraph       = page.getByText(/abilities will grow and change over time/i);
    this.viewResultsBtn        = page.getByRole('button', { name: 'View Results' });

    // ── Post-redirect profile (Habits of Mind results) ────────────────────
    // Confirmed live headings after completion:
    //   "Habits of Mind Profile"  (h5 rendered on profile as part of strength-profile component)
    //   "TOP 3 HABITS"
    this.habitsProfileHeading  = page.getByRole('heading', { name: 'Habits of Mind Profile' });
    this.top3HabitsHeading     = page.getByRole('heading', { name: /TOP 3 HABITS/i });
  }

  // ── Navigation helpers ────────────────────────────────────────────────────

  /**
   * Navigate directly to the educator profile page by userId.
   * userId is stored in testdata.js as Loginusers.educator.userId.
   */
  async navigateToProfile(userId) {
    await this.page.goto(`https://qa.thrively.com/ng/#/teacher/${userId}/profile`);
    await this.page.waitForURL(`**/teacher/${userId}/profile**`);
    // Wait for Angular to finish rendering (profile lazy-loads sections)
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
   * Click "Reveal Your Habits of Mind" and wait for the assessment intro URL.
   */
  async clickRevealHabitsOfMind() {
    await this.revealHabitsBtn.click();
    await this.page.waitForURL('**/assessments/thomas/intro');
  }

  // ── Intro page actions ────────────────────────────────────────────────────

  /**
   * Click "Start Assessment" on the intro page and wait for the first question.
   */
  async clickStartAssessment() {
    await this.startAssessmentBtn.click();
    await this.page.waitForURL('**/assessments/thomas/q/**');
  }

  // ── Answer-selection helpers ──────────────────────────────────────────────

  /**
   * Clicks the answer option at the given 0-based index.
   *
   * All 80 Habits of Mind questions share the same answer-list structure:
   *   <ul class="m0imp">
   *     <li class="mtb10 w120">…</li>   ← 6 per question
   *   </ul>
   * The answer text varies per question but the CSS selector is stable.
   *
   * @param {number} optionIndex  0-based (0 = Option 1, 1 = Option 2, 2 = Option 3, …)
   */
  async selectOptionAt(optionIndex) {
    await this.answerOptions.nth(optionIndex).click();
  }

  /**
   * Completes every question using a rotating 1-2-3 answer pattern:
   *
   *   Q1  (qNum=0) → optionIndex = 0 % 3 = 0  → Option 1
   *   Q2  (qNum=1) → optionIndex = 1 % 3 = 1  → Option 2
   *   Q3  (qNum=2) → optionIndex = 2 % 3 = 2  → Option 3
   *   Q4  (qNum=3) → optionIndex = 3 % 3 = 0  → Option 1  (wraps)
   *   …
   *
   * The question number is read from the URL fragment (/q/<n>) so the pattern is
   * always deterministic regardless of how many questions have already been answered.
   *
   * After the last question (q/79) the app shows a brief "Generating results…"
   * loading screen, then auto-navigates to /assessments/thomas/finish.
   * The loop exits cleanly as soon as the URL leaves the /thomas/q/ path.
   *
   * @param {number} [maxIterations=1200]  Safety cap (80 questions × ~15 iterations max each)
   */
  async completeAllQuestionsWithRotatingPattern(maxIterations = 1200) {
    let prevUrl = '';

    for (let i = 0; i < maxIterations; i++) {
      const currentUrl = this.page.url();

      // Exit when we leave the question pages (includes the transient q/79 state)
      if (!currentUrl.includes('/assessments/thomas/q/')) break;

      // Skip duplicate-URL ticks while the page is still processing Next
      if (currentUrl === prevUrl) continue;
      prevUrl = currentUrl;

      // Derive option index from the question number in the URL
      const qNum = parseInt(currentUrl.split('/q/')[1], 10);
      const optionIndex = qNum % 3; // 0 → 1 → 2 → 0 → 1 → 2 …

      await this.selectOptionAt(optionIndex);
      await this.page.waitForTimeout(200);

      const isNextEnabled = await this.nextBtn.isEnabled().catch(() => false);
      if (isNextEnabled) {
        await this.nextBtn.click();
        await this.page.waitForTimeout(400);
      }
    }
  }

  // ── Finish page actions ───────────────────────────────────────────────────

  /**
   * Click "View Results" and wait for redirect back to the profile page.
   * The anchor #thomasScore is appended by the app automatically.
   */
  async clickViewResults() {
    await this.viewResultsBtn.click();
    await this.page.waitForURL('**/profile**', { timeout: 15000 });
    // Allow Angular to finish rendering the results section
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }
}
