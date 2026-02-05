import { test as base } from '@playwright/test';
import {
  HomePage,
  LoginPage,
  CartPage,
  ProductsPage,
  ProductDetailsPage,
  CheckoutPage,
  AccountCreatedPage,
  DeleteAccountPage,
} from '../pages';
import {
  ServiceFactory,
  ProductService,
  BrandService,
  AuthService,
  UserService,
} from '../services';
import config from '../playwright.config';

type AllFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  cartPage: CartPage;
  productsPage: ProductsPage;
  productDetailsPage: ProductDetailsPage;
  checkoutPage: CheckoutPage;
  accountCreatedPage: AccountCreatedPage;
  deleteAccountPage: DeleteAccountPage;
  serviceFactory: ServiceFactory;
  productService: ProductService;
  brandService: BrandService;
  authService: AuthService;
  userService: UserService;
};

const baseURL = config.use?.baseURL;

export const test = base.extend<AllFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  productsPage: async ({ page }, use) => {
    const productsPage = new ProductsPage(page);
    await use(productsPage);
  },

  productDetailsPage: async ({ page }, use) => {
    const productDetailsPage = new ProductDetailsPage(page);
    await use(productDetailsPage);
  },

  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },

  accountCreatedPage: async ({ page }, use) => {
    const accountCreatedPage = new AccountCreatedPage(page);
    await use(accountCreatedPage);
  },

  deleteAccountPage: async ({ page }, use) => {
    const deleteAccountPage = new DeleteAccountPage(page);
    await use(deleteAccountPage);
  },

  serviceFactory: async ({ request }, use) => {
    const serviceFactory = new ServiceFactory(baseURL!, request);
    await use(serviceFactory);
  },

  productService: async ({ serviceFactory }, use) => {
    const productService = serviceFactory.createProductService();
    await use(productService);
  },

  brandService: async ({ serviceFactory }, use) => {
    const brandService = serviceFactory.createBrandService();
    await use(brandService);
  },

  authService: async ({ serviceFactory }, use) => {
    const authService = serviceFactory.createAuthService();
    await use(authService);
  },

  userService: async ({ serviceFactory }, use) => {
    const userService = serviceFactory.createUserService();
    await use(userService);
  },
});

export { expect } from '@playwright/test';
