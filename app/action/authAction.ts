import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  RegisterRequest,
  RegisterResponse,
} from "@/app/types/api/auth";
import { register as registerApi } from "@/apiRequest/auth";

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
