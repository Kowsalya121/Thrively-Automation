import fs from 'fs';
import path from 'path';

export class ArtifactHelper {

  static getSafeName(testInfo) {
    const title = testInfo.title.replace(/\s+/g, '_').replace(/[^\w]/g, '');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${title}_${timestamp}`;
  }

  static ensureDir(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  static async captureScreenshot(page, testInfo) {
    const dir = 'screenshots';
    this.ensureDir(dir);

    const filePath = path.join(dir, `${this.getSafeName(testInfo)}.png`);
    await page.screenshot({ path: filePath, fullPage: true });
  }

  static async saveVideo(page, testInfo) {
    if (testInfo.status === testInfo.expectedStatus) return;

    const video = page.video();
    if (!video) {
      console.log('❌ No video found');
      return;
    }

    const dir = 'videos';
    this.ensureDir(dir);

    const filePath = `${dir}/${this.getSafeName(testInfo)}.webm`;

    await video.saveAs(filePath);
    console.log(`🎥 Video saved: ${filePath}`);
  }
}