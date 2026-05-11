export type MapFocusTarget = {
  lat: number;
  lng: number;
  shopSlug?: string;
  /** Khi chọn đặc sản, truyền danh sách tọa độ tất cả shop có đặc sản đó */
  allShops?: { lat: number; lng: number; shopSlug?: string }[];
};
