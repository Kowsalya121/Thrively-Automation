/**
 * stablePage.js — SSR / Angular hydration stability layer
 *
 * Call this utility:
 *   - BEFORE interacting with a freshly loaded page
 *   - AFTER any click / action that triggers navigation
 *   - AFTER any action that triggers a significant DOM re-render
 *
 * Strategy:
 *   1. domcontentloaded  — HTML parsed, Angular bootstrap begins
 *   2. networkidle       — API calls and lazy chunks have settled
 *   3. 1 s fixed buffer  — allows Angular change-detection to flush
 *   4. Spinner/loader wait — blocks until the app removes loading indicators
 *
 * All steps use .catch(() => {}) so a single slow network request
 * never causes a hard failure here — the downstream assertion will
 * provide a clearer error message.
 */

/** @param {import('@playwright/test').Page} page */
export async function stablePage(page) {
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await page.waitForLoadState('networkidle').catch(() => {});

  // Fixed buffer — allows Angular's NgZone / change detection to flush
  await page.waitForTimeout(1000);

  // Hide any visible loader / spinner before returning.
  // These selectors cover the most common Angular loading patterns;
  // add more here if new patterns are discovered in the app.
  const spinnerSelectors = [
    '.loading',
    '.spinner',
    '.loader',
    '[class*="loading"]',
    '[class*="spinner"]',
    'ngx-spinner',
    '.overlay',
  ];

  for (const selector of spinnerSelectors) {
    try {
      const spinner = page.locator(selector).first();
      const visible = await spinner.isVisible({ timeout: 500 });
      if (visible) {
        await spinner.waitFor({ state: 'hidden', timeout: 15000 });
      }
    } catch {
      // spinner not present — perfectly fine, move on
    }
  }
}
