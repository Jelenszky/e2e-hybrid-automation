export interface Product {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: {
    usertype: {
      usertype: string;
    };
    category: string;
  };
}

export interface Brand {
  id: number;
  brand: string;
}

export interface UserResponseData {
  id: number;
  name: string;
  email: string;
  first_name: string;
  last_name: string;
  title: string;
  birth_day: string;
  birth_month: string;
  birth_year: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
}

export interface ApiResponse {
  responseCode: number;
  message?: string;
}

export interface UserResponse extends ApiResponse {
  user: UserResponseData;
}

export interface LoginResponse extends ApiResponse {
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface ProductResponse extends ApiResponse {
  products?: Product[];
}

export interface BrandResponse extends ApiResponse {
  brands?: Brand[];
}

export interface SearchProductResponse extends ApiResponse {
  products?: Product[];
}
