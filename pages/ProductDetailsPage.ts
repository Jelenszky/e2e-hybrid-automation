import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { LOCATORS } from './locators';
import { OrderConfirmationModalComponent } from './components';

export class ProductDetailsPage extends BasePage {
  readonly productImage: Locator;
  readonly productTitle: Locator;
  readonly productCategory: Locator;
  readonly productPrice: Locator;
  readonly productQuantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly availabilityText: Locator;
  readonly conditionText: Locator;
  readonly brandText: Locator;
  readonly reviewNameInput: Locator;
  readonly reviewEmailInput: Locator;
  readonly reviewTextInput: Locator;
  readonly reviewSubmitButton: Locator;
  readonly orderConfirmationModal: OrderConfirmationModalComponent;

  constructor(page: Page) {
    super(page);
    this.productImage = page.locator(LOCATORS.PRODUCT_DETAILS_PAGE.PRODUCT_IMAGE).first();
    this.productTitle = page.locator(LOCATORS.PRODUCT_DETAILS_PAGE.PRODUCT_TITLE);
    this.productCategory = page.locator(LOCATORS.PRODUCT_DETAILS_PAGE.PRODUCT_CATEGORY);
    this.productPrice = page.locator(LOCATORS.PRODUCT_DETAILS_PAGE.PRODUCT_PRICE).first();
    this.productQuantityInput = page.locator(LOCATORS.PRODUCT_DETAILS_PAGE.PRODUCT_QUANTITY_INPUT);
    this.addToCartButton = page.locator(LOCATORS.PRODUCT_DETAILS_PAGE.ADD_TO_CART_BUTTON);
    this.availabilityText = page.locator(LOCATORS.PRODUCT_DETAILS_PAGE.PRODUCT_AVAILABILITY);
    this.conditionText = page.locator(LOCATORS.PRODUCT_DETAILS_PAGE.PRODUCT_CONDITION);
    this.brandText = page.locator(LOCATORS.PRODUCT_DETAILS_PAGE.PRODUCT_BRAND);
    this.reviewNameInput = page.locator(LOCATORS.PRODUCT_DETAILS_PAGE.REVIEW_NAME_INPUT);
    this.reviewEmailInput = page.locator(LOCATORS.PRODUCT_DETAILS_PAGE.REVIEW_EMAIL_INPUT);
    this.reviewTextInput = page.locator(LOCATORS.PRODUCT_DETAILS_PAGE.REVIEW_TEXT_INPUT);
    this.reviewSubmitButton = page.locator(LOCATORS.PRODUCT_DETAILS_PAGE.REVIEW_SUBMIT_BUTTON);
    this.orderConfirmationModal = new OrderConfirmationModalComponent(page);
  }

  async setQuantity(quantity: string): Promise<void> {
    await this.productQuantityInput.fill(quantity);
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async writeReview(name: string, email: string, review: string): Promise<void> {
    await this.reviewNameInput.fill(name);
    await this.reviewEmailInput.fill(email);
    await this.reviewTextInput.fill(review);
    await this.reviewSubmitButton.click();
  }
}
