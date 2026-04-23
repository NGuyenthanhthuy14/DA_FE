"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AUTH_STATUS, AuthStatus } from "@/app/constants/auth";
import { loginThunk, logoutThunk, registerThunk } from "@/app/action/authAction";
import { UserRole } from "@/app/types/api/auth";

// ============================================================
// Types
// ============================================================

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  avatarUrl?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateProfilePayload {
  full_name: string;
  email: string;
}

export interface UserState {
  user: User | null;
  status: AuthStatus;
  isHydrated: boolean;
  error: string | null;

}

// ============================================================
// Initial State
// ============================================================

const initialState: UserState = {
  user: null,
  status: AUTH_STATUS.IDLE,
  isHydrated: false,
  error: null,

};

// ============================================================
// Slice
// ============================================================

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    /**
     * Set hydration status after redux-persist rehydrates
     */
    setHydrated: (state, action: PayloadAction<boolean>) => {
      state.isHydrated = action.payload;
    },

    /**
     * Start loading state
     */
    authStart: (state) => {
      state.status = AUTH_STATUS.LOADING;
      state.error = null;
    },
    /**
     * Set user profile after successful authentication
     */
    authSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.status = AUTH_STATUS.AUTHENTICATED;
      state.error = null;
    },

    /**
     * Handle authentication failure
     */
    authFailure: (state, action: PayloadAction<string | undefined>) => {
      state.user = null;
      state.status = AUTH_STATUS.UNAUTHENTICATED;
      state.error = action.payload || null;
    },

    /**
     * Update user profile partially
     */
    updateProfile: (state, action: PayloadAction<UpdateProfilePayload>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    /**
     * Logout and clear user data
     */
    logout: (state) => {
      state.user = null;
      state.status = AUTH_STATUS.UNAUTHENTICATED;
      state.error = null;
    },

    /**
     * Reset auth state to initial
     */
    resetAuth: () => initialState,

    /**
     * Clear error
     */
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerThunk.pending, (state) => {
        state.status = AUTH_STATUS.LOADING;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.status = AUTH_STATUS.IDLE;
        state.error = null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.status = AUTH_STATUS.UNAUTHENTICATED;
        state.error = action.payload || "Đăng ký thất bại";
      })
      .addCase(loginThunk.pending, (state) => {
        state.status = AUTH_STATUS.LOADING;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = AUTH_STATUS.AUTHENTICATED;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = AUTH_STATUS.UNAUTHENTICATED;
        state.user = null;
        state.error = action.payload || "Đăng nhập thất bại";
      })
      .addCase(logoutThunk.pending, (state) => {
        state.status = AUTH_STATUS.LOADING;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.status = AUTH_STATUS.UNAUTHENTICATED;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state) => {
        state.status = AUTH_STATUS.UNAUTHENTICATED;
        state.user = null;
        state.error = null;
      });
  },
});

// ============================================================
// Selectors
// ============================================================

export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectIsAuthenticated = (state: { user: UserState }) =>
  !!state.user.user;
export const selectAuthStatus = (state: { user: UserState }) =>
  state.user.status;
export const selectIsLoading = (state: { user: UserState }) =>
  state.user.status === AUTH_STATUS.LOADING;
export const selectIsHydrated = (state: { user: UserState }) =>
  state.user.isHydrated;
export const selectAuthError = (state: { user: UserState }) => state.user.error;

// ============================================================
// Exports
// ============================================================

export const {
  setHydrated,
  authStart,
  authSuccess,
  authFailure,
  updateProfile,
  logout,
  resetAuth,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;
