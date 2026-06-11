import { test as base, expect } from '@playwright/test';
import { ArtifactHelper } from '../Utility/artifactHelper.js';

export const test = base;
export { expect };

test.afterEach(async ({ page }, testInfo) => {
  console.log('🔥 afterEach running');
  if (testInfo.status !== testInfo.expectedStatus) {
    await ArtifactHelper.captureScreenshot(page, testInfo);
    await ArtifactHelper.saveVideo(page, testInfo);
  }
});
