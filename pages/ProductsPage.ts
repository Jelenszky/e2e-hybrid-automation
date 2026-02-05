import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { LOCATORS } from './locators';
import { ProductListComponent, OrderConfirmationModalComponent } from './components';

export class ProductsPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly categorySidebar: Locator;
  readonly brandSidebar: Locator;
  readonly productList: ProductListComponent;
  readonly orderConfirmationModal: OrderConfirmationModalComponent;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator(LOCATORS.PRODUCTS_PAGE.SEARCH_INPUT);
    this.searchButton = page.locator(LOCATORS.PRODUCTS_PAGE.SEARCH_BUTTON);
    this.categorySidebar = page.locator(LOCATORS.PRODUCTS_PAGE.CATEGORY_SIDEBAR);
    this.brandSidebar = page.locator(LOCATORS.PRODUCTS_PAGE.BRAND_SIDEBAR);
    this.productList = new ProductListComponent(page);
    this.orderConfirmationModal = new OrderConfirmationModalComponent(page);
  }

  async searchProduct(productName: string): Promise<void> {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
  }

  async addProductToCart(index: number): Promise<void> {
    await this.productList.addProductToCart(index);
    await this.orderConfirmationModal.handleIfVisible();
  }

  async viewProduct(index: number): Promise<void> {
    await this.productList.viewProduct(index);
  }

  async getProductName(index: number): Promise<string> {
    return await this.productList.getProductName(index);
  }

  async getProductPrice(index: number): Promise<string> {
    return await this.productList.getProductPrice(index);
  }

  async shouldBeLoaded(): Promise<void> {
    await this.searchInput.waitFor({ state: 'visible' });
    await this.productList.productCards.first().waitFor({ state: 'visible' });
  }

  async findAndAddProductToCart(targetProductName: string): Promise<void> {
    const count = await this.productList.getProductCount();

    for (let i = 0; i < count; i++) {
      const productName = await this.productList.getProductName(i);
      if (productName && productName.includes(targetProductName)) {
        await this.addProductToCart(i);
        break;
      }
    }
  }
}
