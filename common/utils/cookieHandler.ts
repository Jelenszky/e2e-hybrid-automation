import { Page, Locator } from '@playwright/test';
import { LOCATORS, TIMEOUTS, ERROR_MESSAGES } from '../constants';

export class CookieHandler {
  readonly cookieConsentDialog: Locator;
  readonly consentButton: Locator;
  readonly manageOptionsButton: Locator;
  readonly learnMoreButton: Locator;
  readonly listOfPartnersButton: Locator;

  constructor(page: Page) {
    this.cookieConsentDialog = page.locator(LOCATORS.COOKIE.DIALOG).first();
    this.consentButton = this.cookieConsentDialog.getByRole('button', { name: 'Consent' });
    this.manageOptionsButton = this.cookieConsentDialog.getByRole('button', {
      name: 'Manage options',
    });
    this.learnMoreButton = this.cookieConsentDialog.getByRole('button', { name: 'Learn more' });
    this.listOfPartnersButton = this.cookieConsentDialog.getByRole('button', {
      name: 'List of partners.',
    });
  }

  async isCookieConsentVisible(): Promise<boolean> {
    try {
      return await this.cookieConsentDialog.isVisible({ timeout: TIMEOUTS.COOKIE_DIALOG });
    } catch {
      return false;
    }
  }

  async acceptCookieConsent(): Promise<void> {
    try {
      if (await this.isCookieConsentVisible()) {
        await this.consentButton.click();
        await this.cookieConsentDialog
          .waitFor({ state: 'hidden', timeout: TIMEOUTS.COOKIE_DIALOG_CLOSE })
          .catch(() => {});
      }
    } catch (error) {
      console.warn(`${ERROR_MESSAGES.COOKIE.ACCEPT_FAILED}:`, error);
    }
  }
}
