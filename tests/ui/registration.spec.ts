import { test, expect } from '../../fixtures';
import { UserDataFactory } from '../../common/testData';

test.describe('User Registration', () => {
  test('Register User with Generated Test Data', async ({ homePage, loginPage }) => {
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
    await expect(loginPage.accountCreatedText).toBeVisible();

    await loginPage.continueButton.click();
    await expect(homePage.loggedInAsText(testUser.name)).toBeVisible();

    await homePage.deleteAccountLink.click();
    await expect(loginPage.accountDeletedText).toBeVisible();

    await loginPage.continueButton.click();
    await expect(homePage.logo).toBeVisible();
  });

  test('Register User with Custom Address', async ({ homePage, loginPage }) => {
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
    await expect(loginPage.accountCreatedText).toBeVisible();

    await loginPage.continueButton.click();
    await expect(homePage.loggedInAsText(testUser.name)).toBeVisible();

    await homePage.deleteAccountLink.click();
    await expect(loginPage.accountDeletedText).toBeVisible();
  });
});
