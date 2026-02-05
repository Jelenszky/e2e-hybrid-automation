import { test, expect } from '../../fixtures';
import { UserDataFactory } from '../../common/testData';

test.describe('User Registration', () => {
  test('Register User with Generated Test Data', async ({
    homePage,
    loginPage,
    accountCreatedPage,
    deleteAccountPage,
  }) => {
    const testUser = UserDataFactory.generateUser();

    await homePage.navigate();
    await expect(homePage.logo).toBeVisible();
    await expect(homePage.featuredItemsHeading).toBeVisible();

    await homePage.navigateToSignupLogin();
    await expect(loginPage.signupSection).toBeVisible();
    await expect(homePage.newUserSignupText).toBeVisible();

    await loginPage.startSignup(testUser.name, testUser.email);
    await expect(loginPage.enterAccountInformationText).toBeVisible();
    await expect(loginPage.titleMrRadio).toBeVisible();

    await loginPage.fillSignupForm(testUser);
    await accountCreatedPage.shouldBeLoaded();

    await accountCreatedPage.continueButton.click();
    await expect(homePage.loggedInAsText(testUser.name)).toBeVisible();

    await homePage.deleteAccountLink.click();
    await deleteAccountPage.shouldBeLoaded();
  });

  test('Register User with Custom Address', async ({
    homePage,
    loginPage,
    accountCreatedPage,
    deleteAccountPage,
  }) => {
    const testUser = UserDataFactory.generateUserWithCustomAddress();
    await homePage.navigate();
    await homePage.acceptCookiesIfPresent();
    await expect(homePage.logo).toBeVisible();

    await homePage.navigateToSignupLogin();
    await expect(loginPage.signupSection).toBeVisible();

    await loginPage.startSignup(testUser.name, testUser.email);
    await expect(loginPage.enterAccountInformationText).toBeVisible();
    await expect(loginPage.titleMrRadio).toBeVisible();

    await loginPage.fillSignupForm(testUser);
    await accountCreatedPage.shouldBeLoaded();

    await accountCreatedPage.continueButton.click();
    await expect(homePage.loggedInAsText(testUser.name)).toBeVisible();

    await homePage.deleteAccountLink.click();
    await deleteAccountPage.shouldBeLoaded();

    await deleteAccountPage.continueButton.click();
  });

  test('Should show error when registering with existing email', async ({
    homePage,
    loginPage,
    accountCreatedPage,
  }) => {
    const testUser = UserDataFactory.generateUser();

    await test.step('Register user first time', async () => {
      await homePage.navigate();
      await homePage.navigateToSignupLogin();

      await loginPage.startSignup(testUser.name, testUser.email);
      await expect(loginPage.enterAccountInformationText).toBeVisible();
      await expect(loginPage.titleMrRadio).toBeVisible();

      await loginPage.fillSignupForm(testUser);
      await accountCreatedPage.shouldBeLoaded();

      await accountCreatedPage.continueButton.click();
      await expect(homePage.loggedInAsText(testUser.name)).toBeVisible();

      await homePage.logoutLink.click();
    });

    await test.step('Attempt to register again with same email', async () => {
      await homePage.navigate();
      await homePage.navigateToSignupLogin();
      await loginPage.shouldBeLoaded();

      await loginPage.startSignup(testUser.name, testUser.email);
    });

    await test.step('Verify error message displayed', async () => {
      await expect(loginPage.signupErrorMessage).toBeVisible();
    });
  });

  test('Should reject login with invalid email format', async ({ homePage, loginPage }) => {
    const { nonexistentEmail, invalidPassword } = UserDataFactory.generateInvalidCredentials();

    await homePage.navigate();
    await homePage.navigateToSignupLogin();
    await expect(loginPage.loginSection).toBeVisible();

    await loginPage.loginEmailInput.fill(nonexistentEmail);
    await loginPage.loginPasswordInput.fill(invalidPassword);
    await loginPage.loginButton.click();

    await expect(loginPage.loginErrorMessage).toBeVisible();
  });
});
