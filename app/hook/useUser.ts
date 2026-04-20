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
import { registerThunk } from "../action/authAction";
import { RegisterRequest } from "../types/api/auth";

export function useUser() {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector(selectUser);
  const status = useSelector(selectAuthStatus);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const isHydrated = useSelector(selectIsHydrated);
  const error = useSelector(selectAuthError);

	const register = useCallback(
		async (payload: RegisterRequest) => {
			await dispatch(registerThunk(payload));
		},
		[dispatch]	
	)

  return {
    dispatch,
    user,
    status,
    isAuthenticated,
    isLoading,
    isHydrated,
    error,
    register,
  };
}
