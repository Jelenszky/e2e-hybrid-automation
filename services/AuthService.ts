import { BaseService } from './BaseService';
import { API_ENDPOINTS, ERROR_MESSAGES } from '../common/constants';
import { APIResponse } from '@playwright/test';

export interface LoginDetails {
  email: string;
  password: string;
}

export interface AuthResponse {
  responseCode?: number;
  message?: string;
  [key: string]: any;
}

export class AuthService extends BaseService {
  async verifyLoginWithValidDetails(email: string, password: string): Promise<AuthResponse> {
    const response = await this.verifyLoginWithValidDetailsResponse(email, password);

    if (!response.ok()) {
      throw new Error(
        `${ERROR_MESSAGES.AUTH.VERIFY_LOGIN_FAILED} with status ${response.status()}: ${response.statusText()}`
      );
    }

    return response.json();
  }

  async verifyLoginWithValidDetailsResponse(email: string, password: string): Promise<APIResponse> {
    return this.request.post(`${this.baseURL}${API_ENDPOINTS.VERIFY_LOGIN}`, {
      data: { email, password },
    });
  }

  async verifyLoginWithoutEmailParameter(password: string): Promise<AuthResponse> {
    const response = await this.verifyLoginWithoutEmailParameterResponse(password);

    if (!response.ok()) {
      throw new Error(
        `${ERROR_MESSAGES.AUTH.VERIFY_LOGIN_FAILED} with status ${response.status()}: ${response.statusText()}`
      );
    }

    return response.json();
  }

  async verifyLoginWithoutEmailParameterResponse(password: string): Promise<APIResponse> {
    return this.request.post(`${this.baseURL}${API_ENDPOINTS.VERIFY_LOGIN}`, {
      data: { password },
    });
  }

  async verifyLoginDelete(email: string, password: string): Promise<AuthResponse> {
    const response = await this.verifyLoginDeleteResponse(email, password);

    if (!response.ok()) {
      throw new Error(
        `${ERROR_MESSAGES.AUTH.VERIFY_LOGIN_FAILED} with status ${response.status()}: ${response.statusText()}`
      );
    }

    return response.json();
  }

  async verifyLoginDeleteResponse(email: string, password: string): Promise<APIResponse> {
    return this.request.delete(`${this.baseURL}${API_ENDPOINTS.VERIFY_LOGIN}`, {
      data: { email, password },
    });
  }

  async verifyLoginWithInvalidDetails(email: string, password: string): Promise<AuthResponse> {
    const response = await this.verifyLoginWithInvalidDetailsResponse(email, password);

    if (!response.ok()) {
      throw new Error(
        `${ERROR_MESSAGES.AUTH.VERIFY_LOGIN_FAILED} with status ${response.status()}: ${response.statusText()}`
      );
    }

    return response.json();
  }

  async verifyLoginWithInvalidDetailsResponse(
    email: string,
    password: string
  ): Promise<APIResponse> {
    return this.request.post(`${this.baseURL}${API_ENDPOINTS.VERIFY_LOGIN}`, {
      data: { email, password },
    });
  }
}
