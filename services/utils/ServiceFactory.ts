import { APIRequestContext } from '@playwright/test';
import { ProductService, BrandService, AuthService, UserService } from '../index';

export class ServiceFactory {
  constructor(
    private baseURL: string,
    private request: APIRequestContext
  ) {}

  createProductService(): ProductService {
    return new ProductService(this.baseURL, this.request);
  }

  createBrandService(): BrandService {
    return new BrandService(this.baseURL, this.request);
  }

  createAuthService(): AuthService {
    return new AuthService(this.baseURL, this.request);
  }

  createUserService(): UserService {
    return new UserService(this.baseURL, this.request);
  }
}
