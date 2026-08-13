export type Role = 'CUSTOMER' | 'VENDOR' | 'ADMIN';

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  role: Role;
  fullName: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
