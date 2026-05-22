import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AppDispatch, RootState } from "@/app/store";
import { selectIsAuthenticated } from "@/app/store/slices/userSlices";
import {
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
  selectCartItems,
  selectCartCount,
  selectSelectedItems,
  selectSelectedTotal,
  selectCartTotal,
  selectCartGroupedByShop,
  selectIsAllSelected,
  selectIsInCart,
  type CartItem,
} from "@/app/store/slices/cartSlices";

type AddToCartPayload = Omit<CartItem, "selected" | "quantity"> & {
  quantity?: number;
};

export function useCart() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // ── Selectors ──
  const items = useSelector(selectCartItems);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const cartCount = useSelector(selectCartCount);
  const selectedItems = useSelector(selectSelectedItems);
  const selectedTotal = useSelector(selectSelectedTotal);
  const cartTotal = useSelector(selectCartTotal);
  const groupedByShop = useSelector(selectCartGroupedByShop);
  const isAllSelected = useSelector(selectIsAllSelected);

  // ── Actions ──

  /** Thêm sản phẩm vào giỏ hàng (hiển thị toast) */
  const addItem = useCallback(
    (payload: AddToCartPayload) => {
      // Kiểm tra xác thực - nếu chưa đăng nhập, redirect đến trang login
      if (!isAuthenticated) {
        toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
        router.push("/auth/login");
        return;
      }

      const qty = payload.quantity ?? 1;
      const existing = items.find((i) => i.productId === payload.productId);
      const currentQty = existing ? existing.quantity : 0;
      const stock = payload.countInStock;

      // Kiểm tra tồn kho
      if (stock > 0 && currentQty + qty > stock) {
        if (currentQty >= stock) {
          toast.warning(
            `"${payload.name}" đã đạt giới hạn tồn kho (${stock})`
          );
          return;
        }
        toast.warning(
          `Chỉ còn ${stock - currentQty} sản phẩm "${payload.name}" trong kho`
        );
      }

      dispatch(addToCart(payload));
      const newTotal = Math.min(
        currentQty + qty,
        stock > 0 ? stock : currentQty + qty
      );
      toast.success(`Đã thêm "${payload.name}" vào giỏ hàng (x${newTotal})`);
    },
    [dispatch, items, isAuthenticated, router]
  );

  /** Xoá sản phẩm khỏi giỏ hàng */
  const removeItem = useCallback(
    (productId: string) => {
      dispatch(removeFromCart(productId));
    },
    [dispatch]
  );

  /** Cập nhật số lượng */
  const setQuantity = useCallback(
    (productId: string, qty: number) => {
      dispatch(updateQuantity({ productId, quantity: qty }));
    },
    [dispatch]
  );

  /** Tăng +1 */
  const increase = useCallback(
    (productId: string) => {
      dispatch(increaseQuantity(productId));
    },
    [dispatch]
  );

  /** Giảm -1 */
  const decrease = useCallback(
    (productId: string) => {
      dispatch(decreaseQuantity(productId));
    },
    [dispatch]
  );

  /** Toggle chọn một item */
  const toggleItem = useCallback(
    (productId: string) => {
      dispatch(toggleSelectItem(productId));
    },
    [dispatch]
  );

  /** Toggle chọn tất cả items của một shop */
  const toggleShop = useCallback(
    (shopId: string, selected: boolean) => {
      dispatch(toggleSelectShop({ shopId, selected }));
    },
    [dispatch]
  );

  /** Toggle chọn tất cả */
  const toggleAll = useCallback(
    (selected: boolean) => {
      dispatch(toggleSelectAll(selected));
    },
    [dispatch]
  );

  /** Xoá các items đã chọn (sau khi đặt hàng thành công) */
  const removeSelected = useCallback(() => {
    dispatch(removeSelectedItems());
  }, [dispatch]);

  /** Xoá tất cả items của một shop */
  const removeByShop = useCallback(
    (shopId: string) => {
      dispatch(removeShopItems(shopId));
    },
    [dispatch]
  );

  /** Xoá toàn bộ giỏ hàng */
  const clear = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  /** Kiểm tra sản phẩm đã có trong giỏ chưa */
  const isInCart = useCallback(
    (productId: string) => items.some((item) => item.productId === productId),
    [items]
  );

  return {
    // state
    items,
    cartCount,
    selectedItems,
    selectedTotal,
    cartTotal,
    groupedByShop,
    isAllSelected,

    // actions
    addItem,
    removeItem,
    setQuantity,
    increase,
    decrease,
    toggleItem,
    toggleShop,
    toggleAll,
    removeSelected,
    removeByShop,
    clear,
    isInCart,
  };
}
