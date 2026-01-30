import { BaseService } from './BaseService';
import { API_ENDPOINTS } from '../common/constants';
import { ProductResponse, SearchProductResponse } from './types';

export class ProductService extends BaseService {
  async getAllProducts(): Promise<ProductResponse> {
    const response = await this.request.get(`${this.baseURL}${API_ENDPOINTS.PRODUCTS}`);
    return response.json();
  }

  async searchProduct(searchProduct: string): Promise<SearchProductResponse> {
    const response = await this.request.post(`${this.baseURL}${API_ENDPOINTS.SEARCH_PRODUCT}`, {
      data: this.buildFormData({ search_product: searchProduct }),
    });
    return response.json();
  }

  async searchProductWithoutParameter(): Promise<SearchProductResponse> {
    const response = await this.request.post(`${this.baseURL}${API_ENDPOINTS.SEARCH_PRODUCT}`, {
      data: this.buildFormData({}),
    });
    return response.json();
  }
}
