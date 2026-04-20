export interface RegisterRequest {
  full_name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

export type UserRole = "user" | "vendor" | "admin";

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface RegisterResponse {
  err: number;
  mess: string;
  data: User;
}