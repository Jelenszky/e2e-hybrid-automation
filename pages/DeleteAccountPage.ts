import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { LOCATORS } from './locators';

export class DeleteAccountPage extends BasePage {
  readonly heading: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator(LOCATORS.ACCOUNT_DELETED_PAGE.HEADING);
    this.continueButton = page.locator(LOCATORS.ACCOUNT_DELETED_PAGE.CONTINUE_BUTTON);
  }

  async isAccountDeletedDisplayed(): Promise<boolean> {
    return await this.heading.isVisible();
  }

  async shouldBeLoaded(): Promise<void> {
    await this.heading.waitFor({ state: 'visible' });
  }

  async clickContinueButton(): Promise<void> {
    await this.continueButton.click();
  }
}
