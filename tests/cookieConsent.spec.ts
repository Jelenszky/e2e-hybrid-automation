import { test, expect } from '../fixtures';

test.describe('Cookie Consent Handling', () => {
  test('should accept cookies on home page', async ({ page, homePage }) => {
    await page.goto('https://automationexercise.com/');

    // Check if cookie consent is visible
    if (await homePage.isCookieConsentVisible()) {
      await homePage.acceptCookiesIfPresent();
      // Verify cookie consent is no longer visible
      await expect(homePage.cookieHandler.cookieConsentDialog).toBeHidden();
    }
  });

  test('should accept cookies on products page', async ({ page, productsPage }) => {
    await page.goto('https://automationexercise.com/products');

    // Accept cookies if present
    await productsPage.acceptCookiesIfPresent();

    // Verify page is still accessible
    const productCards = await productsPage.productList.productCards.count();
    expect(productCards).toBeGreaterThan(0);
  });

  test('should accept cookies on cart page', async ({ page, cartPage }) => {
    await page.goto('https://automationexercise.com/view_cart');

    // Accept cookies
    await cartPage.acceptCookiesIfPresent();

    // Cart page should be accessible
    const pageTitle = await page.title();
    expect(pageTitle).toBeTruthy();
  });

  test('should accept cookies on product details page', async ({ page, productDetailsPage }) => {
    await page.goto('https://automationexercise.com/product_details/1');

    // Accept cookies
    await productDetailsPage.acceptCookiesIfPresent();

    // Verify product details are visible
    await expect(productDetailsPage.productTitle).toBeVisible();
  });
});
