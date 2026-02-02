import { Page, Locator } from '@playwright/test';
import { LOCATORS } from '../locators';
import { TIMEOUTS } from '../../common/constants';

export class OrderConfirmationModalComponent {
  readonly continueShoppingButton: Locator;
  readonly viewCartButton: Locator;
  readonly modal: Locator;

  constructor(page: Page) {
    this.continueShoppingButton = page.getByRole('button', {
      name: LOCATORS.ORDER_CONFIRMATION_MODAL.CONTINUE_SHOPPING_BUTTON,
    });
    this.viewCartButton = page.getByRole('link', {
      name: LOCATORS.ORDER_CONFIRMATION_MODAL.VIEW_CART_BUTTON,
    });
    this.modal = page.locator(LOCATORS.ORDER_CONFIRMATION_MODAL.MODAL);
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
    await this.modal.waitFor({ state: 'hidden', timeout: TIMEOUTS.MEDIUM }).catch(() => {});
  }

  async viewCart(): Promise<void> {
    await this.viewCartButton.click();
  }

  async isModalVisible(): Promise<boolean> {
    return await this.modal
      .waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT })
      .then(() => true)
      .catch(() => false);
  }

  async handleIfVisible(): Promise<void> {
    if (await this.isModalVisible()) {
      await this.continueShopping();
    }
  }
}
