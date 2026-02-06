import { expect } from '@playwright/test';
import { UserRegistrationData, ApiTestUserData } from '../testData';
import { UserResponseSchemaType } from '../schemas';

function validateUserFields(
  responseUser: Partial<UserResponseSchemaType['user']>,
  fieldMappings: Record<string, string | undefined>
): void {
  Object.entries(fieldMappings).forEach(([responseField, expectedValue]) => {
    if (expectedValue !== undefined) {
      expect(responseUser[responseField as keyof typeof responseUser]).toBe(expectedValue);
    }
  });
}

export function validateUserDataMatches(
  responseUser: Partial<UserResponseSchemaType['user']>,
  expectedData: UserRegistrationData
): void {
  validateUserFields(responseUser, {
    email: expectedData.email,
    name: expectedData.name,
    first_name: expectedData.firstName,
    last_name: expectedData.lastName,
    title: expectedData.title,
    birth_day: expectedData.dateOfBirth.day,
    birth_month: expectedData.dateOfBirth.month,
    birth_year: expectedData.dateOfBirth.year,
    address1: expectedData.address.address1,
    address2: expectedData.address.address2,
    country: expectedData.address.country,
    state: expectedData.address.state,
    city: expectedData.address.city,
    zipcode: expectedData.address.zipcode,
    company: expectedData.address.company,
  });
}

export function validateApiUserDataMatches(
  responseUser: Partial<UserResponseSchemaType['user']>,
  expectedData: ApiTestUserData
): void {
  validateUserFields(responseUser, {
    email: expectedData.email,
    name: expectedData.name,
    first_name: expectedData.firstname,
    last_name: expectedData.lastname,
    title: expectedData.title,
    birth_day: expectedData.birth_date,
    birth_month: expectedData.birth_month,
    birth_year: expectedData.birth_year,
    address1: expectedData.address1,
    address2: expectedData.address2,
    country: expectedData.country,
    state: expectedData.state,
    city: expectedData.city,
    zipcode: expectedData.zipcode,
    company: expectedData.company,
  });
}
