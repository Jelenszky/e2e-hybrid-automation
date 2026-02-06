import { HomePage } from '../pages';
import { test as setup } from '@playwright/test';
import path from 'path';

setup('Handle cookies and save storage state', async ({ page }) => {
  const storageStatePath = path.resolve(__dirname, '.cookies/cookies.json');
  try {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.acceptCookiesIfPresent();
    await homePage.page.context().storageState({ path: storageStatePath });
    console.log('Storage state saved with cookies accepted');
  } catch (error) {
    console.error('Handling cookies and setup failed:', error);
    process.exit(1);
  }
});
