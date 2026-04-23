import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/app/types/api/auth";
import { register as registerApi } from "@/apiRequest/auth";
import { login as loginApi } from "@/apiRequest/auth";
import { logout as logoutApi } from "@/apiRequest/auth";

export const registerThunk = createAsyncThunk<
  RegisterResponse,
  RegisterRequest,
  { rejectValue: string }
>("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const res = await registerApi(payload);

    if (res.err !== 0) {
      return rejectWithValue(res.mess);
    }

    return res;
  } catch (error: unknown) {
    const apiError = error as { message?: string; mess?: string };
    return rejectWithValue(
      apiError?.message || apiError?.mess || "Đăng ký thất bại"
    );
  }
});

export const loginThunk = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const res = await loginApi(payload);

    if (res.err !== 0) {
      return rejectWithValue(res.mess);
    }

    if (typeof window !== "undefined" && res.accessToken) {
      localStorage.setItem("accessToken", res.accessToken);
    }

    return res;
  } catch (error: unknown) {
    const apiError = error as { message?: string; mess?: string };
    return rejectWithValue(
      apiError?.message || apiError?.mess || "Đăng nhập thất bại"
    );
  }
});

export const logoutThunk = createAsyncThunk<LogoutResponse | null, void>(
  "auth/logout",
  async () => {
    try {
      const res = await logoutApi();
      return res;
    } catch {
      return null;
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("persist:user");
      }
    }
  }
);
