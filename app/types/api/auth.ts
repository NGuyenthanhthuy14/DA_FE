export interface RegisterRequest {
  full_name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

export type UserRole = "user" | "vendor" | "admin";

export interface User {
  id?: string;
  _id?: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  avatarUrl?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface RegisterResponse {
  err: number;
  mess: string;
  data: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  err: number;
  mess: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LogoutResponse {
  err: number;
  mess: string;
}

export interface UpdateProfileRequest {
  full_name: string;
  email: string;
  phone?: string;
}

export interface UpdateProfileResponse {
  err: number;
  mess: string;
  data: User;
}
