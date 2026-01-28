import { Page, Locator } from '@playwright/test';
import { LOCATORS } from '../locators';

export class OrderConfirmationModalComponent {
  readonly continueShoppingButton: Locator;
  readonly viewCartButton: Locator;

  constructor(page: Page) {
    this.continueShoppingButton = page.getByRole('button', {
      name: LOCATORS.ORDER_CONFIRMATION_MODAL.CONTINUE_SHOPPING_BUTTON,
    });
    this.viewCartButton = page.getByRole('link', {
      name: LOCATORS.ORDER_CONFIRMATION_MODAL.VIEW_CART_BUTTON,
    });
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async viewCart(): Promise<void> {
    await this.viewCartButton.click();
  }

  async isModalVisible(): Promise<boolean> {
    return await this.continueShoppingButton.isVisible();
  }
}
