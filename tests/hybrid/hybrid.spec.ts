import { test, expect } from '../../fixtures';
import { UserDataFactory } from '../../common/testData';
import { validateUserDataMatches } from '../../common/validators';
import { StatusCodes } from 'http-status-codes';

test.describe('Hybrid: UI + API Integration', () => {
  test('Register user via UI and verify via API', async ({
    homePage,
    loginPage,
    accountCreatedPage,
    userService,
  }) => {
    const userData = UserDataFactory.generateUser();

    await test.step('Complete signup flow via UI', async () => {
      await homePage.navigate();
      await homePage.navigateToSignupLogin();
      await loginPage.startSignup(userData.name, userData.email);
      await expect(loginPage.titleMrRadio).toBeVisible();
      await loginPage.fillSignupForm(userData);
      await accountCreatedPage.shouldBeLoaded();
    });

    await test.step('Verify created user via API', async () => {
      const response = await userService.getUserAccountByEmail(userData.email);

      expect(response.responseCode).toBe(StatusCodes.OK);
      expect(response.user).toBeDefined();
      validateUserDataMatches(response.user, userData);
    });

    await userService.deleteUserAccount(userData.email, userData.password);
  });

  test('Create user via API and login via UI', async ({ homePage, loginPage, userService }) => {
    const userData = UserDataFactory.generateApiTestUserData();

    await test.step('Create user via API', async () => {
      const createResponse = await userService.createUserAccount(userData);
      expect(createResponse.responseCode).toBe(StatusCodes.CREATED);
    });

    await test.step('Login via UI', async () => {
      await homePage.navigate();
      await homePage.navigateToSignupLogin();
      await loginPage.login(userData.email, userData.password);
    });

    await test.step('Verify login successful', async () => {
      expect(await homePage.isUserLoggedIn(userData.name)).toBe(true);
      await expect(homePage.logoutLink).toBeVisible();
    });

    await userService.deleteUserAccount(userData.email, userData.password);
  });

  test('Verify product data consistency between UI and API', async ({
    homePage,
    productsPage,
    productService,
  }) => {
    let apiProductNames: string[] = [];

    await test.step('Get all products via API', async () => {
      const response = await productService.getAllProducts();
      expect(response.responseCode).toBe(StatusCodes.OK);
      expect(response.products).toBeDefined();
      expect(response.products!.length).toBeGreaterThan(0);

      apiProductNames = response.products!.map((p) => p.name.toLowerCase());
    });

    const uiProductNames: string[] = [];

    await test.step('Get all products via UI', async () => {
      await homePage.navigate();
      await homePage.navigateToProducts();
      await productsPage.shouldBeLoaded();

      const uiProducts = await productsPage.productList.getAllProductNames();
      uiProductNames.push(...uiProducts);
    });

    await test.step('Verify product data consistency', async () => {
      for (const apiProduct of apiProductNames) {
        const productExists = uiProductNames.some((uiProduct) => uiProduct.includes(apiProduct));
        expect(productExists).toBeTruthy();
      }
    });
  });

  test('Search products via UI and verify count via API', async ({
    homePage,
    productsPage,
    productService,
  }) => {
    const searchTerm = 'Blue';
    let apiSearchCount = 0;

    await test.step('Search products via API', async () => {
      const response = await productService.searchProduct(searchTerm);
      expect(response.responseCode).toBe(StatusCodes.OK);
      expect(response.products).toBeDefined();
      apiSearchCount = response.products?.length ?? 0;
    });

    let uiSearchCount = 0;

    await test.step('Search products via UI', async () => {
      await homePage.navigate();
      await homePage.navigateToProducts();
      await productsPage.shouldBeLoaded();

      await productsPage.searchProduct(searchTerm);
      uiSearchCount = await productsPage.productList.getProductCount();
    });

    await test.step('Verify search result counts match', async () => {
      expect(apiSearchCount).toBe(uiSearchCount);
    });
  });

  test('Add product via UI and verify cart state', async ({
    homePage,
    loginPage,
    productsPage,
    cartPage,
    userService,
    productService,
  }) => {
    const userData = UserDataFactory.generateApiTestUserData();

    await test.step('Create and login user', async () => {
      const createResponse = await userService.createUserAccount(userData);
      expect(createResponse.responseCode).toBe(StatusCodes.CREATED);

      await homePage.navigate();
      await homePage.navigateToSignupLogin();
      await loginPage.login(userData.email, userData.password);
    });

    let firstProductName = '';

    await test.step('Get first product via API', async () => {
      const response = await productService.getAllProducts();
      expect(response.products).toBeDefined();
      expect(response.products!.length).toBeGreaterThan(0);
      firstProductName = response.products![0].name;
    });

    await test.step('Add product to cart via UI', async () => {
      await homePage.navigateToProducts();
      await productsPage.shouldBeLoaded();

      await productsPage.addProductToCart(0);
    });

    await test.step('Verify product in cart', async () => {
      await homePage.navigateToCart();
      await cartPage.shouldBeLoaded();

      const count = await cartPage.cartItems.count();
      expect(count).toBeGreaterThan(0);

      const cartProductName = await cartPage.getProductName(0);
      expect(cartProductName).toContain(firstProductName);
    });

    await userService.deleteUserAccount(userData.email, userData.password);
  });

  test('Search and add specific product to cart', async ({
    homePage,
    loginPage,
    productsPage,
    cartPage,
    userService,
    productService,
  }) => {
    const userData = UserDataFactory.generateApiTestUserData();
    const searchTerm = 'Blue';

    await test.step('Create and login user', async () => {
      await userService.createUserAccount(userData);
      await homePage.navigate();
      await homePage.navigateToSignupLogin();
      await loginPage.login(userData.email, userData.password);
    });

    let targetProductName = '';

    await test.step('Find search result via API', async () => {
      const response = await productService.searchProduct(searchTerm);
      expect(response.responseCode).toBe(StatusCodes.OK);
      expect(response.products).toBeDefined();
      expect(response.products!.length).toBeGreaterThan(0);
      targetProductName = response.products![0].name;
    });

    await test.step('Find and add searched product to cart', async () => {
      await homePage.navigateToProducts();
      await productsPage.shouldBeLoaded();
      await productsPage.searchProduct(searchTerm);

      await productsPage.findAndAddProductToCart(targetProductName);
    });

    await test.step('Verify correct product added to cart', async () => {
      await homePage.navigateToCart();
      await cartPage.shouldBeLoaded();

      const cartProductName = await cartPage.getProductName(0);
      expect(cartProductName).toContain(targetProductName);
    });

    await userService.deleteUserAccount(userData.email, userData.password);
  });

  test('Verify user deletion', async ({ userService, homePage, loginPage }) => {
    const userData = UserDataFactory.generateApiTestUserData();

    await test.step('Create user via API', async () => {
      const response = await userService.createUserAccount(userData);
      expect(response.responseCode).toBe(StatusCodes.CREATED);
    });

    await test.step('Verify user exists via API', async () => {
      const response = await userService.getUserAccountByEmail(userData.email);
      expect(response.responseCode).toBe(StatusCodes.OK);
    });

    await test.step('Verify user can login via UI', async () => {
      await homePage.navigate();
      await homePage.navigateToSignupLogin();
      await loginPage.login(userData.email, userData.password);
      await expect(homePage.logoutLink).toBeVisible();
      await homePage.navigate();
    });

    await test.step('Delete user via API', async () => {
      const response = await userService.deleteUserAccount(userData.email, userData.password);
      expect(response.responseCode).toBe(StatusCodes.OK);
    });

    await test.step('Verify user deleted via API', async () => {
      const response = await userService.getUserAccountByEmail(userData.email);
      expect(response.responseCode).toBe(StatusCodes.NOT_FOUND);
    });

    await test.step('Verify login fails in UI after deletion', async () => {
      await homePage.navigate();
      await homePage.navigateToSignupLogin();
      await loginPage.login(userData.email, userData.password);

      await expect(loginPage.loginErrorMessage).toBeVisible();
    });
  });
});
