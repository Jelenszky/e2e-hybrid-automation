import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { LOCATORS } from './locators';
import { ProductListComponent, OrderConfirmationModalComponent } from './components';

export class HomePage extends BasePage {
  readonly testCasesButton: Locator;
  readonly apiListButton: Locator;
  readonly featuredItemsHeading: Locator;
  readonly productList: ProductListComponent;
  readonly orderConfirmationModal: OrderConfirmationModalComponent;
  readonly newUserSignupText: Locator;
  readonly loggedInAsText: (username: string) => Locator;
  readonly deleteAccountLink: Locator;

  constructor(page: Page) {
    super(page);

    this.testCasesButton = page.getByRole('button', { name: LOCATORS.HOME_PAGE.TEST_CASES_BUTTON });
    this.apiListButton = page.getByRole('button', { name: LOCATORS.HOME_PAGE.API_LIST_BUTTON });
    this.featuredItemsHeading = page.getByRole('heading', {
      name: LOCATORS.HOME_PAGE.FEATURED_ITEMS_HEADING,
      level: 2,
    });
    this.productList = new ProductListComponent(page);
    this.orderConfirmationModal = new OrderConfirmationModalComponent(page);
    this.newUserSignupText = page.getByText(LOCATORS.HOME_PAGE.NEW_USER_SIGNUP_TEXT);
    this.loggedInAsText = (username: string) => page.getByText(`Logged in as ${username}`);
    this.deleteAccountLink = page.getByRole('link', {
      name: LOCATORS.HOME_PAGE.DELETE_ACCOUNT_LINK,
    });
  }

  async navigate(): Promise<void> {
    await this.page.goto('/');
  }

  async navigateToProducts(): Promise<void> {
    await this.productsLink.click();
  }

  async navigateToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async navigateToSignupLogin(): Promise<void> {
    await this.signupLoginLink.click();
  }

  async navigateToTestCases(): Promise<void> {
    await this.testCasesLink.click();
  }

  async navigateToContactUs(): Promise<void> {
    await this.contactUsLink.click();
  }
}
