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

export interface User {
  id: number;
  name: string;
  email: string;
  title?: string;
  birth_day?: string;
  birth_month?: string;
  birth_year?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  address1?: string;
  address2?: string;
  country?: string;
  zipcode?: string;
  state?: string;
  city?: string;
  mobile_number?: string;
}

export interface ApiResponse {
  responseCode: number;
  message?: string;
}

export interface UserResponse extends ApiResponse {
  user: User;
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
