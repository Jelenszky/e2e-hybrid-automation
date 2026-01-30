import { faker } from '@faker-js/faker';
import { Address, AddressBuilder } from './AddressBuilder';

/**
 * User interface - represents a user's personal information
 */
export interface User {
  firstName: string;
  lastName: string;
  mobile: string;
  address: Address;
}

/**
 * User registration data structure - extends User with registration-specific fields
 */
export interface UserRegistrationData extends User {
  name: string;
  email: string;
  password: string;
  title: 'Mr.' | 'Mrs.';
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
  newsletter: boolean;
  offers: boolean;
}

/**
 * Test Data Factory - generates realistic test data using faker.js
 * Provides methods to create complete user profiles or customize specific fields
 */
export class UserDataFactory {
  /**
   * Generate a complete user registration with realistic faker data
   */
  static generateUser(overrides: Partial<UserRegistrationData> = {}): UserRegistrationData {
    const firstName = overrides.name?.split(' ')[0] || faker.person.firstName();
    const lastName = overrides.name?.split(' ')[1] || faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;

    const address = new AddressBuilder({
      company: faker.company.name(),
      address1: faker.location.streetAddress(),
      country: 'United States',
      state: faker.location.state({ abbreviated: false }),
      city: faker.location.city(),
      zipcode: faker.location.zipCode(),
    });

    return {
      name: fullName,
      firstName,
      lastName,
      email: overrides.email || faker.internet.email({ provider: 'example.com' }),
      password: overrides.password || this.generatePassword(),
      title: overrides.title || 'Mr.',
      dateOfBirth: overrides.dateOfBirth || this.generateDateOfBirth(),
      mobile: faker.phone.number({ style: 'international' }).replace(/\D/g, '').slice(-10),
      address: address.build(),
      newsletter: overrides.newsletter ?? true,
      offers: overrides.offers ?? true,
    };
  }

  /**
   * Generate user with custom address - uses faker for all address fields by default
   * @param addressOverrides Optional specific address field values to override
   * @param overrides Optional registration data overrides
   */
  static generateUserWithCustomAddress(
    addressOverrides?: Partial<Address>,
    overrides: Partial<UserRegistrationData> = {}
  ): UserRegistrationData {
    const user = this.generateUser(overrides);
    const addressBuilder = new AddressBuilder(addressOverrides);
    user.address = addressBuilder.build();
    return user;
  }

  /**
   * Generate a strong password
   */
  private static generatePassword(): string {
    return `${faker.lorem.word()}${faker.number.int({ min: 100, max: 999 })}!`;
  }

  /**
   * Generate a realistic date of birth (age 18-65, years within form's range 1900-2021)
   * Ensures the generated date is valid (no Feb 30, etc.)
   * Returns numeric format for dropdown selection
   */
  private static generateDateOfBirth(): UserRegistrationData['dateOfBirth'] {
    // Generate a valid birthdate within age range
    const birthDate = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });

    // Constrain year to form's range (1900-2021)
    let year = birthDate.getFullYear();
    if (year < 1900) year = faker.number.int({ min: 1900, max: 2000 });
    if (year > 2021) year = faker.number.int({ min: 1960, max: 2003 });

    // Get month and day from generated date
    const month = birthDate.getMonth(); // 0-11
    let day = birthDate.getDate(); // 1-31

    // Validate and fix invalid day/month combinations
    // Max days per month: [31, 28/29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    const isLeapYear = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (day > daysInMonth[month]) {
      day = daysInMonth[month]; // Cap day to valid range for the month
    }

    // Create final validated date
    const validDate = new Date(year, month, day);

    // Form dropdowns expect numeric values: day (1-31), month (1-12), year (YYYY)
    return {
      day: String(validDate.getDate()),
      month: String(validDate.getMonth() + 1), // JavaScript months are 0-11, form expects 1-12
      year: String(validDate.getFullYear()),
    };
  }

  /**
   * Generate multiple users
   */
  static generateUsers(count: number): UserRegistrationData[] {
    return Array.from({ length: count }, () => this.generateUser());
  }

  /**
   * Generate user and convert to API format in one call
   * Returns the API-formatted user object with all fields needed for API tests
   */
  static generateApiTestUserData(overrides: Partial<UserRegistrationData> = {}) {
    const user = this.generateUser(overrides);
    return this.toApiFormat(user);
  }

  /**
   * Generate invalid credentials for testing error scenarios
   */
  static generateInvalidCredentials() {
    return {
      nonexistentEmail: faker.internet.email({ provider: 'invalid-test.com' }),
      invalidPassword: `invalid${faker.number.int({ min: 100, max: 999 })}!`,
    };
  }

  /**
   * Convert UserRegistrationData to API request format
   */
  static toApiFormat(user: UserRegistrationData) {
    return {
      name: user.name,
      email: user.email,
      password: user.password,
      title: user.title,
      birth_date: user.dateOfBirth.day,
      birth_month: user.dateOfBirth.month,
      birth_year: user.dateOfBirth.year,
      firstname: user.firstName,
      lastname: user.lastName,
      company: user.address.company,
      address1: user.address.address1,
      address2: user.address.address2,
      country: user.address.country,
      zipcode: user.address.zipcode,
      state: user.address.state,
      city: user.address.city,
      mobile_number: user.mobile,
    };
  }
}
