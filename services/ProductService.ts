import { BaseService } from './BaseService';
import { API_ENDPOINTS, ERROR_MESSAGES } from '../common/constants';
import { APIResponse } from '@playwright/test';

export interface ProductResponse {
  responseCode?: number;
  message?: string;
  [key: string]: any;
}

export class ProductService extends BaseService {
  async getAllProducts(): Promise<ProductResponse> {
    const response = await this.getAllProductsResponse();

    if (!response.ok()) {
      throw new Error(
        `${ERROR_MESSAGES.PRODUCT.GET_ALL_FAILED} with status ${response.status()}: ${response.statusText()}`
      );
    }

    return response.json();
  }

  async getAllProductsResponse(): Promise<APIResponse> {
    return this.request.get(`${this.baseURL}${API_ENDPOINTS.PRODUCTS}`);
  }

  async postToProductsList(): Promise<ProductResponse> {
    const response = await this.postToProductsListResponse();

    if (!response.ok()) {
      throw new Error(
        `${ERROR_MESSAGES.PRODUCT.POST_FAILED} with status ${response.status()}: ${response.statusText()}`
      );
    }

    return response.json();
  }

  async postToProductsListResponse(): Promise<APIResponse> {
    return this.request.post(`${this.baseURL}${API_ENDPOINTS.PRODUCTS}`);
  }

  async searchProduct(searchProduct: string): Promise<ProductResponse> {
    const response = await this.searchProductResponse(searchProduct);

    if (!response.ok()) {
      throw new Error(
        `${ERROR_MESSAGES.PRODUCT.SEARCH_FAILED} with status ${response.status()}: ${response.statusText()}`
      );
    }

    return response.json();
  }

  async searchProductResponse(searchProduct: string): Promise<APIResponse> {
    return this.request.post(`${this.baseURL}${API_ENDPOINTS.SEARCH_PRODUCT}`, {
      data: { search_product: searchProduct },
    });
  }

  async searchProductWithoutParameter(): Promise<ProductResponse> {
    const response = await this.searchProductWithoutParameterResponse();

    if (!response.ok()) {
      throw new Error(
        `${ERROR_MESSAGES.PRODUCT.SEARCH_FAILED} with status ${response.status()}: ${response.statusText()}`
      );
    }

    return response.json();
  }

  async searchProductWithoutParameterResponse(): Promise<APIResponse> {
    return this.request.post(`${this.baseURL}${API_ENDPOINTS.SEARCH_PRODUCT}`);
  }
}
