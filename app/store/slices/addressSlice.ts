"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

// ============================================================
// Types
// ============================================================

export interface AddressData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  provinceId?: number;
  district: string;
  ward: string;
  districtId?: number;
  wardCode?: string;
  detail: string;
  isDefault: boolean;
}

export interface AddressState {
  current: AddressData;
}

// ============================================================
// Initial State
// ============================================================

const initialState: AddressState = {
  current: {
    fullName: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    detail: "",
    isDefault: true,
  },
};

// ============================================================
// Slice
// ============================================================

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    /**
     * Cập nhật toàn bộ thông tin địa chỉ
     */
    setAddress: (state, action: PayloadAction<AddressData>) => {
      state.current = action.payload;
    },

    /**
     * Cập nhật một phần thông tin
     */
    updateAddress: (state, action: PayloadAction<Partial<AddressData>>) => {
      state.current = { ...state.current, ...action.payload };
    },

    /**
     * Reset về trạng thái ban đầu
     */
    resetAddress: () => initialState,
  },
});

// ============================================================
// Selectors
// ============================================================

export const selectAddress = (state: RootState) => state.address.current;
export const selectHasAddress = (state: RootState) =>
  !!state.address.current.fullName && !!state.address.current.phone;

// ============================================================
// Exports
// ============================================================

export const { setAddress, updateAddress, resetAddress } = addressSlice.actions;
export default addressSlice.reducer;
