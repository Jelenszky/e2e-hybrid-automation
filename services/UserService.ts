import { BaseService } from './BaseService';
import { API_ENDPOINTS, ERROR_MESSAGES } from '../common/constants';
import { APIResponse } from '@playwright/test';

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

export interface UserResponse {
  responseCode?: number;
  message?: string;
  [key: string]: any;
}

export class UserService extends BaseService {
  async createUserAccount(userData: CreateUserData): Promise<UserResponse> {
    const response = await this.createUserAccountResponse(userData);

    if (!response.ok()) {
      throw new Error(
        `${ERROR_MESSAGES.USER.CREATE_FAILED} with status ${response.status()}: ${response.statusText()}`
      );
    }

    return response.json();
  }

  async createUserAccountResponse(userData: CreateUserData): Promise<APIResponse> {
    return this.request.post(`${this.baseURL}${API_ENDPOINTS.CREATE_ACCOUNT}`, {
      data: userData,
    });
  }

  async deleteUserAccount(email: string, password: string): Promise<UserResponse> {
    const response = await this.deleteUserAccountResponse(email, password);

    if (!response.ok()) {
      throw new Error(
        `${ERROR_MESSAGES.USER.DELETE_FAILED} with status ${response.status()}: ${response.statusText()}`
      );
    }

    return response.json();
  }

  async deleteUserAccountResponse(email: string, password: string): Promise<APIResponse> {
    return this.request.delete(`${this.baseURL}${API_ENDPOINTS.DELETE_ACCOUNT}`, {
      data: { email, password },
    });
  }

  async updateUserAccount(
    email: string,
    password: string,
    userData: Partial<CreateUserData>
  ): Promise<UserResponse> {
    const response = await this.updateUserAccountResponse(email, password, userData);

    if (!response.ok()) {
      throw new Error(
        `${ERROR_MESSAGES.USER.UPDATE_FAILED} with status ${response.status()}: ${response.statusText()}`
      );
    }

    return response.json();
  }

  async updateUserAccountResponse(
    email: string,
    password: string,
    userData: Partial<CreateUserData>
  ): Promise<APIResponse> {
    return this.request.put(`${this.baseURL}${API_ENDPOINTS.UPDATE_ACCOUNT}`, {
      data: { email, password, ...userData },
    });
  }

  async getUserAccountByEmail(email: string): Promise<UserResponse> {
    const response = await this.getUserAccountByEmailResponse(email);

    if (!response.ok()) {
      throw new Error(
        `${ERROR_MESSAGES.USER.GET_DETAIL_FAILED} with status ${response.status()}: ${response.statusText()}`
      );
    }

    return response.json();
  }

  async getUserAccountByEmailResponse(email: string): Promise<APIResponse> {
    return this.request.get(
      `${this.baseURL}${API_ENDPOINTS.GET_USER_DETAIL_BY_EMAIL}?email=${email}`
    );
  }
}
