"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AUTH_STATUS, AuthStatus } from "@/app/constants/auth";
import { registerThunk } from "@/app/action/authAction";

// ============================================================
// Types
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dob?: string;
  avatarUrl?: string;
}

export interface UpdateProfilePayload {
  name: string;
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
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.status = "unauthenticated";
        state.error = action.payload || "Đăng ký thất bại";
      });
  },
});

// ============================================================
// Selectors
// ============================================================

export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectAuthStatus = (state: { user: UserState }) =>
  state.user.status;
export const selectIsAuthenticated = (state: { user: UserState }) =>
  state.user.status === AUTH_STATUS.AUTHENTICATED;
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
