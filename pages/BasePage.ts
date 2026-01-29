import { Page, Locator } from '@playwright/test';
import { CookieHandler } from './components';
import { LOCATORS } from './locators';

export class BasePage {
  readonly page: Page;
  readonly cookieHandler: CookieHandler;
  readonly logo: Locator;
  readonly homeLink: Locator;
  readonly productsLink: Locator;
  readonly cartLink: Locator;
  readonly signupLoginLink: Locator;
  readonly testCasesLink: Locator;
  readonly apiTestingLink: Locator;
  readonly videoTutorialsLink: Locator;
  readonly contactUsLink: Locator;
  readonly logoutLink: Locator;
  readonly deleteAccountLink: Locator;
  readonly subscriptionHeading: Locator;
  readonly emailInput: Locator;
  readonly subscribeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cookieHandler = new CookieHandler(page);
    this.logo = page.getByRole('link', { name: LOCATORS.HOME_PAGE.LOGO });
    this.homeLink = page.getByRole('link', { name: LOCATORS.HOME_PAGE.HOME_LINK });
    this.productsLink = page.getByRole('link', { name: LOCATORS.HOME_PAGE.PRODUCTS_LINK });
    this.cartLink = page.getByRole('link', { name: LOCATORS.HOME_PAGE.CART_LINK });
    this.signupLoginLink = page.getByRole('link', { name: LOCATORS.HOME_PAGE.SIGNUP_LOGIN_LINK });
    this.testCasesLink = page.getByRole('link', { name: LOCATORS.HOME_PAGE.TEST_CASES_LINK });
    this.apiTestingLink = page.getByRole('link', { name: LOCATORS.HOME_PAGE.API_TESTING_LINK });
    this.videoTutorialsLink = page.getByRole('link', {
      name: LOCATORS.HOME_PAGE.VIDEO_TUTORIALS_LINK,
    });
    this.contactUsLink = page.getByRole('link', { name: LOCATORS.HOME_PAGE.CONTACT_US_LINK });
    this.logoutLink = page.getByRole('link', { name: LOCATORS.HOME_PAGE.LOGOUT_LINK });
    this.deleteAccountLink = page.getByRole('link', {
      name: LOCATORS.HOME_PAGE.DELETE_ACCOUNT_LINK,
    });
    this.subscriptionHeading = page.getByRole('heading', {
      name: LOCATORS.HOME_PAGE.SUBSCRIPTION_HEADING,
      level: 2,
    });
    this.emailInput = page.locator(LOCATORS.HOME_PAGE.EMAIL_INPUT);
    this.subscribeButton = page.locator(LOCATORS.HOME_PAGE.SUBSCRIBE_BUTTON);
  }

  async acceptCookiesIfPresent(): Promise<void> {
    await this.cookieHandler.acceptCookieConsent();
  }

  async isCookieConsentVisible(): Promise<boolean> {
    return await this.cookieHandler.isCookieConsentVisible();
  }
}
