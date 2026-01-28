import { Page, Locator } from '@playwright/test';
import { LOCATORS } from '../locators';

export class ProductListComponent {
  readonly productCards: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly addToCartButtons: Locator;
  readonly viewProductLinks: Locator;

  constructor(page: Page) {
    this.productCards = page.locator(LOCATORS.PRODUCT_LIST.PRODUCT_CARDS);
    this.productNames = page.locator(LOCATORS.PRODUCT_LIST.PRODUCT_NAMES);
    this.productPrices = page.locator(LOCATORS.PRODUCT_LIST.PRODUCT_PRICES);
    this.addToCartButtons = page.locator(LOCATORS.PRODUCT_LIST.ADD_TO_CART_BUTTONS);
    this.viewProductLinks = page.getByRole('link', {
      name: LOCATORS.PRODUCT_LIST.VIEW_PRODUCT_LINKS,
    });
  }

  async addProductToCart(index: number): Promise<void> {
    await this.addToCartButtons.nth(index).click();
  }

  async viewProduct(index: number): Promise<void> {
    await this.viewProductLinks.nth(index).click();
  }

  async getProductName(index: number): Promise<string> {
    return (await this.productNames.nth(index).textContent())?.trim() ?? '';
  }

  async getProductPrice(index: number): Promise<string> {
    return (await this.productPrices.nth(index).textContent())?.trim() ?? '';
  }

  async getProductCount(): Promise<number> {
    return await this.productCards.count();
  }
}
