import { test as base } from '@playwright/test';
import {
  ServiceFactory,
  ProductService,
  BrandService,
  AuthService,
  UserService,
} from '../services';
import config from '../playwright.config';

type APIFixtures = {
  serviceFactory: ServiceFactory;
  productService: ProductService;
  brandService: BrandService;
  authService: AuthService;
  userService: UserService;
};

const baseURL = config.use?.baseURL;

export const apiTest = base.extend<APIFixtures>({
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

export const expect = base.expect;
