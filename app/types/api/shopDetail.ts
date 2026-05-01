import type { Shop } from "./shops";

export interface ShopDetailResponse {
  statusCode: number;
  error: string | null;
  message: string;
  metadata: Shop;
}
