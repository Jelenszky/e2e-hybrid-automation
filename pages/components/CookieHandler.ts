import { Page, Locator } from '@playwright/test';
import { LOCATORS, TIMEOUTS, ERROR_MESSAGES } from '../../common/constants';

export class CookieHandler {
  readonly cookieConsentDialog: Locator;
  readonly consentButton: Locator;
  readonly manageOptionsButton: Locator;
  readonly learnMoreButton: Locator;
  readonly listOfPartnersButton: Locator;

  constructor(page: Page) {
    this.cookieConsentDialog = page.locator(LOCATORS.COOKIE.DIALOG).first();
    this.consentButton = this.cookieConsentDialog.getByRole('button', {
      name: LOCATORS.COOKIE.CONSENT_BUTTON,
    });
    this.manageOptionsButton = this.cookieConsentDialog.getByRole('button', {
      name: LOCATORS.COOKIE.MANAGE_OPTIONS_BUTTON,
    });
    this.learnMoreButton = this.cookieConsentDialog.getByRole('button', {
      name: LOCATORS.COOKIE.LEARN_MORE_BUTTON,
    });
    this.listOfPartnersButton = this.cookieConsentDialog.getByRole('button', {
      name: LOCATORS.COOKIE.PARTNERS_BUTTON,
    });
  }

  async isCookieConsentVisible(): Promise<boolean> {
    return await this.cookieConsentDialog.isVisible({ timeout: TIMEOUTS.MEDIUM });
  }

  async acceptCookieConsent(): Promise<void> {
    try {
      if (await this.isCookieConsentVisible()) {
        await this.consentButton.click();
        await this.cookieConsentDialog
          .waitFor({ state: 'hidden', timeout: TIMEOUTS.SHORT })
          .catch(() => {});
      }
    } catch (error) {
      console.warn(`${ERROR_MESSAGES.COOKIE.ACCEPT_FAILED}:`, error);
    }
  }
}
