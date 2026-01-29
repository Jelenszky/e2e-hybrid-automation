import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { LOCATORS } from './locators';
import { UserRegistrationData } from '../common/testData';

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
  readonly enterAccountInformationText: Locator;
  readonly accountCreatedText: Locator;
  readonly accountDeletedText: Locator;
  readonly continueButton: Locator;
  readonly deleteAccountButton: Locator;

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
    this.enterAccountInformationText = page.getByText(
      LOCATORS.LOGIN_PAGE.ENTER_ACCOUNT_INFORMATION_TEXT
    );
    this.accountCreatedText = page.getByText(LOCATORS.LOGIN_PAGE.ACCOUNT_CREATED_TEXT).first();
    this.accountDeletedText = page.getByText(LOCATORS.LOGIN_PAGE.ACCOUNT_DELETED_TEXT).first();
    this.continueButton = page.getByRole('link', { name: LOCATORS.LOGIN_PAGE.CONTINUE_BUTTON });
    this.deleteAccountButton = page.getByRole('link', {
      name: LOCATORS.LOGIN_PAGE.DELETE_ACCOUNT_BUTTON,
    });
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

  async fillSignupForm(user: UserRegistrationData): Promise<void> {
    if (user.title === 'Mr.') {
      await this.titleMrRadio.check();
    } else {
      await this.titleMrsRadio.check();
    }
    await this.passwordInput.fill(user.password);
    await this.daySelect.selectOption(user.dateOfBirth.day);
    await this.monthSelect.selectOption(user.dateOfBirth.month);
    await this.yearSelect.selectOption(user.dateOfBirth.year);
    if (user.newsletter) await this.newsletterCheckbox.check();
    if (user.offers) await this.offersCheckbox.check();
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    if (user.address.company) await this.companyInput.fill(user.address.company);
    await this.address1Input.fill(user.address.address1);
    if (user.address.address2) await this.address2Input.fill(user.address.address2);
    await this.countrySelect.selectOption(user.address.country);
    await this.stateInput.fill(user.address.state);
    await this.cityInput.fill(user.address.city);
    await this.zipcodeInput.fill(user.address.zipcode);
    await this.mobileNumberInput.fill(user.mobile);
    await this.createAccountButton.click();
  }
}
