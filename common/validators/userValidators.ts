import { expect } from '@playwright/test';
import { User, UserRequestData } from '../testData';
import { UserResponseData } from '../../services/types';

function mapUserToResponseFormat(data: User): Omit<UserResponseData, 'id'> {
  return {
    email: data.email,
    name: data.name,
    first_name: data.firstName,
    last_name: data.lastName,
    title: data.title,
    birth_day: data.dateOfBirth.day,
    birth_month: data.dateOfBirth.month,
    birth_year: data.dateOfBirth.year,
    address1: data.address.address1,
    address2: data.address.address2!,
    country: data.address.country,
    state: data.address.state,
    city: data.address.city,
    zipcode: data.address.zipcode,
    company: data.address.company!,
  };
}

function mapUserRequestToResponseFormat(data: UserRequestData): Omit<UserResponseData, 'id'> {
  return {
    email: data.email,
    name: data.name,
    first_name: data.firstname,
    last_name: data.lastname,
    title: data.title,
    birth_day: data.birth_date,
    birth_month: data.birth_month,
    birth_year: data.birth_year,
    address1: data.address1,
    address2: data.address2!,
    country: data.country,
    state: data.state,
    city: data.city,
    zipcode: data.zipcode,
    company: data.company!,
  };
}

export function validateUserDataMatches(responseUser: UserResponseData, expectedData: User): void {
  const expectedResponse = mapUserToResponseFormat(expectedData);
  expect(responseUser).toMatchObject(expectedResponse);
}

export function validateApiUserDataMatches(
  responseUser: UserResponseData,
  expectedData: UserRequestData
): void {
  const expectedResponse = mapUserRequestToResponseFormat(expectedData);
  expect(responseUser).toMatchObject(expectedResponse);
}
