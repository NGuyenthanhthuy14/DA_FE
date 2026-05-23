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

export const register = async (payload:RegisterRequest) : Promise<RegisterResponse> => {
	return await post("/user/register", payload);
}

export const login = async (payload: LoginRequest) : Promise<LoginResponse> => {
	return await post("/user/login", payload);
}

export const logout = async () : Promise<LogoutResponse> => {
	return await post("/user/logout");
}

export const updateProfile = async (
	payload: UpdateProfileRequest
) : Promise<UpdateProfileResponse> => {
	return await put("/user/profile", payload);
}
