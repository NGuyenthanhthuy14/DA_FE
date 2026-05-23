import {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RegisterRequest,
  RegisterResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "@/app/types/api/auth";
import { post, put } from "./indext";

export const register = async (
  payload: RegisterRequest,
): Promise<RegisterResponse> => {
  return await post("/auth/register", payload);
};

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  return await post("/auth/login", payload);
};

export const logout = async (): Promise<LogoutResponse> => {
  return await post("/auth/logout");
};

export const updateProfile = async (
  payload: UpdateProfileRequest,
): Promise<UpdateProfileResponse> => {
  return await put("/user/profile", payload);
};
