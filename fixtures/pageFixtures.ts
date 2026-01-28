import { test as base } from '@playwright/test';
import {
  HomePage,
  LoginPage,
  CartPage,
  ProductsPage,
  ProductDetailsPage,
  CheckoutPage,
} from '../pages';

type PageFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  cartPage: CartPage;
  productsPage: ProductsPage;
  productDetailsPage: ProductDetailsPage;
  checkoutPage: CheckoutPage;
};

export const test = base.extend<PageFixtures>({
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
});

export { expect } from '@playwright/test';
