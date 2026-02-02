import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { LOCATORS } from './locators';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly cartProductNames: Locator;
  readonly cartProductPrices: Locator;
  readonly cartProductQuantities: Locator;
  readonly cartProductTotals: Locator;
  readonly removeButtons: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly registerLoginLink: Locator;
  readonly emptyCart: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator(LOCATORS.CART_PAGE.CART_ITEMS);
    this.cartProductNames = page.locator(LOCATORS.CART_PAGE.CART_PRODUCT_NAMES);
    this.cartProductPrices = page.locator(LOCATORS.CART_PAGE.CART_PRODUCT_PRICES);
    this.cartProductQuantities = page.locator(LOCATORS.CART_PAGE.CART_PRODUCT_QUANTITIES);
    this.cartProductTotals = page.locator(LOCATORS.CART_PAGE.CART_PRODUCT_TOTALS);
    this.removeButtons = page.locator(LOCATORS.CART_PAGE.REMOVE_BUTTONS);
    this.proceedToCheckoutButton = page.locator(LOCATORS.CART_PAGE.PROCEED_TO_CHECKOUT_BUTTON);
    this.registerLoginLink = page.getByRole('link', {
      name: LOCATORS.CART_PAGE.REGISTER_LOGIN_LINK,
    });
    this.emptyCart = page.locator(LOCATORS.CART_PAGE.EMPTY_CART);
  }

  async removeProduct(index: number): Promise<void> {
    await this.removeButtons.nth(index).click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
  }

  async getProductName(index: number): Promise<string> {
    return (await this.cartProductNames.nth(index).textContent())?.trim() ?? '';
  }

  async getProductPrice(index: number): Promise<string> {
    return (await this.cartProductPrices.nth(index).textContent())?.trim() ?? '';
  }

  async getProductQuantity(index: number): Promise<string> {
    return (await this.cartProductQuantities.nth(index).inputValue()) ?? '';
  }

  async getProductTotal(index: number): Promise<string> {
    return (await this.cartProductTotals.nth(index).textContent())?.trim() ?? '';
  }

  async waitForPageToLoad(): Promise<void> {
    await Promise.race([
      this.cartItems.first().waitFor({ state: 'visible' }),
      this.emptyCart.waitFor({ state: 'visible' }),
    ]);
  }
}
