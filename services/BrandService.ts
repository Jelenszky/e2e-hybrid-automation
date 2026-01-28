import { BaseService } from './BaseService';
import { API_ENDPOINTS, ERROR_MESSAGES } from '../common/constants';
import { APIResponse } from '@playwright/test';

export interface BrandResponse {
  responseCode?: number;
  brands?: any[];
  [key: string]: any;
}

export class BrandService extends BaseService {
  async getAllBrands(): Promise<BrandResponse> {
    const response = await this.getAllBrandsResponse();

    if (!response.ok()) {
      throw new Error(
        `${ERROR_MESSAGES.BRAND.GET_ALL_FAILED} with status ${response.status()}: ${response.statusText()}`
      );
    }

    return response.json();
  }

  async getAllBrandsResponse(): Promise<APIResponse> {
    return this.request.get(`${this.baseURL}${API_ENDPOINTS.BRANDS}`);
  }

  async putToAllBrands(): Promise<BrandResponse> {
    const response = await this.putToAllBrandsResponse();

    if (!response.ok()) {
      throw new Error(
        `${ERROR_MESSAGES.BRAND.PUT_FAILED} with status ${response.status()}: ${response.statusText()}`
      );
    }

    return response.json();
  }

  async putToAllBrandsResponse(): Promise<APIResponse> {
    return this.request.put(`${this.baseURL}${API_ENDPOINTS.BRANDS}`);
  }
}
