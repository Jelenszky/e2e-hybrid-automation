import { test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto(process.env.baseURL || 'http://automationexercise.com');
});
