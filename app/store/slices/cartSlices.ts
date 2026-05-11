"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

// ============================================================
// Types
// ============================================================

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  discount: number; // phần trăm giảm giá (0-100)
  quantity: number;
  countInStock: number;
  shopId: string;
  shopName: string;
  slug: string;
  selected: boolean; // chọn để thanh toán
}

export interface CartState {
  items: CartItem[];
}

// ============================================================
// Helpers
// ============================================================

/** Tính giá sau khi giảm */
export function calcSalePrice(price: number, discount: number): number {
  return discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
}

// ============================================================
// Initial State
// ============================================================

const initialState: CartState = {
  items: [],
};

// ============================================================
// Slice
// ============================================================

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /**
     * Thêm sản phẩm vào giỏ hàng
     * Nếu sản phẩm đã tồn tại → tăng số lượng
     */
    addToCart: (
      state,
      action: PayloadAction<Omit<CartItem, "selected" | "quantity"> & { quantity?: number }>
    ) => {
      const { quantity = 1, ...rest } = action.payload;
      const existing = state.items.find(
        (item) => item.productId === rest.productId
      );

      if (existing) {
        const newQty = existing.quantity + quantity;
        existing.quantity =
          existing.countInStock > 0
            ? Math.min(newQty, existing.countInStock)
            : newQty;
      } else {
        state.items.push({
          ...rest,
          quantity,
          selected: true,
        });
      }
    },

    /**
     * Xoá một sản phẩm khỏi giỏ hàng
     */
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
    },

    /**
     * Cập nhật số lượng sản phẩm
     */
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (i) => i.productId === action.payload.productId
      );
      if (item) {
        const qty = Math.max(1, action.payload.quantity);
        item.quantity =
          item.countInStock > 0 ? Math.min(qty, item.countInStock) : qty;
      }
    },

    /**
     * Tăng số lượng +1
     */
    increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.productId === action.payload);
      if (item) {
        if (item.countInStock > 0 && item.quantity >= item.countInStock) return;
        item.quantity += 1;
      }
    },

    /**
     * Giảm số lượng -1 (tối thiểu 1)
     */
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.productId === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    /**
     * Toggle chọn / bỏ chọn một sản phẩm
     */
    toggleSelectItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.productId === action.payload);
      if (item) {
        item.selected = !item.selected;
      }
    },

    /**
     * Chọn / bỏ chọn tất cả sản phẩm của một shop
     */
    toggleSelectShop: (
      state,
      action: PayloadAction<{ shopId: string; selected: boolean }>
    ) => {
      state.items
        .filter((item) => item.shopId === action.payload.shopId)
        .forEach((item) => {
          item.selected = action.payload.selected;
        });
    },

    /**
     * Chọn / bỏ chọn tất cả
     */
    toggleSelectAll: (state, action: PayloadAction<boolean>) => {
      state.items.forEach((item) => {
        item.selected = action.payload;
      });
    },

    /**
     * Xoá các sản phẩm đã chọn (sau khi đặt hàng thành công)
     */
    removeSelectedItems: (state) => {
      state.items = state.items.filter((item) => !item.selected);
    },

    /**
     * Xoá tất cả sản phẩm của một shop
     */
    removeShopItems: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.shopId !== action.payload
      );
    },

    /**
     * Xoá toàn bộ giỏ hàng
     */
    clearCart: () => initialState,
  },
});

// ============================================================
// Selectors
// ============================================================

/** Tất cả items trong giỏ */
export const selectCartItems = (state: RootState) => state.cart.items;

/** Tổng số lượng sản phẩm (badge trên icon giỏ hàng) */
export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

/** Các items đã chọn */
export const selectSelectedItems = (state: RootState) =>
  state.cart.items.filter((item) => item.selected);

/** Tổng tiền các items đã chọn */
export const selectSelectedTotal = (state: RootState) =>
  state.cart.items
    .filter((item) => item.selected)
    .reduce(
      (sum, item) => sum + calcSalePrice(item.price, item.discount) * item.quantity,
      0
    );

/** Tổng tiền tất cả items */
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce(
    (sum, item) => sum + calcSalePrice(item.price, item.discount) * item.quantity,
    0
  );

/** Items nhóm theo shop */
export const selectCartGroupedByShop = (state: RootState) => {
  const groups: Record<
    string,
    { shopId: string; shopName: string; items: CartItem[] }
  > = {};

  state.cart.items.forEach((item) => {
    if (!groups[item.shopId]) {
      groups[item.shopId] = {
        shopId: item.shopId,
        shopName: item.shopName,
        items: [],
      };
    }
    groups[item.shopId].items.push(item);
  });

  return Object.values(groups);
};

/** Kiểm tra tất cả đã được chọn chưa */
export const selectIsAllSelected = (state: RootState) =>
  state.cart.items.length > 0 && state.cart.items.every((item) => item.selected);

/** Kiểm tra sản phẩm đã có trong giỏ chưa */
export const selectIsInCart = (productId: string) => (state: RootState) =>
  state.cart.items.some((item) => item.productId === productId);

// ============================================================
// Exports
// ============================================================

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  increaseQuantity,
  decreaseQuantity,
  toggleSelectItem,
  toggleSelectShop,
  toggleSelectAll,
  removeSelectedItems,
  removeShopItems,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
