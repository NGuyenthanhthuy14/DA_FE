import { RegisterRequest, RegisterResponse } from "@/app/types/api/auth";
import { post } from "./indext";

export const register = async (payload:RegisterRequest) : Promise<RegisterResponse> => {
	return await post("/user/register", payload);
}