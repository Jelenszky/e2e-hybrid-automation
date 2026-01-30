import { faker } from '@faker-js/faker';

export interface Address {
  company?: string;
  address1: string;
  address2?: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
}

export class AddressBuilder {
  private address: Address;

  constructor(defaults: Partial<Address> = {}) {
    this.address = {
      company: defaults.company,
      address1: defaults.address1 || faker.location.streetAddress(),
      address2: defaults.address2 || faker.location.secondaryAddress(),
      country: defaults.country || 'United States',
      state: defaults.state || faker.location.state({ abbreviated: false }),
      city: defaults.city || faker.location.city(),
      zipcode: defaults.zipcode || faker.location.zipCode(),
    };
  }

  withCompany(company: string): this {
    this.address.company = company;
    return this;
  }

  withAddress1(address1: string): this {
    this.address.address1 = address1;
    return this;
  }

  withAddress2(address2: string): this {
    this.address.address2 = address2;
    return this;
  }

  withCountry(country: string): this {
    this.address.country = country;
    return this;
  }

  withState(state: string): this {
    this.address.state = state;
    return this;
  }

  withCity(city: string): this {
    this.address.city = city;
    return this;
  }

  withZipcode(zipcode: string): this {
    this.address.zipcode = zipcode;
    return this;
  }

  build(): Address {
    return { ...this.address };
  }
}
