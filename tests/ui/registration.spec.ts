import { test, expect } from '../../fixtures';

test.describe('User Registration', () => {
  test('Case 1: Register User', async ({ page, homePage, loginPage }) => {
    // 1. Launch browser (handled by Playwright)
    // 2. Navigate to url 'http://automationexercise.com'
    await homePage.navigate();

    // Accept cookies if present (using our cookie handler)
    await homePage.acceptCookiesIfPresent();

    // 3. Verify that home page is visible successfully
    await expect(homePage.logo).toBeVisible();
    await expect(homePage.featuredItemsHeading).toBeVisible();

    // 4. Click on 'Signup / Login' button
    await homePage.navigateToSignupLogin();

    // 5. Verify 'New User Signup!' is visible
    await expect(loginPage.signupSection).toBeVisible();
    await expect(page.getByText('New User Signup!')).toBeVisible();

    // 6. Enter name and email address & 7. Click 'Signup' button
    const testUser = {
      name: 'Test User',
      email: `testuser${Date.now()}@example.com`,
    };
    await loginPage.startSignup(testUser.name, testUser.email);

    // 8. Verify that 'ENTER ACCOUNT INFORMATION' is visible
    await expect(page.getByText('Enter Account Information')).toBeVisible();

    // Wait for the signup form to be fully loaded
    await expect(loginPage.titleMrRadio).toBeVisible();

    // 9-12. Fill details: Title, Name, Email, Password, Date of birth, checkboxes, and personal info
    const signupDetails = {
      title: 'Mr.' as const,
      password: 'TestPassword123',
      day: '15',
      month: 'January',
      year: '1990',
      newsletter: true,
      offers: true,
      firstName: 'Test',
      lastName: 'User',
      company: 'Test Company',
      address1: '123 Test Street',
      address2: 'Apt 4B',
      country: 'United States',
      state: 'California',
      city: 'San Francisco',
      zipcode: '94102',
      mobile: '1234567890',
    };

    // 13. Fill signup form and create account (fillSignupForm includes clicking the create button)
    await loginPage.fillSignupForm(signupDetails);

    // 14. Verify that 'ACCOUNT CREATED!' is visible
    await expect(page.getByText('Account Created!').first()).toBeVisible();

    // 15. Click 'Continue' button
    await page.getByRole('link', { name: 'Continue' }).click();

    // 16. Verify that 'Logged in as username' is visible
    await expect(page.getByText(`Logged in as ${testUser.name}`)).toBeVisible();

    // 17. Click 'Delete Account' button
    await page.getByRole('link', { name: 'Delete Account' }).click();

    // 18. Verify that 'ACCOUNT DELETED!' is visible and click 'Continue' button
    await expect(page.getByText('Account Deleted!').first()).toBeVisible();
    await page.getByRole('link', { name: 'Continue' }).click();

    // Verify we're back to home page after account deletion
    await expect(homePage.logo).toBeVisible();
  });
});
