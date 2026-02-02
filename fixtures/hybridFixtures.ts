import { test as base } from '@playwright/test';
import {
  HomePage,
  LoginPage,
  CartPage,
  ProductsPage,
  ProductDetailsPage,
  CheckoutPage,
} from '../pages';
import { ServiceFactory, ProductService, UserService } from '../services';
import config from '../playwright.config';

type HybridFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  cartPage: CartPage;
  productsPage: ProductsPage;
  productDetailsPage: ProductDetailsPage;
  checkoutPage: CheckoutPage;
  serviceFactory: ServiceFactory;
  userService: UserService;
  productService: ProductService;
};

const baseURL = config.use?.baseURL;

export const hybridTest = base.extend<HybridFixtures>({
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

  serviceFactory: async ({ request }, use) => {
    const serviceFactory = new ServiceFactory(baseURL!, request);
    await use(serviceFactory);
  },

  userService: async ({ serviceFactory }, use) => {
    const userService = serviceFactory.createUserService();
    await use(userService);
  },

  productService: async ({ serviceFactory }, use) => {
    const productService = serviceFactory.createProductService();
    await use(productService);
  },
});

export const expect = base.expect;
