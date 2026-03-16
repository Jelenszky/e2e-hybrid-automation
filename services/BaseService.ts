import { APIRequestContext } from '@playwright/test';

export abstract class BaseService {
  constructor(
    protected baseURL: string,
    protected request: APIRequestContext
  ) {}

  protected buildFormData(data: Record<string, string | number | boolean | undefined>): string {
    const formData = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, String(value));
      }
    });
    return formData.toString();
  }
}
