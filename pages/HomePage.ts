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
