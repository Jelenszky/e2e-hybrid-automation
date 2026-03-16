import { BaseService } from './BaseService';
import { API_ENDPOINTS } from '../common/constants';
import { LoginResponse } from './types';

export interface LoginDetails {
  email: string;
  password: string;
}

export class AuthService extends BaseService {
  async verifyLoginWithValidDetails(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request.post(`${this.baseURL}${API_ENDPOINTS.VERIFY_LOGIN}`, {
      data: this.buildFormData({ email, password }),
    });
    return response.json();
  }

  async verifyLoginWithoutEmailParameter(password: string): Promise<LoginResponse> {
    const response = await this.request.post(`${this.baseURL}${API_ENDPOINTS.VERIFY_LOGIN}`, {
      data: this.buildFormData({ password }),
    });
    return response.json();
  }

  async verifyLoginDelete(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request.delete(`${this.baseURL}${API_ENDPOINTS.VERIFY_LOGIN}`, {
      data: this.buildFormData({ email, password }),
    });
    return response.json();
  }

  async verifyLoginWithInvalidDetails(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request.post(`${this.baseURL}${API_ENDPOINTS.VERIFY_LOGIN}`, {
      data: this.buildFormData({ email, password }),
    });
    return response.json();
  }
}
