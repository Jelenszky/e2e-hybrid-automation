import { BaseService } from './BaseService';
import { API_ENDPOINTS } from '../common/constants';
import { BrandResponse } from './types';

export class BrandService extends BaseService {
  async getAllBrands(): Promise<BrandResponse> {
    const response = await this.request.get(`${this.baseURL}${API_ENDPOINTS.BRANDS}`);
    return response.json();
  }
}
