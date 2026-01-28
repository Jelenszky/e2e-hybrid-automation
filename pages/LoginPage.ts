import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { LOCATORS } from './locators';

export class LoginPage extends BasePage {
  readonly loginSection: Locator;
  readonly signupSection: Locator;
  readonly signupFormSection: Locator;
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;
  readonly titleMrRadio: Locator;
  readonly titleMrsRadio: Locator;
  readonly passwordInput: Locator;
  readonly daySelect: Locator;
  readonly monthSelect: Locator;
  readonly yearSelect: Locator;
  readonly newsletterCheckbox: Locator;
  readonly offersCheckbox: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly companyInput: Locator;
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly createAccountButton: Locator;

  constructor(page: Page) {
    super(page);
    this.loginSection = page.locator(LOCATORS.LOGIN_PAGE.LOGIN_SECTION);
    this.signupSection = page.locator(LOCATORS.LOGIN_PAGE.SIGNUP_SECTION);
    this.signupFormSection = page.locator(LOCATORS.LOGIN_PAGE.SIGNUP_FORM_SECTION);
    this.loginEmailInput = this.loginSection.locator(LOCATORS.LOGIN_PAGE.LOGIN_EMAIL_INPUT);
    this.loginPasswordInput = this.loginSection.locator(LOCATORS.LOGIN_PAGE.LOGIN_PASSWORD_INPUT);
    this.loginButton = this.loginSection.locator(LOCATORS.LOGIN_PAGE.LOGIN_BUTTON);
    this.signupNameInput = this.signupSection.locator(LOCATORS.LOGIN_PAGE.SIGNUP_NAME_INPUT);
    this.signupEmailInput = this.signupSection.locator(LOCATORS.LOGIN_PAGE.SIGNUP_EMAIL_INPUT);
    this.signupButton = this.signupSection.locator(LOCATORS.LOGIN_PAGE.SIGNUP_BUTTON);
    this.titleMrRadio = page.locator(LOCATORS.LOGIN_PAGE.TITLE_MR_RADIO);
    this.titleMrsRadio = page.locator(LOCATORS.LOGIN_PAGE.TITLE_MRS_RADIO);
    this.passwordInput = page.locator(LOCATORS.LOGIN_PAGE.PASSWORD_INPUT);
    this.daySelect = page.locator(LOCATORS.LOGIN_PAGE.DAY_SELECT);
    this.monthSelect = page.locator(LOCATORS.LOGIN_PAGE.MONTH_SELECT);
    this.yearSelect = page.locator(LOCATORS.LOGIN_PAGE.YEAR_SELECT);
    this.newsletterCheckbox = page.locator(LOCATORS.LOGIN_PAGE.NEWSLETTER_CHECKBOX);
    this.offersCheckbox = page.locator(LOCATORS.LOGIN_PAGE.OFFERS_CHECKBOX);
    this.firstNameInput = page.locator(LOCATORS.LOGIN_PAGE.FIRST_NAME_INPUT);
    this.lastNameInput = page.locator(LOCATORS.LOGIN_PAGE.LAST_NAME_INPUT);
    this.companyInput = page.locator(LOCATORS.LOGIN_PAGE.COMPANY_INPUT);
    this.address1Input = page.locator(LOCATORS.LOGIN_PAGE.ADDRESS1_INPUT);
    this.address2Input = page.locator(LOCATORS.LOGIN_PAGE.ADDRESS2_INPUT);
    this.countrySelect = page.locator(LOCATORS.LOGIN_PAGE.COUNTRY_SELECT);
    this.stateInput = page.locator(LOCATORS.LOGIN_PAGE.STATE_INPUT);
    this.cityInput = page.locator(LOCATORS.LOGIN_PAGE.CITY_INPUT);
    this.zipcodeInput = page.locator(LOCATORS.LOGIN_PAGE.ZIPCODE_INPUT);
    this.mobileNumberInput = page.locator(LOCATORS.LOGIN_PAGE.MOBILE_NUMBER_INPUT);
    this.createAccountButton = page.locator(LOCATORS.LOGIN_PAGE.CREATE_ACCOUNT_BUTTON);
  }

  async login(email: string, password: string): Promise<void> {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
  }

  async startSignup(name: string, email: string): Promise<void> {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }

  async fillSignupForm(details: {
    title: 'Mr.' | 'Mrs.';
    password: string;
    day: string;
    month: string;
    year: string;
    newsletter?: boolean;
    offers?: boolean;
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobile: string;
  }): Promise<void> {
    if (details.title === 'Mr.') {
      await this.titleMrRadio.check();
    } else {
      await this.titleMrsRadio.check();
    }
    await this.passwordInput.fill(details.password);
    await this.daySelect.selectOption(details.day);
    await this.monthSelect.selectOption(details.month);
    await this.yearSelect.selectOption(details.year);
    if (details.newsletter) await this.newsletterCheckbox.check();
    if (details.offers) await this.offersCheckbox.check();
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    if (details.company) await this.companyInput.fill(details.company);
    await this.address1Input.fill(details.address1);
    if (details.address2) await this.address2Input.fill(details.address2);
    await this.countrySelect.selectOption(details.country);
    await this.stateInput.fill(details.state);
    await this.cityInput.fill(details.city);
    await this.zipcodeInput.fill(details.zipcode);
    await this.mobileNumberInput.fill(details.mobile);
    await this.createAccountButton.click();
  }
}
