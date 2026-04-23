import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/app/store";
import {
  selectAuthError,
  selectAuthStatus,
  selectIsAuthenticated,
  selectIsHydrated,
  selectIsLoading,
  selectUser,
} from "@/app/store/slices/userSlices";
import { useCallback } from "react";
import { loginThunk, logoutThunk, registerThunk } from "../action/authAction";
import { LoginRequest, RegisterRequest } from "../types/api/auth";

export function useUser() {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector(selectUser);
  const status = useSelector(selectAuthStatus);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const isHydrated = useSelector(selectIsHydrated);
  const error = useSelector(selectAuthError);

  const registerHook = useCallback(
    async (payload: RegisterRequest) => {
      const result = await dispatch(registerThunk(payload)).unwrap();
      return result;
    },
    [dispatch]
  );
  const loginHook = useCallback(
    async (payload: LoginRequest) => {
      const result = await dispatch(loginThunk(payload)).unwrap();
      return result;
    },
    [dispatch]
  );
  const logoutHook = useCallback(async () => {
    const result = await dispatch(logoutThunk()).unwrap();
    return result;
  }, [dispatch]);

  return {
    dispatch,
    user,
    status,
    isAuthenticated,
    isLoading,
    isHydrated,
    error,
    registerHook,
    loginHook,
    logoutHook,
  };
}
