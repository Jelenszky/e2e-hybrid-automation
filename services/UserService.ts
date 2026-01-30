import { BaseService } from './BaseService';
import { API_ENDPOINTS } from '../common/constants';
import { UserResponse } from './types';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  title?: string;
  birth_date?: string;
  birth_month?: string;
  birth_year?: string;
  firstname?: string;
  lastname?: string;
  company?: string;
  address1?: string;
  address2?: string;
  country?: string;
  zipcode?: string;
  state?: string;
  city?: string;
  mobile_number?: string;
}

export class UserService extends BaseService {
  async createUserAccount(userData: CreateUserData): Promise<UserResponse> {
    const response = await this.request.post(`${this.baseURL}${API_ENDPOINTS.CREATE_ACCOUNT}`, {
      data: this.buildFormData(userData),
    });
    return response.json();
  }

  async deleteUserAccount(email: string, password: string): Promise<UserResponse> {
    const response = await this.request.delete(`${this.baseURL}${API_ENDPOINTS.DELETE_ACCOUNT}`, {
      data: this.buildFormData({ email, password }),
    });
    return response.json();
  }

  async updateUserAccount(
    email: string,
    password: string,
    userData: Partial<CreateUserData>
  ): Promise<UserResponse> {
    const response = await this.request.put(`${this.baseURL}${API_ENDPOINTS.UPDATE_ACCOUNT}`, {
      data: this.buildFormData({ email, password, ...userData }),
    });
    return response.json();
  }

  async getUserAccountByEmail(email: string): Promise<UserResponse> {
    const response = await this.request.get(
      `${this.baseURL}${API_ENDPOINTS.GET_USER_DETAIL_BY_EMAIL}?email=${email}`
    );
    return response.json();
  }
}
