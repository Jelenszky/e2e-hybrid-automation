import { chromium } from '@playwright/test';
import { HomePage } from '../pages';
import config from '../playwright.config';
import path from 'path';

async function globalSetup() {
  const baseURL = config.use?.baseURL;
  const storageStatePath = path.resolve(__dirname, '../cookies/.cookies/cookies.json');
  const context = await chromium.launchPersistentContext('', {
    baseURL,
  });
  const page = await context.newPage();

  try {
    await page.goto('/');
    const homePage = new HomePage(page);
    await homePage.acceptCookiesIfPresent();
    await context.storageState({ path: storageStatePath });
    console.log('Storage state saved with cookies accepted');
  } catch (error) {
    console.error('Global setup failed:', error);
    process.exit(1);
  } finally {
    await context.close();
  }
}

export default globalSetup;
